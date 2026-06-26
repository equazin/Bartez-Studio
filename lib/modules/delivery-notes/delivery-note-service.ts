import { getDb } from "../../db.ts";
import { nextNumber } from "../sales/numbering.ts";
import type { DeliveryNoteCreate } from "./schema.ts";

export class DeliveryNoteValidationError extends Error {}

export async function createDeliveryNote(options: { organizationId: string; data: DeliveryNoteCreate }) {
  const db = getDb();
  const data = options.data;

  return db.$transaction(async (tx) => {
    if (data.accountId) {
      const account = await tx.account.findFirst({
        where: { id: data.accountId, organizationId: options.organizationId, deletedAt: null },
        select: { id: true },
      });
      if (!account) throw new DeliveryNoteValidationError("La cuenta indicada no existe en esta organizacion");
    }

    if (data.orderId) {
      const order = await tx.salesOrder.findFirst({
        where: { id: data.orderId, organizationId: options.organizationId, deletedAt: null },
        select: { id: true, accountId: true },
      });
      if (!order) throw new DeliveryNoteValidationError("El pedido indicado no existe en esta organizacion");
      if (data.accountId && order.accountId && order.accountId !== data.accountId) {
        throw new DeliveryNoteValidationError("El pedido no pertenece a la cuenta indicada");
      }
    }

    const { number } = await nextNumber(tx, {
      organizationId: options.organizationId,
      docType: "remito",
      pointOfSale: data.pointOfSale,
    });

    return tx.deliveryNote.create({
      data: {
        organizationId: options.organizationId,
        number,
        pointOfSale: data.pointOfSale,
        accountId: data.accountId,
        orderId: data.orderId,
        receiverName: data.receiverName,
        receiverTaxId: data.receiverTaxId,
        receiverAddress: data.receiverAddress,
        issueDate: data.issueDate ?? new Date(),
        status: "issued",
        notes: data.notes,
        lines: {
          create: data.lines.map((line, idx) => ({
            position: idx,
            productId: line.productId,
            description: line.description,
            quantity: line.quantity,
          })),
        },
      },
      include: { lines: { orderBy: { position: "asc" } } },
    });
  });
}

export async function cancelDeliveryNote(options: { organizationId: string; id: string }) {
  const db = getDb();
  const existing = await db.deliveryNote.findFirst({
    where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
  });
  if (!existing) return null;
  if (existing.status === "cancelled") return existing;
  return db.deliveryNote.update({
    where: { id: existing.id },
    data: { status: "cancelled" },
  });
}
