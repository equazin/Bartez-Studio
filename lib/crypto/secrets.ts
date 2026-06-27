import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Cifrado simétrico para credenciales de integraciones (AES-256-GCM).
 *
 * - La master key se lee de CREDENTIAL_ENCRYPTION_KEY (32 bytes hex = 64 chars).
 * - Cada valor se cifra con IV aleatorio (12 bytes) → no se filtra info por
 *   ciphertexts idénticos.
 * - GCM provee autenticación: si el ciphertext o el authTag se manipulan, el
 *   decrypt lanza y NO devuelve un valor corrupto.
 *
 * Para generar una clave nueva:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const KEY_BYTES = 32;

function masterKey(): Buffer {
  const hex = process.env.CREDENTIAL_ENCRYPTION_KEY?.trim();
  if (!hex) throw new Error("CREDENTIAL_ENCRYPTION_KEY no está configurada");
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres)");
  }
  return Buffer.from(hex, "hex");
}

export interface EncryptedPayload {
  ciphertext: string; // hex
  iv: string; // hex
  authTag: string; // hex
}

export function encryptSecret(plain: string): EncryptedPayload {
  const key = masterKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return {
    ciphertext: ct.toString("hex"),
    iv: iv.toString("hex"),
    authTag: cipher.getAuthTag().toString("hex"),
  };
}

export function decryptSecret(payload: EncryptedPayload): string {
  const key = masterKey();
  const iv = Buffer.from(payload.iv, "hex");
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));
  const pt = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "hex")),
    decipher.final(),
  ]);
  return pt.toString("utf8");
}

/** Para mostrar en UI: revela solo los últimos 4 caracteres. */
export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "•".repeat(value.length);
  return `••••••••${value.slice(-4)}`;
}

/** ¿La master key está disponible y bien formada? Para mostrar warnings en UI. */
export function isEncryptionConfigured(): boolean {
  const hex = process.env.CREDENTIAL_ENCRYPTION_KEY?.trim();
  return Boolean(hex && /^[0-9a-fA-F]{64}$/.test(hex));
}

export const SECRET_KEY_BYTES = KEY_BYTES;
