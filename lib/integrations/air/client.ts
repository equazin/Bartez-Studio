/**
 * Cliente HTTP de la API de AIR (https://api.air-intra.com/v2).
 *
 * Sólo lectura. Auth: token bearer obtenido con `?q=login`. El token se cachea
 * en memoria y se persiste en AirCredential para reuso entre invocaciones del
 * cron (serverless). En 401 se re-loguea una vez y reintenta.
 *
 * Credenciales (user/pass): OrgCredential provider "air" (cifrado) con fallback
 * a env AIR_USERNAME / AIR_PASSWORD. Nunca se persiste el password.
 */
import { getAirConfig } from "./config.ts";
import { getCredential } from "../../modules/system/credentials-service.ts";
import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";

const TOKEN_TTL_MS = 50 * 60 * 1000; // conservador: la doc no especifica expiración
const TOKEN_SKEW_MS = 30_000;

let memToken: { orgId: string; token: string; expiresAt: number } | null = null;

/** Extrae el token de una respuesta de login de shape desconocido. */
export function extractToken(json: unknown): string | null {
  if (typeof json === "string") return json.trim() || null;
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    for (const k of ["token", "access_token", "accessToken", "bearer", "jwt", "Token", "auth"]) {
      const v = o[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    if (o.data) return extractToken(o.data);
  }
  return null;
}

async function airCredentials(orgId: string): Promise<{ username: string; password: string }> {
  const username = await getCredential(orgId, "air", "username", "AIR_USERNAME");
  const password = await getCredential(orgId, "air", "password", "AIR_PASSWORD");
  return { username, password };
}

/** ¿Hay credenciales por env? (check sincrónico para gating rápido). */
export function isAirConfiguredSync(): boolean {
  return Boolean(process.env.AIR_USERNAME && process.env.AIR_PASSWORD);
}

async function loadPersistedToken(orgId: string): Promise<string | null> {
  try {
    const row = await getDb().airCredential.findUnique({ where: { organizationId: orgId } });
    if (row?.token && row.tokenExpiresAt && row.tokenExpiresAt.getTime() > Date.now() + TOKEN_SKEW_MS) {
      memToken = { orgId, token: row.token, expiresAt: row.tokenExpiresAt.getTime() };
      return row.token;
    }
  } catch {
    // tabla vacía / sin credencial: seguimos a login
  }
  return null;
}

async function persistToken(orgId: string, token: string, expiresAt: Date, username: string): Promise<void> {
  const cfg = getAirConfig();
  try {
    await getDb().airCredential.upsert({
      where: { organizationId: orgId },
      create: { organizationId: orgId, baseUrl: cfg.baseUrl, username, token, tokenExpiresAt: expiresAt },
      update: { token, tokenExpiresAt: expiresAt, baseUrl: cfg.baseUrl, username },
    });
  } catch (err) {
    logger.warn("air.token.persist_failed", err);
  }
}

async function login(orgId: string): Promise<string> {
  const { username, password } = await airCredentials(orgId);
  if (!username || !password) {
    throw new Error("AIR: faltan credenciales (configurá AIR_USERNAME/AIR_PASSWORD o OrgCredential 'air').");
  }
  const cfg = getAirConfig();
  const url = `${cfg.baseUrl}/?q=login&user=${encodeURIComponent(username)}&pass=${encodeURIComponent(password)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`AIR login HTTP ${res.status}`);
  const json: unknown = await res.json().catch(() => null);
  const token = extractToken(json);
  if (!token) throw new Error("AIR login: no se encontró token en la respuesta.");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  memToken = { orgId, token, expiresAt: expiresAt.getTime() };
  await persistToken(orgId, token, expiresAt, username);
  return token;
}

export async function getToken(orgId: string, force = false): Promise<string> {
  if (!force && memToken && memToken.orgId === orgId && memToken.expiresAt > Date.now() + TOKEN_SKEW_MS) {
    return memToken.token;
  }
  if (!force) {
    const persisted = await loadPersistedToken(orgId);
    if (persisted) return persisted;
  }
  return login(orgId);
}

/** Extrae el array de items de una respuesta (array directo o {data:[...]}). */
function asArray(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object" && Array.isArray((json as Record<string, unknown>).data)) {
    return (json as Record<string, unknown>).data as unknown[];
  }
  return [];
}

async function airRequest(orgId: string, query: string): Promise<unknown[]> {
  const cfg = getAirConfig();
  const doFetch = (token: string): Promise<Response> =>
    fetch(`${cfg.baseUrl}/${query}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}",
    });

  let token = await getToken(orgId);
  let res = await doFetch(token);
  if (res.status === 401) {
    token = await getToken(orgId, true); // re-login una vez
    res = await doFetch(token);
  }
  if (!res.ok) throw new Error(`AIR ${query} HTTP ${res.status}`);
  const json: unknown = await res.json().catch(() => null);
  return asArray(json);
}

/** Una página del catálogo completo (500 items; [] indica fin). page arranca en 0. */
export function fetchArticulosPage(orgId: string, page: number): Promise<unknown[]> {
  return airRequest(orgId, `?q=articulos&page=${page}`);
}

/** Una página de stock+precio reducido. */
export function fetchSypPage(orgId: string, page: number): Promise<unknown[]> {
  return airRequest(orgId, `?q=syp&page=${page}`);
}

/** Verifica que el token vigente sea válido. */
export async function checkToken(orgId: string): Promise<boolean> {
  const cfg = getAirConfig();
  try {
    const token = await getToken(orgId);
    const res = await fetch(`${cfg.baseUrl}/?q=check_token`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch {
    return false;
  }
}
