import assert from "node:assert/strict";
import test from "node:test";
import {
  warrantyTermCreateSchema,
  serialNumberCreateSchema,
  SERIAL_STATUSES,
} from "../lib/modules/warranties/schema.ts";
import { evaluateWarranty } from "../lib/modules/warranties/warranty-service.ts";

test("warrantyTermCreateSchema requiere productId", () => {
  assert.equal(warrantyTermCreateSchema.safeParse({}).success, false);
  assert.equal(warrantyTermCreateSchema.safeParse({ productId: "p1" }).success, true);
});

test("warrantyTermCreateSchema default 365 días", () => {
  const t = warrantyTermCreateSchema.parse({ productId: "p1" });
  assert.equal(t.durationDays, 365);
  assert.equal(t.active, true);
});

test("warrantyTermCreateSchema rechaza duración negativa", () => {
  assert.equal(warrantyTermCreateSchema.safeParse({ productId: "p1", durationDays: -1 }).success, false);
});

test("serialNumberCreateSchema requiere productId y serial", () => {
  assert.equal(serialNumberCreateSchema.safeParse({ productId: "p1" }).success, false);
  assert.equal(serialNumberCreateSchema.safeParse({ productId: "p1", serial: "SN001" }).success, true);
});

test("serialNumberCreateSchema acepta status válido", () => {
  for (const s of SERIAL_STATUSES) {
    assert.equal(serialNumberCreateSchema.safeParse({ productId: "p1", serial: "x", status: s }).success, true);
  }
  assert.equal(serialNumberCreateSchema.safeParse({ productId: "p1", serial: "x", status: "broken" }).success, false);
});

test("evaluateWarranty con serial sin garantía", () => {
  const r = evaluateWarranty({ warrantyUntil: null });
  assert.equal(r.active, false);
  assert.equal(r.daysLeft, null);
});

test("evaluateWarranty con garantía vigente", () => {
  const future = new Date(Date.now() + 30 * 86400_000);
  const r = evaluateWarranty({ warrantyUntil: future });
  assert.equal(r.active, true);
  assert.ok(r.daysLeft! >= 29 && r.daysLeft! <= 30);
});

test("evaluateWarranty con garantía vencida", () => {
  const past = new Date(Date.now() - 86400_000);
  const r = evaluateWarranty({ warrantyUntil: past });
  assert.equal(r.active, false);
  assert.ok(r.daysLeft! < 0);
});
