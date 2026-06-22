import assert from "node:assert/strict";
import test from "node:test";
import { downloadSchema, leadSchema } from "../lib/schema.ts";

test("accepts a valid lead", () => {
  const result = leadSchema.safeParse({
    empresa: "Empresa SA",
    nombre: "Ada Lovelace",
    email: "ada@empresa.test",
    telefono: "3415551234",
    tipoConsulta: "cotizacion",
    mensaje: "Necesitamos equipamiento",
  });
  assert.equal(result.success, true);
});

test("rejects invalid, bot and catalog submissions", () => {
  assert.equal(leadSchema.safeParse({ empresa: "x" }).success, false);
  assert.equal(
    downloadSchema.safeParse({ email: "a@b.com", resource: "brochure", website: "spam" }).success,
    false,
  );
  assert.equal(
    downloadSchema.safeParse({ email: "a@b.com", resource: "catalogo" }).success,
    false,
  );
});