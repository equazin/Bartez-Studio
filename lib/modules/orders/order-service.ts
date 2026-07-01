import type { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { calcQuote } from "../sales/calc.ts";
import { nextNumber } from "../sales/numbering.ts";
import { OutOfStockError, deliverStock, releaseStock, reserveStock } from "../inventory/stock-service.ts";
import type { Currency } from "../catalog/schema.ts";
import { CURRENCIES } from "../catalog/schema.ts";
import type { OrderCreate, OrderStatus } from "./schema.ts";
import { createAirPreorderTx } from "../../integrations/air/preorder.ts";

function asCurrency(value: string | null | undefined): Currency {
  return (CURRENCIES as readonly string[]).includes(value ?? "") ? (value as Currency) : "USD";
}

/**
 * Service del módulo Orders — Pedidos de Venta.
 *
 * Reglas de transición:
 *  - draft → confirmed:    reserva stock de líneas con producto stockTracked
 *                          y warehouseId asignado. Si no hay stock, falla.
 *                          Líneas sin stockTracked se marcan backorder=true.
 *  - confirmed → in_preparation: sin efecto en stock (sigue reservado).
 *  - confirmed/in_preparation → delivered: descuenta stock reservado.
 *  - confirmed/in_preparation → cancelled: libera la reserva.
 */

function linesToDrafts(lines: OrderCreate["lines"]) {
  return lines.map((l) => ({
    quantity: Number(l.quantity),
    unitPrice: Number(l.unitPrice),
    discountPct: Number(l.discountPct ?? 0),
    taxRate: Number(l.taxRate ?? 0),
  }));
}

export async function createOrder(options: { organizationId: string; data: OrderCreate; fromQuote?: { id: string } }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "pedido" });
    const drafts = linesToDrafts(options.data.lines);
    const { totals, lines } = calcQuote(drafts);

    // Marcar backorder si el producto no es stockTracked
    const productIds = options.data.lines.map((l) => l.productId).filter((x): x is string => Boolean(x));
    const products = productIds.length > 0
      ? await tx.product.findMany({ where: { id: { in: productIds }, organizationId: options.organizationId } })
      : [];
    const isTracked = new Map(products.map((p) => [p.id, p.stockTracked] as const));

    const order = await tx.salesOrder.create({
      data: {
        organizationId: options.organizationId,
        number,
        accountId: options.data.accountId,
        quoteId: options.fromQuote?.id ?? options.data.quoteId,
        ownerId: options.data.ownerId,
        warehouseId: options.data.warehouseId,
        currency: options.data.currency ?? "USD",
        orderDate: options.data.orderDate ?? new Date(),
        expectedDate: options.data.expectedDate ?? null,
        notes: options.data.notes,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        lines: {
          create: options.data.lines.map((l, idx) => ({
            position: idx,
            productId: l.productId,
            sourceSystem: l.sourceSystem,
            sourceCode: l.sourceCode,
            description: l.description,
            quantity: l.quantity,
            unitCost: l.unitCost ?? null,
            markupPct: l.markupPct ?? null,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct ?? 0,
            taxRate: l.taxRate ?? 0,
            lineSubtotal: lines[idx].lineSubtotal,
            lineTax: lines[idx].lineTax,
            lineTotal: lines[idx].lineTotal,
            backorder: l.productId ? !isTracked.get(l.productId) : true,
          })),
        },
      },
      include: { lines: { orderBy: { position: "asc" } } },
    });

    return order;
  });
}

