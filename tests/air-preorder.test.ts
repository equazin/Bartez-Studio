import assert from "node:assert/strict";
import test from "node:test";
import { buildPreorderLines } from "../lib/integrations/air/preorder.ts";

const base = {
  description: "Bomba centrífuga 1HP",
  quantity: 2,
  unitCost: 98500.5,
  taxRate: 21,
};

test("solo toma líneas con sourceSystem air", () => {
  const out = buildPreorderLines([
    { ...base, sourceSystem: "air", sourceCode: "214402" },
    { ...base, sourceSystem: null, sourceCode: null },
    { ...base, sourceSystem: "otro", sourceCode: "X" },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].sourceCode, "214402");
});

test("unitCost pasa a unitPrice; sin costo queda 0 para completar a mano", () => {
  const out = buildPreorderLines([
    { ...base, sourceSystem: "air", sourceCode: "1" },
    { ...base, sourceSystem: "air", sourceCode: "2", unitCost: null },
  ]);
  assert.equal(out[0].unitPrice, 98500.5);
  assert.equal(out[1].unitPrice, 0);
});

test("taxRate 0 o faltante cae al 21 por defecto", () => {
  const out = buildPreorderLines([
    { ...base, sourceSystem: "air", sourceCode: "1", taxRate: 0 },
    { ...base, sourceSystem: "air", sourceCode: "2", taxRate: 10.5 },
  ]);
  assert.equal(out[0].taxRate, 21);
  assert.equal(out[1].taxRate, 10.5);
});

test("descarta cantidades cero o negativas", () => {
  const out = buildPreorderLines([
    { ...base, sourceSystem: "air", sourceCode: "1", quantity: 0 },
    { ...base, sourceSystem: "air", sourceCode: "2", quantity: -3 },
    { ...base, sourceSystem: "air", sourceCode: "3", quantity: 1 },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].sourceCode, "3");
});

test("acepta Decimal-like (objetos con toString) como los de Prisma", () => {
  const dec = (v: string) => ({ toString: () => v });
  const out = buildPreorderLines([
    { sourceSystem: "air", sourceCode: "9", description: "x", quantity: dec("3.5"), unitCost: dec("100.25"), taxRate: dec("10.5") },
  ]);
  assert.equal(out[0].quantity, 3.5);
  assert.equal(out[0].unitPrice, 100.25);
  assert.equal(out[0].taxRate, 10.5);
});

test("sin líneas AIR devuelve vacío", () => {
  assert.deepEqual(buildPreorderLines([{ ...base, sourceSystem: null, sourceCode: null }]), []);
  assert.deepEqual(buildPreorderLines([]), []);
});
