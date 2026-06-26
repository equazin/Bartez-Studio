import { getDb } from "../../db.ts";
import type { ReportGrouping } from "./schema.ts";

/**
 * Motor de reportes BI: agregados financieros y operativos.
 *
 * Reportes implementados:
 *  - financialOverview: KPIs de ventas, cobranzas, compras y tesorería.
 *  - salesByPeriod: ventas agregadas por día/semana/mes (sum total).
 *  - topProducts: productos más vendidos por unidades y por importe.
 *  - topAccounts: cuentas con mayor facturación.
 *  - ar/ap aging: saldos por antigüedad (0-30, 31-60, 61-90, 90+).
 *  - ticketSummary: tickets por estado y prioridad + SLA.
 *  - dso: days sales outstanding.
 */

function periodTrunc(date: Date, grouping: ReportGrouping): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  if (grouping === "day") return `${y}-${m}-${d}`;
  if (grouping === "month") return `${y}-${m}`;
  // semana ISO simple
  const onejan = new Date(Date.UTC(y, 0, 1));
  const days = Math.floor((date.getTime() - onejan.getTime()) / 86400_000);
  const week = Math.ceil((days + onejan.getUTCDay() + 1) / 7);
  return `${y}-W${String(week).padStart(2, "0")}`;
}

export async function financialOverview(options: { organizationId: string; from?: Date; to?: Date }) {
  const db = getDb();
  const where = {
    organizationId: options.organizationId,
    ...(options.from || options.to ? { issueDate: { gte: options.from, lte: options.to } } : {}),
  };

  const [salesAgg, receiptsAgg, purchasesAgg, paymentsAgg, openInvoices, openSupplierAccounts, cashAccounts] = await Promise.all([
    db.invoice.aggregate({
      _sum: { total: true, taxTotal: true },
      _count: { _all: true },
      where: { ...where, status: "issued" },
    }),
    db.receipt.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { organizationId: options.organizationId, ...(options.from || options.to ? { receivedAt: { gte: options.from, lte: options.to } } : {}) },
    }),
    db.purchaseOrder.aggregate({
      _sum: { total: true },
      _count: { _all: true },
      where: { organizationId: options.organizationId, ...(options.from || options.to ? { issueDate: { gte: options.from, lte: options.to } } : {}), status: { in: ["partially_received", "received"] } },
    }),
    db.supplierPayment.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { organizationId: options.organizationId, ...(options.from || options.to ? { paymentDate: { gte: options.from, lte: options.to } } : {}) },
    }),
    db.invoice.findMany({
      where: { organizationId: options.organizationId, status: "issued", deletedAt: null },
      select: { id: true, total: true, issueDate: true, currency: true, allocations: { select: { amount: true } } },
    }),
    db.supplierAccountEntry.groupBy({
      by: ["supplierId", "currency"],
      where: { organizationId: options.organizationId },
      _sum: { debit: true, credit: true },
    }),
    db.cashAccount.findMany({
      where: { organizationId: options.organizationId, active: true },
      select: { id: true, name: true, currency: true, movements: { select: { type: true, amount: true } } },
    }),
  ]);

  // AR aging
  const aging = { d0_30: 0, d31_60: 0, d61_90: 0, d90_plus: 0 };
  let totalReceivables = 0;
  for (const inv of openInvoices) {
    const paid = inv.allocations.reduce((s, a) => s + Number(a.amount), 0);
    const pending = Number(inv.total) - paid;
    if (pending <= 0.005) continue;
    totalReceivables += pending;
    const ageDays = Math.floor((Date.now() - inv.issueDate.getTime()) / 86400_000);
    if (ageDays <= 30) aging.d0_30 += pending;
    else if (ageDays <= 60) aging.d31_60 += pending;
    else if (ageDays <= 90) aging.d61_90 += pending;
    else aging.d90_plus += pending;
  }

  // AP por proveedor
  let totalPayables = 0;
  for (const row of openSupplierAccounts) {
    const balance = Number(row._sum.credit ?? 0) - Number(row._sum.debit ?? 0);
    if (balance > 0.005) totalPayables += balance;
  }

  // Tesorería: balance por cuenta
  const cashBalances = cashAccounts.map((acc) => {
    const net = acc.movements.reduce((s, m) => {
      if (m.type === "income") return s + Number(m.amount);
      if (m.type === "expense") return s - Number(m.amount);
      return s + Number(m.amount); // adjust toma signo del importe
    }, 0);
    return { id: acc.id, name: acc.name, currency: acc.currency, balance: Math.round(net * 100) / 100 };
  });

  return {
    sales: {
      total: Number(salesAgg._sum.total ?? 0),
      taxTotal: Number(salesAgg._sum.taxTotal ?? 0),
      count: salesAgg._count._all,
    },
    receipts: { total: Number(receiptsAgg._sum.amount ?? 0), count: receiptsAgg._count._all },
    purchases: { total: Number(purchasesAgg._sum.total ?? 0), count: purchasesAgg._count._all },
    supplierPayments: { total: Number(paymentsAgg._sum.amount ?? 0), count: paymentsAgg._count._all },
    accountsReceivable: {
      total: Math.round(totalReceivables * 100) / 100,
      aging: {
        d0_30: Math.round(aging.d0_30 * 100) / 100,
        d31_60: Math.round(aging.d31_60 * 100) / 100,
        d61_90: Math.round(aging.d61_90 * 100) / 100,
        d90_plus: Math.round(aging.d90_plus * 100) / 100,
      },
    },
    accountsPayable: { total: Math.round(totalPayables * 100) / 100 },
    cashBalances,
  };
}

