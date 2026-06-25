import assert from "node:assert/strict";
import test from "node:test";
import type { AuditAction, AuditEntity } from "../lib/audit.ts";

test("audit types are correctly constrained", () => {
  const validActions: AuditAction[] = ["create", "update", "delete"];
  const validEntities: AuditEntity[] = ["post", "client", "case", "conversation"];
  assert.equal(validActions.length, 3);
  assert.equal(validEntities.length, 4);
});

test("logAudit handles missing db gracefully", async () => {
  const originalDb = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "";

  const { logAudit } = await import("../lib/audit.ts");
  await assert.doesNotReject(() => logAudit("create", "post", "1", { title: "Test" }));

  process.env.DATABASE_URL = originalDb;
});
