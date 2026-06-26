import assert from "node:assert/strict";
import test from "node:test";
import { invoiceCreateSchema, invoiceLineSchema } from "../lib/modules/billing/schema.ts";
import { receiptCreateSchema } from "../lib/modules/collections/schema.ts";
import { deliveryNoteCreateSchema } from "../lib/modules/delivery-notes/schema.ts";
import { findDocType } from "../lib/modules/afip/catalog.ts";

test("invoiceLineSchema rechaza cantidad 0", () => {
  assert.equal(invoiceLineSchema.safeParse({ description: "x", quantity: 0, unitPrice: 10 }).success, false);
});

test("invoiceCreateSchema acepta facturas y notas AFIP A/B/C", () => {
  for (const docTypeCode of [1, 2, 3, 6, 7, 8, 11, 12, 13]) {
    assert.equal(invoiceCreateSchema.safeParse({
      docTypeCode,
      pointOfSale: 1,
      receiverName: "Cliente",
      lines: [{ description: "Producto", quantity: 1, unitPrice: 100 }],
    }).success, true);
  }
});

test("catalogo AFIP distingue notas de credito y debito", () => {
  assert.equal(findDocType(3)?.isCreditNote, true);
  assert.equal(findDocType(8)?.isCreditNote, true);
  assert.equal(findDocType(13)?.isCreditNote, true);
  assert.equal(findDocType(2)?.isDebitNote, true);
  assert.equal(findDocType(7)?.isDebitNote, true);
  assert.equal(findDocType(12)?.isDebitNote, true);
});

test("receiptCreateSchema requiere importe positivo", () => {
  assert.equal(receiptCreateSchema.safeParse({ accountId: "a1", amount: 0 }).success, false);
  assert.equal(receiptCreateSchema.safeParse({ accountId: "a1", amount: 100 }).success, true);
});

test("deliveryNoteCreateSchema requiere receptor y lineas", () => {
  assert.equal(deliveryNoteCreateSchema.safeParse({ receiverName: "", lines: [] }).success, false);
  assert.equal(deliveryNoteCreateSchema.safeParse({
    receiverName: "Cliente",
    lines: [{ description: "Producto", quantity: 1 }],
  }).success, true);
});