export async function updateOrder(options: { organizationId: string; id: string; data: Partial<OrderCreate> }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.salesOrder.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
      include: { lines: true },
    });
    if (!existing) return null;
    if (existing.status !== "draft") {
      throw new Error(`No se puede editar un pedido en estado "${existing.status}"`);
    }

    const update: Prisma.SalesOrderUncheckedUpdateInput = {
      accountId: options.data.accountId ?? existing.accountId,
      quoteId: options.data.quoteId ?? existing.quoteId,
      ownerId: options.data.ownerId ?? existing.ownerId,
      warehouseId: options.data.warehouseId ?? existing.warehouseId,
      currency: options.data.currency ?? existing.currency,
      orderDate: options.data.orderDate ?? existing.orderDate,
      expectedDate: options.data.expectedDate ?? existing.expectedDate,
      notes: options.data.notes ?? existing.notes,
    };

    if (options.data.lines && options.data.lines.length > 0) {
      const drafts = linesToDrafts(options.data.lines);
      const { totals, lines } = calcQuote(drafts);

      const productIds = options.data.lines.map((l) => l.productId).filter((x): x is string => Boolean(x));
      const products = productIds.length > 0
        ? await tx.product.findMany({ where: { id: { in: productIds }, organizationId: options.organizationId } })
        : [];
      const isTracked = new Map(products.map((p) => [p.id, p.stockTracked] as const));

      await tx.salesOrderLine.deleteMany({ where: { orderId: existing.id } });
      Object.assign(update, {
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        lines: {
          create: options.data.lines.map((l, idx) => ({
            position: idx,
            productId: l.productId,
            sourceSystem: l.sourceSystem,
            sourceCode: l.sourceCode,
            description: l.description,
            quantity: l.quantity,
            unitCost: l.unitCost ?? null,
            markupPct: l.markupPct ?? null,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct ?? 0,
            taxRate: l.taxRate ?? 0,
            lineSubtotal: lines[idx].lineSubtotal,
            lineTax: lines[idx].lineTax,
            lineTotal: lines[idx].lineTotal,
            backorder: l.productId ? !isTracked.get(l.productId) : true,
          })),
        },
      });
    }

    return tx.salesOrder.update({
      where: { id: existing.id },
      data: update,
      include: { lines: { orderBy: { position: "asc" } } },
    });
  });
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ["confirmed", "cancelled"],
  confirmed: ["in_preparation", "delivered", "cancelled"],
  in_preparation: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export async function transitionOrderStatus(options: { organizationId: string; id: string; target: OrderStatus }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.salesOrder.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
      include: { lines: { include: { product: { select: { id: true, stockTracked: true } } } } },
    });
    if (!existing) return null;

    const allowed = VALID_TRANSITIONS[existing.status as OrderStatus];
    if (!allowed.includes(options.target)) {
      throw new Error(`Transición no permitida: ${existing.status} → ${options.target}`);
    }

    const now = new Date();
    const data: Prisma.SalesOrderUpdateInput = { status: options.target };

    // Efectos en stock
    if (existing.status === "draft" && options.target === "confirmed") {
      if (!existing.warehouseId) {
        // si no hay depósito, todos los items quedan backorder por defecto (no se reserva)
      } else {
        for (const line of existing.lines) {
          if (!line.productId || !line.product?.stockTracked || line.backorder) continue;
          try {
            await reserveStock(tx, {
              organizationId: options.organizationId,
              productId: line.productId,
              warehouseId: existing.warehouseId,
              quantity: Number(line.quantity),
              referenceType: "sales_order",
              referenceId: existing.id,
            });
          } catch (e) {
            if (e instanceof OutOfStockError) {
              // si falta stock, marcamos backorder en lugar de fallar todo
              await tx.salesOrderLine.update({ where: { id: line.id }, data: { backorder: true } });
            } else {
              throw e;
            }
          }
        }
      }
      data.confirmedAt = now;

      // Derivación venta → compra: si el pedido tiene líneas de catálogo AIR,
      // se crea (idempotente) la pre-orden de compra interna al proveedor AIR.
      await createAirPreorderTx(tx, {
        organizationId: options.organizationId,
        saleOrderId: existing.id,
        saleOrderNumber: existing.number,
        lines: existing.lines,
      });
    }

    if (options.target === "in_preparation") {
      data.preparedAt = now;
    }

    if (options.target === "delivered") {
      if (existing.warehouseId) {
        for (const line of existing.lines) {
          if (!line.productId || !line.product?.stockTracked || line.backorder) continue;
          await deliverStock(tx, {
            organizationId: options.organizationId,
            productId: line.productId,
            warehouseId: existing.warehouseId,
            quantity: Number(line.quantity),
            referenceType: "sales_order",
            referenceId: existing.id,
          });
        }
        // marcar líneas como totalmente entregadas
        await tx.salesOrderLine.updateMany({
          where: { orderId: existing.id },
          data: {}, // delivered se actualiza por línea abajo
        });
        for (const line of existing.lines) {
          await tx.salesOrderLine.update({ where: { id: line.id }, data: { delivered: line.quantity } });
        }
      }
      data.deliveredAt = now;
    }

    if (options.target === "cancelled") {
      const wasReserved = existing.status === "confirmed" || existing.status === "in_preparation";
      if (wasReserved && existing.warehouseId) {
        for (const line of existing.lines) {
          if (!line.productId || !line.product?.stockTracked || line.backorder) continue;
          await releaseStock(tx, {
            organizationId: options.organizationId,
            productId: line.productId,
            warehouseId: existing.warehouseId,
            quantity: Number(line.quantity),
            referenceType: "sales_order",
            referenceId: existing.id,
          });
        }
      }
      data.cancelledAt = now;
    }

    return tx.salesOrder.update({
      where: { id: existing.id },
      data,
      include: { lines: { orderBy: { position: "asc" } } },
    });
  });
}

export async function createOrderFromQuote(options: { organizationId: string; quoteId: string; warehouseId: string | null }) {
  const db = getDb();
  const quote = await db.quote.findFirst({
    where: { id: options.quoteId, organizationId: options.organizationId, deletedAt: null },
    include: { lines: { orderBy: { position: "asc" } } },
  });
  if (!quote) return null;

  return createOrder({
    organizationId: options.organizationId,
    fromQuote: { id: quote.id },
    data: {
      accountId: quote.accountId,
      quoteId: quote.id,
      ownerId: quote.ownerId,
      warehouseId: options.warehouseId,
      currency: asCurrency(quote.currency),
      orderDate: new Date(),
      expectedDate: null,
      notes: quote.notes,
      lines: quote.lines.map((l) => ({
        productId: l.productId,
        sourceSystem: null,
        sourceCode: null,
        description: l.description,
        quantity: Number(l.quantity),
        unitCost: null,
        markupPct: null,
        unitPrice: Number(l.unitPrice),
        discountPct: Number(l.discountPct),
        taxRate: Number(l.taxRate),
      })),
    },
  });
}
