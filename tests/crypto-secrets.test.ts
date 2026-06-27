import assert from "node:assert/strict";
import test from "node:test";

process.env.CREDENTIAL_ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const { encryptSecret, decryptSecret, maskSecret, isEncryptionConfigured } = await import("../lib/crypto/secrets.ts");

test("encryptSecret + decryptSecret roundtrip", () => {
  const plain = "APP_USR-1234567890abcdef-061025";
  const enc = encryptSecret(plain);
  assert.notEqual(enc.ciphertext, plain);
  assert.equal(typeof enc.iv, "string");
  assert.equal(typeof enc.authTag, "string");
  assert.equal(decryptSecret(enc), plain);
});

test("encryptSecret produce IVs distintos para mismo plaintext", () => {
  const a = encryptSecret("foo");
  const b = encryptSecret("foo");
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.ciphertext, b.ciphertext);
});

test("decryptSecret falla si manipulan el ciphertext", () => {
  const enc = encryptSecret("secreto");
  const corrupt = { ...enc, ciphertext: enc.ciphertext.slice(0, -2) + "ff" };
  assert.throws(() => decryptSecret(corrupt));
});

test("decryptSecret falla si manipulan el authTag", () => {
  const enc = encryptSecret("secreto");
  const corrupt = { ...enc, authTag: "00".repeat(16) };
  assert.throws(() => decryptSecret(corrupt));
});

test("maskSecret deja últimos 4 chars visibles", () => {
  assert.equal(maskSecret("abcdefghij"), "••••••••ghij");
  assert.equal(maskSecret("ab"), "••");
  assert.equal(maskSecret(""), "");
});

test("isEncryptionConfigured detecta clave válida", () => {
  assert.equal(isEncryptionConfigured(), true);
});
