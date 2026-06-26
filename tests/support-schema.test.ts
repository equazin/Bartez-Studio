import assert from "node:assert/strict";
import test from "node:test";
import {
  ticketCreateSchema,
  ticketStatusSchema,
  ticketMessageSchema,
  knowledgeArticleCreateSchema,
  calculateDueAt,
  TICKET_SLA,
  TICKET_STATUSES,
} from "../lib/modules/support/schema.ts";

test("ticketCreateSchema requiere subject", () => {
  assert.equal(ticketCreateSchema.safeParse({}).success, false);
  assert.equal(ticketCreateSchema.safeParse({ subject: "Cliente reporta error" }).success, true);
});

test("ticketCreateSchema usa defaults", () => {
  const t = ticketCreateSchema.parse({ subject: "Test" });
  assert.equal(t.type, "support");
  assert.equal(t.priority, "normal");
  assert.equal(t.channel, "manual");
  assert.equal(t.description, null);
});

test("ticketCreateSchema rechaza tipo desconocido", () => {
  assert.equal(ticketCreateSchema.safeParse({ subject: "x", type: "internal" }).success, false);
});

test("ticketStatusSchema valida estados", () => {
  for (const s of TICKET_STATUSES) {
    assert.equal(ticketStatusSchema.safeParse({ status: s }).success, true);
  }
  assert.equal(ticketStatusSchema.safeParse({ status: "archived" }).success, false);
});

test("ticketMessageSchema requiere body no vacío", () => {
  assert.equal(ticketMessageSchema.safeParse({ body: "" }).success, false);
  assert.equal(ticketMessageSchema.safeParse({ body: "Hola" }).success, true);
});

test("ticketMessageSchema permite mensajes internos", () => {
  const m = ticketMessageSchema.parse({ body: "nota", internal: true });
  assert.equal(m.internal, true);
});

test("calculateDueAt suma horas según prioridad", () => {
  const base = new Date("2026-01-01T00:00:00Z");
  const urgent = calculateDueAt("urgent", base);
  const normal = calculateDueAt("normal", base);
  assert.equal(urgent.getTime() - base.getTime(), TICKET_SLA.urgent.resolveHours * 3600_000);
  assert.equal(normal.getTime() - base.getTime(), TICKET_SLA.normal.resolveHours * 3600_000);
  assert.ok(urgent < normal, "urgente vence antes que normal");
});

test("knowledgeArticleCreateSchema valida slug", () => {
  assert.equal(knowledgeArticleCreateSchema.safeParse({ title: "x", slug: "valid-slug", body: "x" }).success, true);
  assert.equal(knowledgeArticleCreateSchema.safeParse({ title: "x", slug: "Invalid Slug", body: "x" }).success, false);
});

test("knowledgeArticleCreateSchema default published=true", () => {
  const a = knowledgeArticleCreateSchema.parse({ title: "x", slug: "x", body: "x" });
  assert.equal(a.published, true);
  assert.deepEqual(a.tags, []);
});