export async function salesByPeriod(options: { organizationId: string; from?: Date; to?: Date; groupBy: ReportGrouping }) {
  const db = getDb();
  const invoices = await db.invoice.findMany({
    where: {
      organizationId: options.organizationId,
      status: "issued",
      ...(options.from || options.to ? { issueDate: { gte: options.from, lte: options.to } } : {}),
    },
    select: { issueDate: true, total: true, currency: true },
    orderBy: { issueDate: "asc" },
  });

  const buckets = new Map<string, Map<string, number>>();
  for (const inv of invoices) {
    const key = periodTrunc(inv.issueDate, options.groupBy);
    const byCurrency = buckets.get(key) ?? new Map<string, number>();
    byCurrency.set(inv.currency, (byCurrency.get(inv.currency) ?? 0) + Number(inv.total));
    buckets.set(key, byCurrency);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, byCurrency]) => ({
      period,
      totals: Array.from(byCurrency.entries()).map(([currency, total]) => ({
        currency,
        total: Math.round(total * 100) / 100,
      })),
    }));
}

export async function topProducts(options: { organizationId: string; from?: Date; to?: Date; limit?: number }) {
  const db = getDb();
  const limit = options.limit ?? 10;
  const lines = await db.invoiceLine.findMany({
    where: {
      invoice: {
        organizationId: options.organizationId,
        status: "issued",
        deletedAt: null,
        ...(options.from || options.to ? { issueDate: { gte: options.from, lte: options.to } } : {}),
      },
      productId: { not: null },
    },
    select: { productId: true, quantity: true, lineTotal: true, description: true, invoice: { select: { currency: true } } },
  });

  const byProduct = new Map<string, { name: string; quantity: number; total: number }>();
  for (const l of lines) {
    if (!l.productId) continue;
    const acc = byProduct.get(l.productId) ?? { name: l.description, quantity: 0, total: 0 };
    acc.quantity += Number(l.quantity);
    acc.total += Number(l.lineTotal);
    byProduct.set(l.productId, acc);
  }

  return Array.from(byProduct.entries())
    .map(([productId, agg]) => ({ productId, name: agg.name, quantity: agg.quantity, total: Math.round(agg.total * 100) / 100 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export async function topAccounts(options: { organizationId: string; from?: Date; to?: Date; limit?: number }) {
  const db = getDb();
  const limit = options.limit ?? 10;
  const grouped = await db.invoice.groupBy({
    by: ["accountId"],
    where: {
      organizationId: options.organizationId,
      status: "issued",
      deletedAt: null,
      accountId: { not: null },
      ...(options.from || options.to ? { issueDate: { gte: options.from, lte: options.to } } : {}),
    },
    _sum: { total: true },
    _count: { _all: true },
  });

  const accountIds = grouped.map((g) => g.accountId).filter((id): id is string => Boolean(id));
  const accounts = accountIds.length > 0
    ? await db.account.findMany({ where: { id: { in: accountIds } }, select: { id: true, name: true } })
    : [];
  const nameById = new Map(accounts.map((a) => [a.id, a.name]));

  return grouped
    .map((g) => ({
      accountId: g.accountId,
      name: g.accountId ? nameById.get(g.accountId) ?? "—" : "—",
      total: Math.round(Number(g._sum.total ?? 0) * 100) / 100,
      invoiceCount: g._count._all,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export async function ticketSummary(options: { organizationId: string; from?: Date; to?: Date }) {
  const db = getDb();
  const where = {
    organizationId: options.organizationId,
    deletedAt: null,
    ...(options.from || options.to ? { createdAt: { gte: options.from, lte: options.to } } : {}),
  };

  const [byStatus, byPriority, total, overdue] = await Promise.all([
    db.ticket.groupBy({ by: ["status"], where, _count: { _all: true } }),
    db.ticket.groupBy({ by: ["priority"], where, _count: { _all: true } }),
    db.ticket.count({ where }),
    db.ticket.count({ where: { ...where, status: { notIn: ["solved", "closed"] }, dueAt: { lt: new Date() } } }),
  ]);

  return {
    total,
    overdue,
    byStatus: byStatus.map((r) => ({ status: r.status, count: r._count._all })),
    byPriority: byPriority.map((r) => ({ priority: r.priority, count: r._count._all })),
  };
}

export async function daysSalesOutstanding(options: { organizationId: string }) {
  const db = getDb();
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400_000);
  const [salesAgg, openInvoices] = await Promise.all([
    db.invoice.aggregate({
      _sum: { total: true },
      where: { organizationId: options.organizationId, status: "issued", deletedAt: null, issueDate: { gte: ninetyDaysAgo } },
    }),
    db.invoice.findMany({
      where: { organizationId: options.organizationId, status: "issued", deletedAt: null },
      select: { total: true, allocations: { select: { amount: true } } },
    }),
  ]);

  const totalSales = Number(salesAgg._sum.total ?? 0);
  if (totalSales <= 0) return { dso: 0, totalReceivables: 0, totalSales: 0 };
  const receivables = openInvoices.reduce((s, inv) => {
    const paid = inv.allocations.reduce((sa, a) => sa + Number(a.amount), 0);
    return s + Math.max(0, Number(inv.total) - paid);
  }, 0);
  const dso = Math.round((receivables / totalSales) * 90);
  return { dso, totalReceivables: Math.round(receivables * 100) / 100, totalSales: Math.round(totalSales * 100) / 100 };
}

/**
 * Rentabilidad por producto.
 *
 * Ingreso = lineSubtotal (neto, post-descuento, sin IVA) de facturas emitidas.
 * Costo   = costo promedio ponderado de compras (GoodsReceiptLine.unitCost) por
 *           las unidades vendidas. Si un producto no tiene recepciones, su costo
 *           queda como desconocido (hasCost: false) y no suma al margen total.
 */
export async function productProfitability(options: { organizationId: string; from?: Date; to?: Date; limit?: number }) {
  const db = getDb();
  const limit = options.limit ?? 50;

  const [saleLines, costLines] = await Promise.all([
    db.invoiceLine.findMany({
      where: {
        invoice: {
          organizationId: options.organizationId,
          status: "issued",
          deletedAt: null,
          ...(options.from || options.to ? { issueDate: { gte: options.from, lte: options.to } } : {}),
        },
        productId: { not: null },
      },
      select: { productId: true, quantity: true, lineSubtotal: true, description: true },
    }),
    db.goodsReceiptLine.findMany({
      where: { goodsReceipt: { organizationId: options.organizationId }, productId: { not: null } },
      select: { productId: true, quantity: true, unitCost: true },
    }),
  ]);

  // Costo promedio ponderado por producto (todas las recepciones históricas).
  const costAgg = new Map<string, { qty: number; cost: number }>();
  for (const line of costLines) {
    if (!line.productId) continue;
    const acc = costAgg.get(line.productId) ?? { qty: 0, cost: 0 };
    acc.qty += Number(line.quantity);
    acc.cost += Number(line.quantity) * Number(line.unitCost);
    costAgg.set(line.productId, acc);
  }
  const avgCostByProduct = new Map<string, number>();
  for (const [productId, agg] of costAgg) {
    if (agg.qty > 0) avgCostByProduct.set(productId, agg.cost / agg.qty);
  }

  // Ingreso y unidades por producto.
  const revenueAgg = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const line of saleLines) {
    if (!line.productId) continue;
    const acc = revenueAgg.get(line.productId) ?? { name: line.description, qty: 0, revenue: 0 };
    acc.qty += Number(line.quantity);
    acc.revenue += Number(line.lineSubtotal);
    revenueAgg.set(line.productId, acc);
  }

  const productIds = Array.from(revenueAgg.keys());
  const products = productIds.length > 0
    ? await db.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, sku: true } })
    : [];
  const productById = new Map(products.map((p) => [p.id, p]));

  const rows = productIds.map((productId) => {
    const agg = revenueAgg.get(productId)!;
    const product = productById.get(productId);
    const avgCost = avgCostByProduct.get(productId);
    const hasCost = avgCost != null;
    const cost = hasCost ? round2(avgCost * agg.qty) : 0;
    const revenue = round2(agg.revenue);
    const margin = hasCost ? round2(revenue - cost) : 0;
    const marginPct = hasCost && revenue > 0 ? Math.round((margin / revenue) * 1000) / 10 : null;
    return {
      productId,
      name: product?.name ?? agg.name,
      sku: product?.sku ?? null,
      quantity: agg.qty,
      revenue,
      avgCost: hasCost ? round2(avgCost) : null,
      cost,
      margin,
      marginPct,
      hasCost,
    };
  }).sort((a, b) => b.margin - a.margin).slice(0, limit);

  const totalRevenue = round2(rows.reduce((s, r) => s + r.revenue, 0));
  const totalCost = round2(rows.reduce((s, r) => s + r.cost, 0));
  const withCostRevenue = round2(rows.filter((r) => r.hasCost).reduce((s, r) => s + r.revenue, 0));
  const totalMargin = round2(withCostRevenue - totalCost);
  const marginPct = withCostRevenue > 0 ? Math.round((totalMargin / withCostRevenue) * 1000) / 10 : null;

  return { rows, totalRevenue, totalCost, totalMargin, marginPct };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
