import assert from "node:assert/strict";
import test from "node:test";
import { membershipUpdateSchema, teamMemberCreateSchema } from "../lib/modules/team/team-service.ts";

test("teamMemberCreateSchema valida email, password y normaliza", () => {
  assert.equal(teamMemberCreateSchema.safeParse({ email: "no-email", name: "X", password: "12345678" }).success, false);
  assert.equal(teamMemberCreateSchema.safeParse({ email: "a@b.com", name: "X", password: "short" }).success, false);
  const parsed = teamMemberCreateSchema.parse({ email: "Persona@Empresa.COM", name: "Persona", password: "supersecreta" });
  assert.equal(parsed.email, "persona@empresa.com"); // lowercased
  assert.equal(parsed.role, "member"); // default
});

test("teamMemberCreateSchema rechaza roles desconocidos", () => {
  assert.equal(teamMemberCreateSchema.safeParse({ email: "a@b.com", name: "X", password: "12345678", role: "superuser" }).success, false);
});

test("membershipUpdateSchema acepta password opcional con minimo 8", () => {
  assert.equal(membershipUpdateSchema.safeParse({ password: "123" }).success, false);
  assert.equal(membershipUpdateSchema.safeParse({ role: "admin", password: "12345678" }).success, true);
  assert.equal(membershipUpdateSchema.safeParse({ permissions: ["ventas:invoice:create"] }).success, true);
});
