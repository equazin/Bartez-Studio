import assert from "node:assert/strict";
import test from "node:test";
import { mergeSettings, DEFAULT_SETTINGS } from "../lib/modules/settings/settings-service.ts";

test("mergeSettings aplica solo las claves provistas", () => {
  const current = { purchaseApprovalThreshold: 100000, alertsWhatsappTo: "549341", alertsEmailTo: "a@b.com" };
  const next = mergeSettings(current, { purchaseApprovalThreshold: 50000 });
  assert.equal(next.purchaseApprovalThreshold, 50000);
  // No pisa los otros campos
  assert.equal(next.alertsWhatsappTo, "549341");
  assert.equal(next.alertsEmailTo, "a@b.com");
});

test("mergeSettings con patch vacío no cambia nada", () => {
  const current = { ...DEFAULT_SETTINGS, alertsEmailTo: "x@y.com" };
  assert.deepEqual(mergeSettings(current, {}), current);
});

test("mergeSettings permite vaciar un campo de texto explícitamente", () => {
  const current = { purchaseApprovalThreshold: 0, alertsWhatsappTo: "549341", alertsEmailTo: "" };
  const next = mergeSettings(current, { alertsWhatsappTo: "" });
  assert.equal(next.alertsWhatsappTo, "");
});
