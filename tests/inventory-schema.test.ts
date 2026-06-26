import assert from "node:assert/strict";
import test from "node:test";
import {
  warehouseCreateSchema,
  movementCreateSchema,
  stockReorderSchema,
  MOVEMENT_TYPES,
} from "../lib/modules/inventory/schema.ts";

test("warehouseCreateSchema requiere code y name", () => {
  assert.equal(warehouseCreateSchema.safeParse({}).success, false);
  assert.equal(warehouseCreateSchema.safeParse({ code: "DEP01" }).success, false);
  assert.equal(warehouseCreateSchema.safeParse({ code: "DEP01", name: "Rosario" }).success, true);
});

test("warehouseCreateSchema usa defaults", () => {
  const w = warehouseCreateSchema.parse({ code: "DEP01", name: "Rosario" });
  assert.equal(w.active, true);
  assert.equal(w.isDefault, false);
  assert.equal(w.address, null);
});

test("MOVEMENT_TYPES incluye los 6 tipos", () => {
  assert.deepEqual([...MOVEMENT_TYPES], ["in", "out", "adjust", "transfer", "reserve", "release"]);
});

test("movementCreateSchema in/out/adjust requieren warehouseId", () => {
  assert.equal(
    movementCreateSchema.safeParse({ type: "in", productId: "p1", quantity: 5 }).success,
    false,
    "sin warehouseId debe fallar",
  );
  assert.equal(
    movementCreateSchema.safeParse({ type: "in", productId: "p1", warehouseId: "w1", quantity: 5 }).success,
    true,
  );
  assert.equal(
    movementCreateSchema.safeParse({ type: "adjust", productId: "p1", warehouseId: "w1", quantity: 100 }).success,
    true,
  );
});

test("movementCreateSchema transfer requiere from y to distintos", () => {
  assert.equal(
    movementCreateSchema.safeParse({ type: "transfer", productId: "p1", quantity: 5 }).success,
    false,
    "sin from/to debe fallar",
  );
  assert.equal(
    movementCreateSchema.safeParse({
      type: "transfer", productId: "p1",
      fromWarehouseId: "w1", toWarehouseId: "w1",
      quantity: 5,
    }).success,
    false,
    "from === to debe fallar",
  );
  assert.equal(
    movementCreateSchema.safeParse({
      type: "transfer", productId: "p1",
      fromWarehouseId: "w1", toWarehouseId: "w2",
      quantity: 5,
    }).success,
    true,
  );
});

test("movementCreateSchema rechaza cantidad <= 0", () => {
  assert.equal(
    movementCreateSchema.safeParse({ type: "in", productId: "p1", warehouseId: "w1", quantity: 0 }).success,
    false,
  );
  assert.equal(
    movementCreateSchema.safeParse({ type: "in", productId: "p1", warehouseId: "w1", quantity: -1 }).success,
    false,
  );
});

test("stockReorderSchema rechaza valores negativos", () => {
  assert.equal(stockReorderSchema.safeParse({ reorderPoint: 0 }).success, true);
  assert.equal(stockReorderSchema.safeParse({ reorderPoint: 50 }).success, true);
  assert.equal(stockReorderSchema.safeParse({ reorderPoint: -1 }).success, false);
});
