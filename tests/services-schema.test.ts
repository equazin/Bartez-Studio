import assert from "node:assert/strict";
import test from "node:test";
import {
  workOrderCreateSchema,
  workOrderStatusSchema,
  workOrderItemSchema,
  WORK_ORDER_STATUSES,
  WORK_ORDER_TYPES,
} from "../lib/modules/services/schema.ts";

test("workOrderCreateSchema requiere título", () => {
  assert.equal(workOrderCreateSchema.safeParse({}).success, false);
  assert.equal(workOrderCreateSchema.safeParse({ title: "Instalación BarPOS" }).success, true);
});

test("workOrderCreateSchema usa defaults", () => {
  const wo = workOrderCreateSchema.parse({ title: "x" });
  assert.equal(wo.type, "repair");
  assert.equal(wo.priority, "normal");
  assert.deepEqual(wo.items, []);
});

test("workOrderCreateSchema valida tipos conocidos", () => {
  for (const t of WORK_ORDER_TYPES) {
    assert.equal(workOrderCreateSchema.safeParse({ title: "x", type: t }).success, true);
  }
  assert.equal(workOrderCreateSchema.safeParse({ title: "x", type: "audit" }).success, false);
});

test("workOrderItemSchema valida labor + part", () => {
  assert.equal(workOrderItemSchema.safeParse({ description: "Mano de obra", quantity: 1, unitPrice: 100 }).success, true);
  assert.equal(workOrderItemSchema.safeParse({ kind: "labor", description: "Hora técnico", quantity: 2, unitPrice: 50 }).success, true);
});

test("workOrderItemSchema rechaza cantidad 0", () => {
  assert.equal(workOrderItemSchema.safeParse({ description: "x", quantity: 0, unitPrice: 1 }).success, false);
});

test("workOrderStatusSchema valida estados", () => {
  for (const s of WORK_ORDER_STATUSES) {
    assert.equal(workOrderStatusSchema.safeParse({ status: s }).success, true);
  }
  assert.equal(workOrderStatusSchema.safeParse({ status: "delivered" }).success, false);
});
