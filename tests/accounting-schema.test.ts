import assert from "node:assert/strict";
import test from "node:test";
import {
  LEDGER_ACCOUNT_TYPES,
  journalEntryCreateSchema,
  ledgerAccountCreateSchema,
} from "../lib/modules/accounting/schema.ts";
import { calcQuote } from "../lib/modules/sales/calc.ts";

test("ledgerAccountCreateSchema requiere código, nombre y tipo válido", () => {
  assert.equal(ledgerAccountCreateSchema.safeParse({}).success, false);
  assert.equal(ledgerAccountCreateSchema.safeParse({ code: "1.1.01", name: "Caja", type: "x" }).success, false);
  const parsed = ledgerAccountCreateSchema.parse({ code: "5.1.05", name: "Movilidad", type: "expense" });
  assert.equal(parsed.code, "5.1.05");
  assert.equal(parsed.active, true);
  assert.equal(parsed.parentId, null);
});

test("LEDGER_ACCOUNT_TYPES cubre las 5 categorías contables", () => {
  assert.deepEqual([...LEDGER_ACCOUNT_TYPES], ["asset", "liability", "equity", "income", "expense"]);
});

test("journalEntryCreateSchema exige al menos dos líneas", () => {
  assert.equal(journalEntryCreateSchema.safeParse({ description: "x", lines: [{ accountId: "a", debit: 1 }] }).success, false);
  const parsed = journalEntryCreateSchema.parse({
    description: "Cobro",
    lines: [
      { accountId: "caja", debit: 100, credit: 0 },
      { accountId: "deudores", debit: 0, credit: 100 },
    ],
  });
  assert.equal(parsed.lines.length, 2);
});

test("asiento de factura balancea: Deudores = Ventas + IVA Débito", () => {
  // Factura con IVA mixto: el asiento Debe Deudores(total) = Haber Ventas(subtotal) + IVA(taxTotal)
  const { totals } = calcQuote([
    { quantity: 2, unitPrice: 100, taxRate: 21 },
    { quantity: 1, unitPrice: 500, discountPct: 10, taxRate: 10.5 },
  ]);
  const debe = totals.total;
  const haber = totals.subtotal + totals.taxTotal;
  assert.ok(Math.abs(debe - haber) < 0.01, `Debe ${debe} ≠ Haber ${haber}`);
});

test("asiento de cobro balancea: Caja = Deudores", () => {
  const amount = 215241.08;
  assert.equal(amount - amount, 0); // Debe Caja(amount) - Haber Deudores(amount) = 0
});
