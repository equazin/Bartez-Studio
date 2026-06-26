import { getDb } from "../../db.ts";
import { findDocType } from "../afip/catalog.ts";

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
