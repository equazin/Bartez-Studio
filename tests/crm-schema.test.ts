import assert from "node:assert/strict";
import test from "node:test";
import {
  accountCreateSchema,
  contactCreateSchema,
  opportunityCreateSchema,
  activityCreateSchema,
  OPPORTUNITY_STAGES,
  ACTIVITY_TYPES,
  leadAssignSchema,
} from "../lib/modules/crm/schema.ts";

test("accountCreateSchema requiere name no vacío", () => {
  assert.equal(accountCreateSchema.safeParse({ name: "" }).success, false);
  assert.equal(accountCreateSchema.safeParse({ name: "Acme" }).success, true);
});

test("accountCreateSchema normaliza email vacío a null", () => {
  const parsed = accountCreateSchema.parse({ name: "Acme", email: "" });
  assert.equal(parsed.email, null);
});

test("accountCreateSchema rechaza email malformado", () => {
  assert.equal(accountCreateSchema.safeParse({ name: "Acme", email: "no-es-email" }).success, false);
});

test("contactCreateSchema acepta sólo firstName", () => {
  const r = contactCreateSchema.safeParse({ firstName: "Juan" });
  assert.equal(r.success, true);
});

test("opportunityCreateSchema acepta etapa válida y rechaza inválida", () => {
  assert.equal(opportunityCreateSchema.safeParse({ title: "X" }).success, true);
  assert.equal(opportunityCreateSchema.safeParse({ title: "X", stage: "ganada-en-español" }).success, false);
});

test("opportunityCreateSchema clampa probabilidad fuera de rango", () => {
  assert.equal(opportunityCreateSchema.safeParse({ title: "X", probability: 120 }).success, false);
  assert.equal(opportunityCreateSchema.safeParse({ title: "X", probability: -10 }).success, false);
});

test("opportunityCreateSchema normaliza amount string a number", () => {
  const r = opportunityCreateSchema.parse({ title: "X", amount: "150.5" });
  assert.equal(r.amount, 150.5);
});

test("activityCreateSchema valida tipos conocidos", () => {
  for (const t of ACTIVITY_TYPES) {
    assert.equal(activityCreateSchema.safeParse({ type: t, subject: "x" }).success, true);
  }
  assert.equal(activityCreateSchema.safeParse({ type: "unknown", subject: "x" }).success, false);
});

test("activityCreateSchema convierte dueAt string ISO en Date", () => {
  const r = activityCreateSchema.parse({ type: "task", subject: "x", dueAt: "2026-07-01T10:00:00Z" });
  assert.ok(r.dueAt instanceof Date);
});

test("leadAssignSchema permite null para desasignar", () => {
  assert.equal(leadAssignSchema.safeParse({ assignedToId: null }).success, true);
  assert.equal(leadAssignSchema.safeParse({ assignedToId: "abc123" }).success, true);
});

test("OPPORTUNITY_STAGES están en orden esperado", () => {
  assert.deepEqual([...OPPORTUNITY_STAGES], ["qualification", "proposal", "negotiation", "won", "lost"]);
});
