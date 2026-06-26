import assert from "node:assert/strict";
import test from "node:test";
import { can, isRole, permissionsForRole, isWritePermission } from "../lib/rbac.ts";

test("isRole valida roles conocidos", () => {
  assert.equal(isRole("owner"), true);
  assert.equal(isRole("viewer"), true);
  assert.equal(isRole("superadmin"), false);
  assert.equal(isRole(null), false);
});

test("owner puede todo vía comodín", () => {
  const session = { role: "owner" };
  assert.equal(can(session, "ventas:invoice:create"), true);
  assert.equal(can(session, "finanzas:bank:delete"), true);
});

test("admin tiene comodín por módulo pero no administración global", () => {
  const session = { role: "admin" };
  assert.equal(can(session, "ventas:quote:create"), true);
  assert.equal(can(session, "crm:lead:delete"), true);
  // admin no tiene permiso de plataforma (org/usuarios)
  assert.equal(can(session, "plataforma:org:update"), false);
});

test("member puede operar CRM pero no borrar ni configurar finanzas", () => {
  const session = { role: "member" };
  assert.equal(can(session, "crm:lead:create"), true);
  assert.equal(can(session, "crm:lead:delete"), false);
  assert.equal(can(session, "finanzas:bank:read"), false);
});

test("viewer es solo lectura", () => {
  const session = { role: "viewer" };
  assert.equal(can(session, "crm:lead:read"), true);
  assert.equal(can(session, "crm:lead:create"), false);
  assert.equal(can(session, "ventas:order:update"), false);
});

test("sesión sin rol se trata como owner (compat. pre-Fase 0)", () => {
  assert.equal(can({}, "ventas:invoice:create"), true);
  assert.equal(can({ role: undefined }, "finanzas:bank:delete"), true);
});

test("sesión nula no tiene permisos", () => {
  assert.equal(can(null, "crm:lead:read"), false);
});

test("permisos puntuales del membership amplían el rol", () => {
  const session = { role: "viewer" };
  assert.equal(can(session, "ventas:quote:create"), false);
  assert.equal(can(session, "ventas:quote:create", ["ventas:quote:create"]), true);
});

test("permissionsForRole devuelve set no vacío", () => {
  assert.ok(permissionsForRole("owner").length > 0);
  assert.ok(permissionsForRole("viewer").length > 0);
});

test("isWritePermission distingue lectura de escritura", () => {
  assert.equal(isWritePermission("ventas:quote:create"), true);
  assert.equal(isWritePermission("ventas:quote:update"), true);
  assert.equal(isWritePermission("ventas:quote:delete"), true);
  assert.equal(isWritePermission("ventas:quote:read"), false);
});
