/**
 * Cliente HTTP de la API de AIR (https://api.air-intra.com/v2).
 *
 * Sólo lectura. Auth: token bearer fijo, provisto por AIR. Se lee desde
 * OrgCredential provider "air" key "token" (cifrado) con fallback a la env
 * `AIR_TOKEN`. En 401 no hay refresh posible; se propaga el error para que el
 * operador rote el token en el panel.
 *
 * El token se cachea en memoria por proceso (60s) para evitar hits repetidos
 * a la BD desde el cron y las APIs del panel; la credencial ya trae su propio
 * cache en credentials-service, así que esto es solo un cinturón extra.
 */
import { getAirConfig } from "./config.ts";
import { getCredential } from "../../modules/system/credentials-service.ts";

const TOKEN_CACHE_TTL_MS = 60_000;

let memToken: { orgId: string; token: string; at: number } | null = null;

async function readToken(orgId: string): Promise<string> {
  const token = (await getCredential(orgId, "air", "token", "AIR_TOKEN")).trim();
  if (!token) {
    throw new Error("AIR: token no configurado (seteá AIR_TOKEN o cargalo en /admin/integraciones/air).");
  }
  return token;
}

export async function getToken(orgId: string, force = false): Promise<string> {
  if (!force && memToken && memToken.orgId === orgId && Date.now() - memToken.at < TOKEN_CACHE_TTL_MS) {
    return memToken.token;
  }
  const token = await readToken(orgId);
  memToken = { orgId, token, at: Date.now() };
  return token;
}

/** Invalida el cache local del token (útil tras rotarlo desde el panel). */
export function invalidateAirToken(): void {
  memToken = null;
}

/** ¿Hay token por env? (check sincrónico para gating rápido). */
export function isAirConfiguredSync(): boolean {
  return Boolean((process.env.AIR_TOKEN ?? "").trim());
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
  const cfg = await getAirConfig(orgId);
  const token = await getToken(orgId);
  const res = await fetch(`${cfg.baseUrl}/${query}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  if (res.status === 401) {
    invalidateAirToken();
    throw new Error("AIR: token rechazado (401). Rotá el token en /admin/integraciones/air.");
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

/** Verifica que el token vigente sea válido contra ?q=check_token. */
export async function checkToken(orgId: string): Promise<boolean> {
  const cfg = await getAirConfig(orgId);
  try {
    const token = await getToken(orgId);
    const res = await fetch(`${cfg.baseUrl}/?q=check_token`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch {
    return false;
  }
}
