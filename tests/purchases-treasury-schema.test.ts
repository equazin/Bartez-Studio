import assert from "node:assert/strict";
import test from "node:test";
import {
  PAYMENT_METHODS,
  PURCHASE_ORDER_STATUSES,
  goodsReceiptCreateSchema,
  purchaseOrderCreateSchema,
  purchaseOrderLineSchema,
  supplierCreateSchema,
  supplierPaymentCreateSchema,
} from "../lib/modules/purchases/schema.ts";
import {
  CASH_ACCOUNT_TYPES,
  CASH_MOVEMENT_TYPES,
  cashAccountCreateSchema,
  cashMovementCreateSchema,
} from "../lib/modules/treasury/schema.ts";

test("supplierCreateSchema requiere nombre y normaliza opcionales", () => {
  assert.equal(supplierCreateSchema.safeParse({}).success, false);
  const parsed = supplierCreateSchema.parse({ name: "Proveedor SA", email: undefined });
  assert.equal(parsed.name, "Proveedor SA");
  assert.equal(parsed.active, true);
  assert.equal(parsed.taxId, null);
});

test("purchaseOrderLineSchema valida cantidades y porcentajes", () => {
  assert.equal(purchaseOrderLineSchema.safeParse({ description: "x", quantity: 0, unitPrice: 10 }).success, false);
  assert.equal(purchaseOrderLineSchema.safeParse({ description: "x", quantity: 1, unitPrice: 10, discountPct: 101 }).success, false);
  const line = purchaseOrderLineSchema.parse({ description: "x", quantity: "2", unitPrice: "50" });
  assert.equal(line.quantity, 2);
  assert.equal(line.taxRate, 21);
  assert.equal(line.productId, null);
});

test("purchaseOrderCreateSchema requiere proveedor y al menos una linea", () => {
  assert.equal(purchaseOrderCreateSchema.safeParse({ supplierId: "s1", lines: [] }).success, false);
  assert.equal(
    purchaseOrderCreateSchema.safeParse({
      supplierId: "s1",
      lines: [{ description: "Producto", quantity: 1, unitPrice: 100 }],
    }).success,
    true,
  );
});

test("goodsReceiptCreateSchema requiere deposito y lineas", () => {
  assert.equal(goodsReceiptCreateSchema.safeParse({ purchaseOrderId: "po1", lines: [] }).success, false);
  assert.equal(
    goodsReceiptCreateSchema.safeParse({
      purchaseOrderId: "po1",
      warehouseId: "w1",
      lines: [{ purchaseOrderLineId: "l1", quantity: 1 }],
    }).success,
    true,
  );
});

test("supplierPaymentCreateSchema valida importe e imputaciones", () => {
  assert.equal(supplierPaymentCreateSchema.safeParse({ supplierId: "s1", amount: 0 }).success, false);
  const payment = supplierPaymentCreateSchema.parse({
    supplierId: "s1",
    amount: "120.5",
    allocations: [{ purchaseOrderId: "po1", amount: "20.5" }],
  });
  assert.equal(payment.amount, 120.5);
  assert.equal(payment.currency, "ARS");
  assert.equal(payment.method, "transfer");
});

test("constantes de compras exponen estados y metodos esperados", () => {
  assert.deepEqual([...PURCHASE_ORDER_STATUSES], ["issued", "partially_received", "received", "cancelled"]);
  assert.deepEqual([...PAYMENT_METHODS], ["cash", "transfer", "card", "mercadopago", "other"]);
});

test("cashAccountCreateSchema aplica defaults", () => {
  const account = cashAccountCreateSchema.parse({ name: "Banco Galicia" });
  assert.equal(account.type, "bank");
  assert.equal(account.currency, "ARS");
  assert.equal(account.balance, 0);
  assert.equal(account.active, true);
});

test("cashMovementCreateSchema valida tipo, cuenta e importe", () => {
  assert.equal(cashMovementCreateSchema.safeParse({ type: "expense", description: "Pago", amount: 10 }).success, false);
  assert.equal(cashMovementCreateSchema.safeParse({ cashAccountId: "c1", type: "expense", description: "Pago", amount: 0 }).success, false);
  assert.equal(cashMovementCreateSchema.safeParse({ cashAccountId: "c1", type: "other", description: "Pago", amount: 10 }).success, false);
  assert.equal(cashMovementCreateSchema.safeParse({ cashAccountId: "c1", type: "expense", description: "Pago", amount: 10 }).success, true);
});

test("constantes de tesoreria exponen tipos soportados", () => {
  assert.deepEqual([...CASH_ACCOUNT_TYPES], ["cash", "bank"]);
  assert.deepEqual([...CASH_MOVEMENT_TYPES], ["income", "expense", "adjust"]);
});
