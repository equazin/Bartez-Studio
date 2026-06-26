import { getDb } from "../../db.ts";
import type { SerialNumberCreate } from "./schema.ts";

/**
 * Service de garantías y números de serie.
 *
 * - createSerialNumber: registra un equipo individual (in_stock por defecto).
 * - assignSerialOnDelivery: lo marca como "delivered", asigna cuenta y
 *   calcula warrantyUntil a partir del WarrantyTerm vigente del producto.
 * - listExpiringSerials: para alertas (próximos a vencer).
 */

export class WarrantyValidationError extends Error {}

export async function createSerialNumber(options: { organizationId: string; data: SerialNumberCreate }) {
  const db = getDb();
  const existing = await db.serialNumber.findFirst({
    where: { organizationId: options.organizationId, serial: options.data.serial },
  });
  if (existing) throw new WarrantyValidationError("El número de serie ya existe en esta organización");

  return db.serialNumber.create({
    data: {
      organizationId: options.organizationId,
      productId: options.data.productId,
      serial: options.data.serial,
      accountId: options.data.accountId,
      deliveredAt: options.data.deliveredAt ?? null,
      warrantyUntil: options.data.warrantyUntil ?? null,
      status: options.data.status,
      notes: options.data.notes,
      orderLineId: options.data.orderLineId,
      invoiceId: options.data.invoiceId,
    },
  });
}

export async function assignSerialOnDelivery(options: { organizationId: string; serialId: string; accountId: string; deliveredAt?: Date }) {
  const db = getDb();
  const existing = await db.serialNumber.findFirst({
    where: { id: options.serialId, organizationId: options.organizationId },
    include: { product: { include: { warrantyTerms: { where: { active: true } } } } },
  });
  if (!existing) return null;

  const deliveredAt = options.deliveredAt ?? new Date();
  const term = existing.product.warrantyTerms[0];
  const warrantyUntil = term ? new Date(deliveredAt.getTime() + term.durationDays * 86400_000) : null;

  return db.serialNumber.update({
    where: { id: existing.id },
    data: {
      accountId: options.accountId,
      status: "delivered",
      deliveredAt,
      warrantyUntil,
    },
  });
}

export async function listExpiringSerials(options: { organizationId: string; withinDays?: number }) {
  const db = getDb();
  const within = options.withinDays ?? 30;
  const limit = new Date(Date.now() + within * 86400_000);
  return db.serialNumber.findMany({
    where: {
      organizationId: options.organizationId,
      status: "delivered",
      warrantyUntil: { gte: new Date(), lte: limit },
    },
    orderBy: { warrantyUntil: "asc" },
    take: 100,
    include: {
      product: { select: { id: true, sku: true, name: true } },
      account: { select: { id: true, name: true } },
    },
  });
}

export interface WarrantyStatus {
  active: boolean;
  warrantyUntil: Date | null;
  daysLeft: number | null;
}

export function evaluateWarranty(serial: { warrantyUntil: Date | null }): WarrantyStatus {
  if (!serial.warrantyUntil) return { active: false, warrantyUntil: null, daysLeft: null };
  const diffMs = serial.warrantyUntil.getTime() - Date.now();
  const daysLeft = Math.floor(diffMs / 86400_000);
  return { active: daysLeft >= 0, warrantyUntil: serial.warrantyUntil, daysLeft };
}
