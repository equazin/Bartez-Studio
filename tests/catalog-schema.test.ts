import assert from "node:assert/strict";
import test from "node:test";
import {
  productCreateSchema,
  priceListCreateSchema,
  priceListItemUpsertSchema,
  PRODUCT_TYPES,
} from "../lib/modules/catalog/schema.ts";
import { quoteCreateSchema, quoteLineSchema, QUOTE_STATUSES } from "../lib/modules/sales/schema.ts";

test("productCreateSchema requiere nombre", () => {
  assert.equal(productCreateSchema.safeParse({}).success, false);
  assert.equal(productCreateSchema.safeParse({ name: "BarPOS" }).success, true);
});

test("productCreateSchema usa defaults sensatos", () => {
  const p = productCreateSchema.parse({ name: "Soporte mensual" });
  assert.equal(p.type, "good");
  assert.equal(p.unit, "unit");
  assert.equal(p.taxRate, 21);
  assert.equal(p.active, true);
  assert.equal(p.stockTracked, false);
});

test("productCreateSchema valida tipos conocidos", () => {
  for (const t of PRODUCT_TYPES) {
    assert.equal(productCreateSchema.safeParse({ name: "x", type: t }).success, true);
  }
  assert.equal(productCreateSchema.safeParse({ name: "x", type: "lo-que-sea" }).success, false);
});

test("priceListCreateSchema acepta monedas válidas", () => {
  assert.equal(priceListCreateSchema.safeParse({ name: "L1" }).success, true);
  assert.equal(priceListCreateSchema.safeParse({ name: "L1", currency: "JPY" }).success, false);
});

test("priceListItemUpsertSchema acepta string para precio", () => {
  const r = priceListItemUpsertSchema.parse({ productId: "p1", unitPrice: "1500.50" });
  assert.equal(r.unitPrice, 1500.5);
});

test("quoteLineSchema rechaza cantidad 0", () => {
  assert.equal(quoteLineSchema.safeParse({ description: "x", quantity: 0, unitPrice: 100 }).success, false);
});

test("quoteLineSchema acepta descuento 0-100 y rechaza 101", () => {
  assert.equal(quoteLineSchema.safeParse({ description: "x", quantity: 1, unitPrice: 100, discountPct: 100 }).success, true);
  assert.equal(quoteLineSchema.safeParse({ description: "x", quantity: 1, unitPrice: 100, discountPct: 101 }).success, false);
});

test("quoteCreateSchema requiere al menos una línea", () => {
  assert.equal(quoteCreateSchema.safeParse({ lines: [] }).success, false);
  assert.equal(quoteCreateSchema.safeParse({ lines: [{ description: "x", quantity: 1, unitPrice: 10 }] }).success, true);
});

test("QUOTE_STATUSES contiene flujo completo", () => {
  assert.deepEqual([...QUOTE_STATUSES], ["draft", "sent", "accepted", "rejected", "expired"]);
});
