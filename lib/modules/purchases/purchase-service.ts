import { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { calcQuote } from "../sales/calc.ts";
import { nextNumber } from "../sales/numbering.ts";
import type { GoodsReceiptCreate, PurchaseOrderCreate, SupplierPaymentCreate } from "./schema.ts";

export class PurchaseValidationError extends Error {}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

async function openPurchaseOrderBalance(tx: Prisma.TransactionClient, organizationId: string, purchaseOrderId: string) {
  const order = await tx.purchaseOrder.findFirst({
    where: { id: purchaseOrderId, organizationId, deletedAt: null },
    include: { allocations: true },
  });
  if (!order) return null;
  const paid = order.allocations.reduce((sum, allocation) => sum + Number(allocation.amount), 0);
  return { order, paid: round2(paid), pending: round2(Number(order.total) - paid) };
}

export async function createPurchaseOrder(options: { organizationId: string; data: PurchaseOrderCreate }) {
  const db = getDb();
  const data = options.data;
  const drafts = data.lines.map((line) => ({
    quantity: Number(line.quantity),
    unitPrice: Number(line.unitPrice),
    discountPct: Number(line.discountPct ?? 0),
    taxRate: Number(line.taxRate ?? 21),
  }));
  const { totals, lines } = calcQuote(drafts);

  return db.$transaction(async (tx) => {
    const supplier = await tx.supplier.findFirst({
      where: { id: data.supplierId, organizationId: options.organizationId, deletedAt: null },
      select: { id: true },
    });
    if (!supplier) throw new PurchaseValidationError("El proveedor no existe");

    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "orden_compra" });
    const issueDate = data.issueDate ?? new Date();

    const purchaseOrder = await tx.purchaseOrder.create({
      data: {
        organizationId: options.organizationId,
        number,
        supplierId: data.supplierId,
        status: "issued",
        currency: data.currency,
        issueDate,
        expectedDate: data.expectedDate ?? null,
        notes: data.notes,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        issuedAt: new Date(),
        lines: {
          create: data.lines.map((line, idx) => ({
            position: idx,
            productId: line.productId,
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discountPct: line.discountPct ?? 0,
            taxRate: line.taxRate ?? 21,
            lineSubtotal: lines[idx].lineSubtotal,
            lineTax: lines[idx].lineTax,
            lineTotal: lines[idx].lineTotal,
          })),
        },
      },
      include: { lines: { orderBy: { position: "asc" } }, supplier: true },
    });

    await tx.supplierAccountEntry.create({
      data: {
        organizationId: options.organizationId,
        supplierId: data.supplierId,
        purchaseOrderId: purchaseOrder.id,
        date: issueDate,
        type: "purchase_order",
        referenceType: "purchase_order",
        referenceId: purchaseOrder.id,
        description: `OC ${number}`,
        debit: 0,
        credit: totals.total,
        currency: data.currency,
      },
    });

    return purchaseOrder;
  });
}

export async function cancelPurchaseOrder(options: { organizationId: string; id: string }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.purchaseOrder.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
    });
    if (!existing) return null;
    if (existing.status === "cancelled") return existing;
    if (existing.status === "partially_received" || existing.status === "received") {
      throw new PurchaseValidationError("No se puede anular una OC con recepciones");
    }

    await tx.supplierAccountEntry.create({
      data: {
        organizationId: options.organizationId,
        supplierId: existing.supplierId,
        purchaseOrderId: existing.id,
        date: new Date(),
        type: "adjust",
        referenceType: "purchase_order",
        referenceId: existing.id,
        description: `Anulacion ${existing.number}`,
        debit: existing.total,
        credit: 0,
        currency: existing.currency,
      },
    });

    return tx.purchaseOrder.update({
      where: { id: existing.id },
      data: { status: "cancelled", cancelledAt: new Date() },
    });
  });
}

export async function receivePurchaseOrder(options: { organizationId: string; data: GoodsReceiptCreate }) {
  const db = getDb();
  const data = options.data;

  return db.$transaction(async (tx) => {
    const order = await tx.purchaseOrder.findFirst({
      where: { id: data.purchaseOrderId, organizationId: options.organizationId, deletedAt: null },
      include: { lines: true },
    });
    if (!order) throw new PurchaseValidationError("La orden de compra no existe");
    if (order.status === "cancelled") throw new PurchaseValidationError("La orden de compra esta anulada");

    const warehouse = await tx.warehouse.findFirst({
      where: { id: data.warehouseId, organizationId: options.organizationId, active: true },
      select: { id: true },
    });
    if (!warehouse) throw new PurchaseValidationError("El deposito no existe");

    const linesById = new Map(order.lines.map((line) => [line.id, line]));
    for (const inputLine of data.lines) {
      const line = linesById.get(inputLine.purchaseOrderLineId);
      if (!line) throw new PurchaseValidationError("Una linea no pertenece a la OC");
      const pending = Number(line.quantity) - Number(line.received);
      if (Number(inputLine.quantity) > pending + 0.0001) {
        throw new PurchaseValidationError(`La recepcion supera el pendiente de ${line.description}`);
      }
    }

    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "recepcion_compra" });
    const receivedAt = data.receivedAt ?? new Date();

    const receipt = await tx.goodsReceipt.create({
      data: {
        organizationId: options.organizationId,
        number,
        supplierId: order.supplierId,
        purchaseOrderId: order.id,
        warehouseId: data.warehouseId,
        receivedAt,
        status: "received",
        notes: data.notes,
        lines: {
          create: data.lines.map((inputLine, idx) => {
            const line = linesById.get(inputLine.purchaseOrderLineId)!;
            return {
              position: idx,
              purchaseOrderLineId: line.id,
              productId: line.productId,
              description: line.description,
              quantity: inputLine.quantity,
              unitCost: line.unitPrice,
            };
          }),
        },
      },
      include: { lines: true },
    });

    for (const inputLine of data.lines) {
      const line = linesById.get(inputLine.purchaseOrderLineId)!;
      const quantity = Number(inputLine.quantity);
      await tx.purchaseOrderLine.update({
        where: { id: line.id },
        data: { received: { increment: quantity } },
      });
      if (line.productId) {
        await tx.stockItem.upsert({
          where: { warehouseId_productId: { warehouseId: data.warehouseId, productId: line.productId } },
          create: { warehouseId: data.warehouseId, productId: line.productId, quantity, reserved: 0 },
          update: { quantity: { increment: quantity } },
        });
        await tx.stockMovement.create({
          data: {
            organizationId: options.organizationId,
            type: "in",
            productId: line.productId,
            warehouseId: data.warehouseId,
            quantity,
            reason: `Recepcion ${number}`,
            referenceType: "purchase_order",
            referenceId: order.id,
          },
        });
      }
    }

    const refreshed = await tx.purchaseOrder.findUnique({
      where: { id: order.id },
      include: { lines: true },
    });
    const allReceived = refreshed?.lines.every((line) => Number(line.received) >= Number(line.quantity) - 0.0001) ?? false;
    const anyReceived = refreshed?.lines.some((line) => Number(line.received) > 0) ?? false;
    await tx.purchaseOrder.update({
      where: { id: order.id },
      data: {
        status: allReceived ? "received" : anyReceived ? "partially_received" : "issued",
        receivedAt: allReceived ? receivedAt : null,
      },
    });

    return receipt;
  });
}

