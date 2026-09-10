import { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { AFIP_DOC_TYPES, findDocType } from "../afip/catalog.ts";

/**
 * Centro de alertas operativas (computado on-demand, sin tabla propia).
 *
 *  - overdueInvoices: facturas emitidas, impagas y con vencimiento pasado.
 *  - lowStock: items con stock <= punto de reposición (reorderPoint).
 *  - pendingApprovals: órdenes de compra esperando aprobación.
 */

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface OverdueInvoice {
  id: string;
  number: string;
  receiverName: string;
  currency: string;
  total: number;
  pending: number;
  paymentDueDate: string | null;
  daysOverdue: number;
}

export interface LowStockItem {
  productId: string;
  productName: string;
  sku: string | null;
  warehouseName: string;
  quantity: number;
  reorderPoint: number;
}

export interface PendingApproval {
  id: string;
  number: string;
  supplierName: string;
  currency: string;
  total: number;
  issueDate: string;
}

export interface AlertsResult {
  overdueInvoices: OverdueInvoice[];
  lowStock: LowStockItem[];
  pendingApprovals: PendingApproval[];
  counts: { overdueInvoices: number; lowStock: number; pendingApprovals: number; total: number };
}

export async function computeAlerts(organizationId: string): Promise<AlertsResult> {
  const db = getDb();
  const now = new Date();

  const [invoices, stockItems, pendingPos] = await Promise.all([
    db.invoice.findMany({
      where: {
        organizationId,
        status: "issued",
        deletedAt: null,
        paymentDueDate: { lt: now },
      },
      select: {
        id: true, number: true, receiverName: true, currency: true, total: true,
        paymentDueDate: true, docTypeCode: true, allocations: { select: { amount: true } },
      },
      orderBy: { paymentDueDate: "asc" },
    }),
    db.stockItem.findMany({
      where: { reorderPoint: { not: null }, product: { organizationId, deletedAt: null } },
      select: {
        productId: true, quantity: true, reorderPoint: true,
        product: { select: { name: true, sku: true } },
        warehouse: { select: { name: true } },
      },
    }),
    db.purchaseOrder.findMany({
      where: { organizationId, deletedAt: null, approvalStatus: "pending" },
      select: { id: true, number: true, currency: true, total: true, issueDate: true, supplier: { select: { name: true } } },
      orderBy: { issueDate: "asc" },
    }),
  ]);

  const overdueInvoices: OverdueInvoice[] = [];
  for (const inv of invoices) {
    if (findDocType(inv.docTypeCode)?.isCreditNote) continue;
    const paid = inv.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
    const pending = round2(Number(inv.total) - paid);
    if (pending <= 0.005) continue;
    const due = inv.paymentDueDate ? new Date(inv.paymentDueDate) : null;
    const daysOverdue = due ? Math.floor((now.getTime() - due.getTime()) / 86400_000) : 0;
    overdueInvoices.push({
      id: inv.id,
      number: inv.number,
      receiverName: inv.receiverName,
      currency: inv.currency,
      total: round2(Number(inv.total)),
      pending,
      paymentDueDate: due ? due.toISOString() : null,
      daysOverdue,
    });
  }

  const lowStock: LowStockItem[] = stockItems
    .filter((item) => item.reorderPoint != null && Number(item.quantity) <= Number(item.reorderPoint))
    .map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      warehouseName: item.warehouse.name,
      quantity: Number(item.quantity),
      reorderPoint: Number(item.reorderPoint),
    }));

  const pendingApprovals: PendingApproval[] = pendingPos.map((po) => ({
    id: po.id,
    number: po.number,
    supplierName: po.supplier.name,
    currency: po.currency,
    total: round2(Number(po.total)),
    issueDate: new Date(po.issueDate).toISOString(),
  }));

  return {
    overdueInvoices,
    lowStock,
    pendingApprovals,
    counts: {
      overdueInvoices: overdueInvoices.length,
      lowStock: lowStock.length,
      pendingApprovals: pendingApprovals.length,
      total: overdueInvoices.length + lowStock.length + pendingApprovals.length,
    },
  };
}

export type AlertCounts = AlertsResult["counts"];

/**
 * Variante liviana de {@link computeAlerts}: devuelve solo los contadores,
 * agregando en SQL en vez de traer las filas y contarlas en memoria.
 *
 * La usa el badge de alertas del shell, que hace polling y solo necesita
 * `total`. Traer los tres listados completos cada pocos minutos era el
 * principal consumo de transferencia de datos del panel.
 */
export async function computeAlertCounts(organizationId: string): Promise<AlertCounts> {
  const db = getDb();
  const now = new Date();
  const creditNoteCodes = AFIP_DOC_TYPES.filter((t) => t.isCreditNote).map((t) => t.code);

  const [overdueRows, lowStockRows, pendingApprovals] = await Promise.all([
    db.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM (
        SELECT i.id
        FROM "Invoice" i
        LEFT JOIN "ReceiptAllocation" ra ON ra."invoiceId" = i.id
        WHERE i."organizationId" = ${organizationId}
          AND i.status = 'issued'
          AND i."deletedAt" IS NULL
          AND i."paymentDueDate" < ${now}
          AND i."docTypeCode" NOT IN (${Prisma.join(creditNoteCodes)})
        GROUP BY i.id, i.total
        HAVING i.total - COALESCE(SUM(ra.amount), 0) > 0.005
      ) t
    `,
    db.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM "StockItem" si
      JOIN "Product" p ON p.id = si."productId"
      WHERE si."reorderPoint" IS NOT NULL
        AND si.quantity <= si."reorderPoint"
        AND p."organizationId" = ${organizationId}
        AND p."deletedAt" IS NULL
    `,
    db.purchaseOrder.count({
      where: { organizationId, deletedAt: null, approvalStatus: "pending" },
    }),
  ]);

  const overdueInvoices = overdueRows[0]?.count ?? 0;
  const lowStock = lowStockRows[0]?.count ?? 0;

  return {
    overdueInvoices,
    lowStock,
    pendingApprovals,
    total: overdueInvoices + lowStock + pendingApprovals,
  };
}
