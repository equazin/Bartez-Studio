import { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { calcQuote } from "../sales/calc.ts";
import { nextNumber } from "../sales/numbering.ts";
import { postAutoEntry, voidAutoEntries } from "../accounting/accounting-service.ts";
import { getOrgSettings } from "../settings/settings-service.ts";
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

  // Umbral de aprobación: si el total supera el configurado, la OC nace
  // pendiente de aprobación y no se puede recibir hasta que un responsable la apruebe.
  const settings = await getOrgSettings(options.organizationId);
  const threshold = settings.purchaseApprovalThreshold;
  const approvalStatus = threshold > 0 && Number(totals.total) >= threshold ? "pending" : "not_required";

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
        approvalStatus,
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

    // Una pre-orden nunca asentó crédito en la cta. cte. del proveedor,
    // así que se cancela sin contra-asiento.
    if (existing.status === "preorden") {
      return tx.purchaseOrder.update({
        where: { id: existing.id },
        data: { status: "cancelled", cancelledAt: new Date() },
      });
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

export async function decidePurchaseOrderApproval(options: {
  organizationId: string;
  id: string;
  decision: "approved" | "rejected";
  userId?: string;
  note?: string | null;
}) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const order = await tx.purchaseOrder.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
    });
    if (!order) return null;
    if (order.approvalStatus !== "pending") {
      throw new PurchaseValidationError("La orden de compra no está pendiente de aprobación");
    }
    return tx.purchaseOrder.update({
      where: { id: order.id },
      data: {
        approvalStatus: options.decision,
        approvedById: options.userId ?? null,
        approvedAt: new Date(),
        approvalNote: options.note ?? null,
      },
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
    if (order.status === "preorden") throw new PurchaseValidationError("La pre-orden debe emitirse antes de recibir mercaderia");
    if (order.approvalStatus === "pending") throw new PurchaseValidationError("La orden de compra requiere aprobacion antes de recibirse");
    if (order.approvalStatus === "rejected") throw new PurchaseValidationError("La orden de compra fue rechazada");

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
  const exchangeRate = Number(data.exchangeRate ?? 1);

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

    let totalEquivalentInPaymentCurrency = 0;
    for (const allocation of data.allocations) {
      const balance = await openPurchaseOrderBalance(tx, options.organizationId, allocation.purchaseOrderId);
      if (!balance || balance.order.supplierId !== data.supplierId) {
        throw new PurchaseValidationError("Una OC no pertenece al proveedor indicado");
      }
      if (Number(allocation.amount) > balance.pending + 0.005) {
        throw new PurchaseValidationError(`La imputacion supera el saldo pendiente de ${balance.order.number}`);
      }
      const orderCurrency = balance.order.currency;
      if (orderCurrency === data.currency) {
        totalEquivalentInPaymentCurrency += Number(allocation.amount);
      } else {
        totalEquivalentInPaymentCurrency += Number(allocation.amount) * exchangeRate;
      }
    }
    if (totalEquivalentInPaymentCurrency > Number(data.amount) + 1) {
      throw new PurchaseValidationError("Las imputaciones superan el importe del pago");
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
        exchangeRate,
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

    // Asiento contable: Debe Proveedores / Haber Caja y Bancos.
    await postAutoEntry(tx, {
      organizationId: options.organizationId,
      date: paidAt,
      description: `Pago ${number}`,
      referenceType: "supplier_payment",
      referenceId: payment.id,
      lines: [
        { code: "2.1.01", debit: Number(data.amount) },
        { code: "1.1.01", credit: Number(data.amount) },
      ],
    });

    return payment;
  });
}

export async function voidSupplierPayment(options: { organizationId: string; id: string }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const payment = await tx.supplierPayment.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
      include: { allocations: true },
    });
    if (!payment) return null;

    await tx.supplierAccountEntry.create({
      data: {
        organizationId: options.organizationId,
        supplierId: payment.supplierId,
        date: new Date(),
        type: "adjust",
        referenceType: "supplier_payment",
        referenceId: payment.id,
        description: `Anulacion pago ${payment.number}`,
        debit: 0,
        credit: payment.amount,
        currency: payment.currency,
      },
    });

    if (payment.cashAccountId) {
      const movement = await tx.cashMovement.findFirst({
        where: { referenceType: "supplier_payment", referenceId: payment.id, voidedAt: null },
      });
      if (movement) {
        await tx.cashMovement.update({ where: { id: movement.id }, data: { voidedAt: new Date() } });
        await tx.cashAccount.update({
          where: { id: payment.cashAccountId },
          data: { balance: { increment: payment.amount } },
        });
      }
    }

    await voidAutoEntries(tx, { organizationId: options.organizationId, referenceType: "supplier_payment", referenceId: payment.id });

    return tx.supplierPayment.update({
      where: { id: payment.id },
      data: { deletedAt: new Date() },
    });
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
