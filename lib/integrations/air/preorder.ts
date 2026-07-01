/**
 * Pre-órdenes de compra a AIR generadas automáticamente desde ventas.
 *
 * Al confirmar un pedido de venta con líneas de origen AIR (sourceSystem="air"),
 * se crea una PurchaseOrder interna en estado "preorden" al proveedor AIR S.R.L.
 * Es un documento de planificación: NO asienta en la cuenta corriente del
 * proveedor ni viaja a AIR. Recién al emitirla (issueAirPreorder) pasa a
 * "issued", se asienta el crédito en cta. cte. y aplica el umbral de aprobación.
 *
 * El vínculo con el ERP base es mínimo: una llamada desde transitionOrderStatus
 * que no hace nada si el pedido no tiene líneas AIR.
 */
import type { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { calcQuote } from "../../modules/sales/calc.ts";
import { nextNumber } from "../../modules/sales/numbering.ts";
import { getOrgSettings } from "../../modules/settings/settings-service.ts";
import { PurchaseValidationError } from "../../modules/purchases/purchase-service.ts";

export const AIR_SUPPLIER_TAX_ID = "30-57013558-5";

/** Subconjunto de SalesOrderLine que necesita la pre-orden (acepta Decimal o number). */
export interface SaleLineForPreorder {
  sourceSystem: string | null;
  sourceCode: string | null;
  description: string;
  quantity: number | { toString(): string };
  unitCost: number | { toString(): string } | null;
  taxRate: number | { toString(): string };
}

export interface PreorderLineDraft {
  sourceCode: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

function toNum(v: number | { toString(): string } | null | undefined): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number.parseFloat(v.toString());
  return Number.isFinite(n) ? n : 0;
}

/**
 * Filtra las líneas AIR de una venta y las convierte en borradores de línea de
 * compra. El precio de compra es el costo AIR (unitCost); si falta queda en 0
 * para completar a mano en la pre-orden.
 */
export function buildPreorderLines(lines: readonly SaleLineForPreorder[]): PreorderLineDraft[] {
  return lines
    .filter((l) => l.sourceSystem === "air")
    .map((l) => ({
      sourceCode: l.sourceCode,
      description: l.description,
      quantity: toNum(l.quantity),
      unitPrice: toNum(l.unitCost),
      taxRate: toNum(l.taxRate) || 21,
    }))
    .filter((l) => l.quantity > 0);
}

export interface CreateAirPreorderInput {
  organizationId: string;
  saleOrderId: string;
  saleOrderNumber: string;
  lines: readonly SaleLineForPreorder[];
}

/**
 * Crea la pre-orden dentro de la transacción del confirm de la venta.
 * Devuelve null si el pedido no tiene líneas AIR. Idempotente: si ya existe
 * una pre-orden/OC no cancelada para esa venta, la devuelve sin duplicar.
 */
export async function createAirPreorderTx(
  tx: Prisma.TransactionClient,
  input: CreateAirPreorderInput,
) {
  const drafts = buildPreorderLines(input.lines);
  if (drafts.length === 0) return null;

  const existing = await tx.purchaseOrder.findFirst({
    where: {
      organizationId: input.organizationId,
      originSaleOrderId: input.saleOrderId,
      supplierSource: "air",
      deletedAt: null,
      status: { not: "cancelled" },
    },
  });
  if (existing) return existing;

  const supplier = await tx.supplier.findFirst({
    where: {
      organizationId: input.organizationId,
      taxId: AIR_SUPPLIER_TAX_ID,
      active: true,
      deletedAt: null,
    },
    select: { id: true },
  });
  if (!supplier) {
    throw new Error(
      "No existe el proveedor AIR S.R.L. (CUIT 30-57013558-5). Corré scripts/seed-air-supplier.ts antes de confirmar ventas con productos AIR.",
    );
  }

  const { totals, lines } = calcQuote(
    drafts.map((d) => ({ quantity: d.quantity, unitPrice: d.unitPrice, discountPct: 0, taxRate: d.taxRate })),
  );
  const { number } = await nextNumber(tx, { organizationId: input.organizationId, docType: "orden_compra" });

  return tx.purchaseOrder.create({
    data: {
      organizationId: input.organizationId,
      number,
      supplierId: supplier.id,
      status: "preorden",
      approvalStatus: "not_required",
      originSaleOrderId: input.saleOrderId,
      supplierSource: "air",
      currency: "ARS", // AIR factura en pesos; el costo unitCost viene de su lista
      issueDate: new Date(),
      notes: `Pre-orden generada automáticamente desde el pedido de venta ${input.saleOrderNumber}.`,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxTotal: totals.taxTotal,
      total: totals.total,
      lines: {
        create: drafts.map((d, idx) => ({
          position: idx,
          description: d.sourceCode ? `[AIR ${d.sourceCode}] ${d.description}` : d.description,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
          discountPct: 0,
          taxRate: d.taxRate,
          lineSubtotal: lines[idx].lineSubtotal,
          lineTax: lines[idx].lineTax,
          lineTotal: lines[idx].lineTotal,
        })),
      },
    },
    include: { lines: { orderBy: { position: "asc" } } },
  });
}

/**
 * Emite una pre-orden: preorden → issued. Recién acá se asienta el crédito en
 * la cuenta corriente del proveedor y aplica el umbral de aprobación de compras.
 */
export async function issueAirPreorder(options: { organizationId: string; id: string }) {
  const db = getDb();
  const settings = await getOrgSettings(options.organizationId);

  return db.$transaction(async (tx) => {
    const order = await tx.purchaseOrder.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
    });
    if (!order) return null;
    if (order.status !== "preorden") {
      throw new PurchaseValidationError(`Sólo se puede emitir una pre-orden (estado actual: "${order.status}")`);
    }

    const threshold = settings.purchaseApprovalThreshold;
    const approvalStatus = threshold > 0 && Number(order.total) >= threshold ? "pending" : "not_required";
    const issuedAt = new Date();

    await tx.supplierAccountEntry.create({
      data: {
        organizationId: options.organizationId,
        supplierId: order.supplierId,
        purchaseOrderId: order.id,
        date: issuedAt,
        type: "purchase_order",
        referenceType: "purchase_order",
        referenceId: order.id,
        description: `OC ${order.number}`,
        debit: 0,
        credit: order.total,
        currency: order.currency,
      },
    });

    return tx.purchaseOrder.update({
      where: { id: order.id },
      data: { status: "issued", approvalStatus, issuedAt, issueDate: issuedAt },
      include: { lines: { orderBy: { position: "asc" } }, supplier: true },
    });
  });
}
