import { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import type { MovementCreate } from "./schema.ts";

/**
 * Service de inventario — encapsula la lógica de los movimientos de stock.
 *
 * Tipos de movimiento:
 *  - in:       suma al stockItem (quantity)
 *  - out:      resta del stockItem; si no alcanza, falla con OutOfStockError
 *  - adjust:   setea cantidad absoluta (cuenta física)
 *  - transfer: out en from + in en to (atómico)
 *  - reserve:  incrementa stockItem.reserved (no toca quantity)
 *  - release:  decrementa stockItem.reserved
 *
 * El stock "disponible" para reservar = quantity - reserved.
 */

export class OutOfStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OutOfStockError";
  }
}

type TxClient = Prisma.TransactionClient;

/**
 * Asegura una fila StockItem para (warehouseId, productId) y devuelve el id.
 */
async function ensureStockItem(tx: TxClient, warehouseId: string, productId: string): Promise<{ id: string; quantity: Prisma.Decimal; reserved: Prisma.Decimal }> {
  const existing = await tx.stockItem.findUnique({ where: { warehouseId_productId: { warehouseId, productId } } });
  if (existing) return { id: existing.id, quantity: existing.quantity, reserved: existing.reserved };
  const created = await tx.stockItem.create({
    data: { warehouseId, productId, quantity: 0, reserved: 0 },
  });
  return { id: created.id, quantity: created.quantity, reserved: created.reserved };
}

interface ApplyContext {
  organizationId: string;
  referenceType?: string;
  referenceId?: string;
  reason?: string | null;
}

/**
 * Aplica un movimiento simple (no transfer). Debe correr dentro de una tx
 * controlada por el caller, o se pasa el cliente raíz.
 */
async function applySimple(
  tx: TxClient,
  ctx: ApplyContext,
  type: "in" | "out" | "adjust" | "reserve" | "release",
  productId: string,
  warehouseId: string,
  quantity: number,
) {
  const item = await ensureStockItem(tx, warehouseId, productId);
  const current = Number(item.quantity);
  const reserved = Number(item.reserved);

  let nextQty = current;
  let nextReserved = reserved;

  switch (type) {
    case "in":
      nextQty = current + quantity;
      break;
    case "out": {
      const available = current - reserved;
      if (quantity > available) throw new OutOfStockError(`Stock insuficiente: pedido ${quantity}, disponible ${available}`);
      nextQty = current - quantity;
      break;
    }
    case "adjust":
      nextQty = quantity;
      break;
    case "reserve": {
      const available = current - reserved;
      if (quantity > available) throw new OutOfStockError(`Reserva insuficiente: pedido ${quantity}, disponible ${available}`);
      nextReserved = reserved + quantity;
      break;
    }
    case "release":
      nextReserved = Math.max(0, reserved - quantity);
      break;
  }

  await tx.stockItem.update({
    where: { id: item.id },
    data: { quantity: nextQty, reserved: nextReserved },
  });

  await tx.stockMovement.create({
    data: {
      organizationId: ctx.organizationId,
      type,
      productId,
      warehouseId,
      quantity,
      reason: ctx.reason ?? null,
      referenceType: ctx.referenceType ?? null,
      referenceId: ctx.referenceId ?? null,
    },
  });
}

export async function applyMovement(options: { organizationId: string; data: MovementCreate; referenceType?: string; referenceId?: string }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const ctx: ApplyContext = {
      organizationId: options.organizationId,
      referenceType: options.referenceType,
      referenceId: options.referenceId,
      reason: options.data.reason ?? null,
    };
    const qty = Number(options.data.quantity);

    if (options.data.type === "transfer") {
      // Pre-chequeo de disponibilidad en el depósito origen
      const from = await ensureStockItem(tx, options.data.fromWarehouseId!, options.data.productId);
      const avail = Number(from.quantity) - Number(from.reserved);
      if (qty > avail) throw new OutOfStockError(`Stock insuficiente en origen: pedido ${qty}, disponible ${avail}`);

      await applySimple(tx, { ...ctx, reason: ctx.reason ?? "transfer-out" }, "out", options.data.productId, options.data.fromWarehouseId!, qty);
      await applySimple(tx, { ...ctx, reason: ctx.reason ?? "transfer-in" }, "in", options.data.productId, options.data.toWarehouseId!, qty);

      // Registramos también un movimiento "transfer" con ambos depósitos para historial.
      await tx.stockMovement.create({
        data: {
          organizationId: options.organizationId,
          type: "transfer",
          productId: options.data.productId,
          fromWarehouseId: options.data.fromWarehouseId,
          toWarehouseId: options.data.toWarehouseId,
          quantity: qty,
          reason: ctx.reason ?? null,
          referenceType: ctx.referenceType ?? null,
          referenceId: ctx.referenceId ?? null,
        },
      });
      return;
    }

    await applySimple(tx, ctx, options.data.type, options.data.productId, options.data.warehouseId!, qty);
  });
}

/**
 * Reserva y release programáticos (usados por el módulo orders).
 * Permiten correr dentro de una transacción externa o crear una propia.
 */
export async function reserveStock(tx: TxClient | null, options: { organizationId: string; productId: string; warehouseId: string; quantity: number; referenceType: string; referenceId: string }) {
  const runner = tx ?? getDb();
  const exec = (client: TxClient) =>
    applySimple(client, { organizationId: options.organizationId, referenceType: options.referenceType, referenceId: options.referenceId, reason: "reserve-by-order" }, "reserve", options.productId, options.warehouseId, options.quantity);
  if (tx) return exec(tx);
  return getDb().$transaction((t) => exec(t));
}

export async function releaseStock(tx: TxClient | null, options: { organizationId: string; productId: string; warehouseId: string; quantity: number; referenceType: string; referenceId: string }) {
  const runner = tx ?? getDb();
  const exec = (client: TxClient) =>
    applySimple(client, { organizationId: options.organizationId, referenceType: options.referenceType, referenceId: options.referenceId, reason: "release-by-order" }, "release", options.productId, options.warehouseId, options.quantity);
  if (tx) return exec(tx);
  return getDb().$transaction((t) => exec(t));
}

/**
 * Egreso definitivo al entregar un pedido: libera la reserva y descuenta el stock.
 */
export async function deliverStock(tx: TxClient, options: { organizationId: string; productId: string; warehouseId: string; quantity: number; referenceType: string; referenceId: string }) {
  await applySimple(tx, { organizationId: options.organizationId, referenceType: options.referenceType, referenceId: options.referenceId, reason: "release-on-deliver" }, "release", options.productId, options.warehouseId, options.quantity);
  await applySimple(tx, { organizationId: options.organizationId, referenceType: options.referenceType, referenceId: options.referenceId, reason: "deliver-by-order" }, "out", options.productId, options.warehouseId, options.quantity);
}

/**
 * Helper "lectura": stock disponible en un depósito para un producto.
 */
export async function getAvailable(organizationId: string, productId: string, warehouseId: string): Promise<number> {
  const db = getDb();
  const item = await db.stockItem.findFirst({
    where: { productId, warehouseId, warehouse: { organizationId } },
  });
  if (!item) return 0;
  return Math.max(0, Number(item.quantity) - Number(item.reserved));
}