export async function createSupplierPayment(options: { organizationId: string; data: SupplierPaymentCreate }) {
  const db = getDb();
  const data = options.data;
  const totalAllocated = data.allocations.reduce((sum, allocation) => sum + Number(allocation.amount), 0);
  if (totalAllocated > Number(data.amount) + 0.005) {
    throw new PurchaseValidationError("Las imputaciones superan el importe del pago");
  }

  return db.$transaction(async (tx) => {
    const supplier = await tx.supplier.findFirst({
      where: { id: data.supplierId, organizationId: options.organizationId, deletedAt: null },
      select: { id: true },
    });
    if (!supplier) throw new PurchaseValidationError("El proveedor no existe");

    if (data.cashAccountId) {
      const cash = await tx.cashAccount.findFirst({
        where: { id: data.cashAccountId, organizationId: options.organizationId, deletedAt: null },
      });
      if (!cash) throw new PurchaseValidationError("La cuenta de caja/banco no existe");
      if (cash.currency !== data.currency) throw new PurchaseValidationError("La moneda del pago no coincide con caja/banco");
    }

    for (const allocation of data.allocations) {
      const balance = await openPurchaseOrderBalance(tx, options.organizationId, allocation.purchaseOrderId);
      if (!balance || balance.order.supplierId !== data.supplierId) {
        throw new PurchaseValidationError("Una OC no pertenece al proveedor indicado");
      }
      if (Number(allocation.amount) > balance.pending + 0.005) {
        throw new PurchaseValidationError(`La imputacion supera el saldo pendiente de ${balance.order.number}`);
      }
    }

    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "pago_proveedor" });
    const paidAt = data.paidAt ?? new Date();

    const payment = await tx.supplierPayment.create({
      data: {
        organizationId: options.organizationId,
        number,
        supplierId: data.supplierId,
        cashAccountId: data.cashAccountId,
        paidAt,
        method: data.method,
        reference: data.reference,
        amount: data.amount,
        currency: data.currency,
        notes: data.notes,
        allocations: {
          create: data.allocations.map((allocation) => ({
            purchaseOrderId: allocation.purchaseOrderId,
            amount: allocation.amount,
          })),
        },
      },
      include: { allocations: true },
    });

    await tx.supplierAccountEntry.create({
      data: {
        organizationId: options.organizationId,
        supplierId: data.supplierId,
        date: paidAt,
        type: "payment",
        referenceType: "supplier_payment",
        referenceId: payment.id,
        description: `Pago ${number}`,
        debit: data.amount,
        credit: 0,
        currency: data.currency,
      },
    });

    if (data.cashAccountId) {
      await tx.cashMovement.create({
        data: {
          organizationId: options.organizationId,
          cashAccountId: data.cashAccountId,
          type: "expense",
          date: paidAt,
          description: `Pago proveedor ${number}`,
          amount: data.amount,
          currency: data.currency,
          referenceType: "supplier_payment",
          referenceId: payment.id,
        },
      });
      await tx.cashAccount.update({
        where: { id: data.cashAccountId },
        data: { balance: { decrement: data.amount } },
      });
    }

    return payment;
  });
}

export async function getSupplierBalances(organizationId: string, supplierId: string) {
  const db = getDb();
  const entries = await db.supplierAccountEntry.findMany({ where: { organizationId, supplierId } });
  const byCurrency = new Map<string, { debit: number; credit: number }>();
  for (const entry of entries) {
    const totals = byCurrency.get(entry.currency) ?? { debit: 0, credit: 0 };
    totals.debit += Number(entry.debit);
    totals.credit += Number(entry.credit);
    byCurrency.set(entry.currency, totals);
  }
  return Array.from(byCurrency.entries()).map(([currency, totals]) => ({
    currency,
    debit: round2(totals.debit),
    credit: round2(totals.credit),
    balance: round2(totals.credit - totals.debit),
  }));
}
