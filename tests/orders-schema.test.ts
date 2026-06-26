import assert from "node:assert/strict";
import test from "node:test";
import {
  orderCreateSchema,
  orderLineSchema,
  orderStatusSchema,
  ORDER_STATUSES,
} from "../lib/modules/orders/schema.ts";

test("ORDER_STATUSES contiene el flujo completo", () => {
  assert.deepEqual(
    [...ORDER_STATUSES],
    ["draft", "confirmed", "in_preparation", "delivered", "cancelled"],
  );
});

test("orderLineSchema rechaza cantidad 0 o negativa", () => {
  assert.equal(orderLineSchema.safeParse({ description: "x", quantity: 0, unitPrice: 10 }).success, false);
  assert.equal(orderLineSchema.safeParse({ description: "x", quantity: -1, unitPrice: 10 }).success, false);
});

test("orderLineSchema permite descripción manual sin productId", () => {
  const r = orderLineSchema.parse({ description: "Servicio especial", quantity: 1, unitPrice: 100 });
  assert.equal(r.productId, null);
  assert.equal(r.taxRate, 21);
  assert.equal(r.discountPct, 0);
});

test("orderCreateSchema requiere al menos una línea", () => {
  assert.equal(orderCreateSchema.safeParse({ lines: [] }).success, false);
  assert.equal(
    orderCreateSchema.safeParse({ lines: [{ description: "x", quantity: 1, unitPrice: 10 }] }).success,
    true,
  );
});

test("orderCreateSchema acepta sin cuenta ni depósito (todo bajo pedido)", () => {
  const r = orderCreateSchema.safeParse({
    lines: [{ description: "x", quantity: 1, unitPrice: 10 }],
  });
  assert.equal(r.success, true);
  if (r.success) {
    assert.equal(r.data.accountId, null);
    assert.equal(r.data.warehouseId, null);
    assert.equal(r.data.currency, "USD");
  }
});

test("orderStatusSchema valida estados conocidos", () => {
  for (const s of ORDER_STATUSES) {
    assert.equal(orderStatusSchema.safeParse({ status: s }).success, true);
  }
  assert.equal(orderStatusSchema.safeParse({ status: "shipped" }).success, false);
});

test("orderLineSchema acepta tasa de impuesto 0 (exento)", () => {
  const r = orderLineSchema.parse({ description: "x", quantity: 1, unitPrice: 100, taxRate: 0 });
  assert.equal(r.taxRate, 0);
});

test("orderLineSchema rechaza descuento > 100", () => {
  assert.equal(
    orderLineSchema.safeParse({ description: "x", quantity: 1, unitPrice: 100, discountPct: 101 }).success,
    false,
  );
});
