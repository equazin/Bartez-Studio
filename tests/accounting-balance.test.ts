import assert from "node:assert/strict";
import test from "node:test";
import { accountBalance } from "../lib/modules/accounting/accounting-service.ts";

test("activo y egreso tienen saldo deudor (debe - haber)", () => {
  assert.equal(accountBalance("asset", 1000, 300), 700);
  assert.equal(accountBalance("expense", 500, 0), 500);
});

test("pasivo, PN e ingreso tienen saldo acreedor (haber - debe)", () => {
  assert.equal(accountBalance("liability", 200, 900), 700);
  assert.equal(accountBalance("equity", 0, 1000), 1000);
  assert.equal(accountBalance("income", 100, 1100), 1000);
});

test("saldo redondea a 2 decimales", () => {
  assert.equal(accountBalance("asset", 10.555, 0.005), 10.55);
});

test("saldos negativos posibles (sobregiro)", () => {
  assert.equal(accountBalance("asset", 100, 250), -150);
  assert.equal(accountBalance("liability", 250, 100), -150);
});
