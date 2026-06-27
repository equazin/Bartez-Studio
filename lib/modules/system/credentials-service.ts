import { getDb } from "../../db.ts";
import { decryptSecret, encryptSecret, isEncryptionConfigured } from "../../crypto/secrets.ts";

/**
 * Servicio de credenciales por organización.
 *
 * Patrón de lectura: `getCredential(org, provider, key, envFallback?)`
 *   1. Intenta leer de la BD (cifrado AES-256-GCM).
 *   2. Si no existe O la master key no está configurada, cae a `process.env[envFallback]`.
 *   3. Si nada hay, devuelve "".
 *
 * Patrón de escritura: solo owner; siempre cifrado al guardar; el valor crudo
 * nunca vuelve por API (se devuelven enmascarados).
 */

export type CredentialProvider =
  | "mercadopago"
  | "afip"
  | "openai"
  | "whatsapp"
  | "resend"
  | "brevo"
  | "monday"
  | "apollo"
  | "api_v1";

/** Cache por proceso para reducir hits a la BD en hot paths (webhooks, IA). */
const cache = new Map<string, { value: string; at: number }>();
const CACHE_TTL_MS = 60_000;

function cacheKey(orgId: string, provider: string, key: string): string {
  return `${orgId}::${provider}::${key}`;
}

/** Invalida el cache para una credencial puntual (llamar al guardar/borrar). */
export function invalidateCredentialCache(orgId: string, provider: string, key: string): void {
  cache.delete(cacheKey(orgId, provider, key));
}

/**
 * Lee una credencial: BD → env var fallback → "".
 * Cachea por 60s. Pensado para llamarse desde hot paths.
 */
export async function getCredential(
  organizationId: string,
  provider: CredentialProvider | string,
  key: string,
  envFallback?: string,
): Promise<string> {
  const cKey = cacheKey(organizationId, provider, key);
  const cached = cache.get(cKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  let value = "";
  if (isEncryptionConfigured()) {
    try {
      const row = await getDb().orgCredential.findUnique({
        where: { organizationId_provider_key: { organizationId, provider, key } },
      });
      if (row) {
        value = decryptSecret({ ciphertext: row.valueCiphertext, iv: row.iv, authTag: row.authTag });
      }
    } catch {
      // Si la decryption falla (master key rotada / dato corrupto) seguimos al env
      value = "";
    }
  }
  if (!value && envFallback) value = process.env[envFallback] ?? "";

  cache.set(cKey, { value, at: Date.now() });
  return value;
}

/** Versión sincrónica via env-only (para módulos que no pueden ser async). */
export function getEnvCredential(envVar: string): string {
  return process.env[envVar] ?? "";
}

export async function setCredential(
  organizationId: string,
  provider: CredentialProvider | string,
  key: string,
  plainValue: string,
): Promise<void> {
  if (!isEncryptionConfigured()) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY no está configurada en el servidor");
  }
  const enc = encryptSecret(plainValue);
  await getDb().orgCredential.upsert({
    where: { organizationId_provider_key: { organizationId, provider, key } },
    create: { organizationId, provider, key, valueCiphertext: enc.ciphertext, iv: enc.iv, authTag: enc.authTag },
    update: { valueCiphertext: enc.ciphertext, iv: enc.iv, authTag: enc.authTag },
  });
  invalidateCredentialCache(organizationId, provider, key);
}

export async function deleteCredential(
  organizationId: string,
  provider: CredentialProvider | string,
  key: string,
): Promise<void> {
  await getDb().orgCredential.deleteMany({
    where: { organizationId, provider, key },
  });
  invalidateCredentialCache(organizationId, provider, key);
}

/** Lista credenciales de una org (sin valores; solo metadata). */
export async function listCredentials(organizationId: string) {
  const rows = await getDb().orgCredential.findMany({
    where: { organizationId },
    select: { provider: true, key: true, updatedAt: true },
    orderBy: [{ provider: "asc" }, { key: "asc" }],
  });
  return rows;
}

/** Devuelve el valor enmascarado de una credencial para mostrar en UI. */
export async function getCredentialPreview(organizationId: string, provider: string, key: string): Promise<string | null> {
  const value = await getCredential(organizationId, provider, key);
  if (!value) return null;
  if (value.length <= 4) return "•".repeat(value.length);
  return `••••${value.slice(-4)}`;
}
