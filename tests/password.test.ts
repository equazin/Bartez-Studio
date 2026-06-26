import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "../lib/password.ts";

test("hashPassword produce formato scrypt$salt$hash", async () => {
  const hash = await hashPassword("secreto-123");
  const parts = hash.split("$");
  assert.equal(parts.length, 3);
  assert.equal(parts[0], "scrypt");
  assert.equal(parts[1].length, 32); // 16 bytes en hex
  assert.equal(parts[2].length, 128); // 64 bytes en hex
});

test("verifyPassword acepta la contraseña correcta", async () => {
  const hash = await hashPassword("ContraseñaSegura!");
  assert.equal(await verifyPassword("ContraseñaSegura!", hash), true);
});

test("verifyPassword rechaza la contraseña incorrecta", async () => {
  const hash = await hashPassword("ContraseñaSegura!");
  assert.equal(await verifyPassword("otra", hash), false);
});

test("verifyPassword rechaza formatos inválidos sin lanzar", async () => {
  assert.equal(await verifyPassword("x", "no-es-un-hash"), false);
  assert.equal(await verifyPassword("x", "scrypt$abc"), false);
  assert.equal(await verifyPassword("x", ""), false);
});

test("dos hashes de la misma contraseña difieren (salt aleatorio)", async () => {
  const a = await hashPassword("misma");
  const b = await hashPassword("misma");
  assert.notEqual(a, b);
});
