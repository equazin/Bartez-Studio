import { getDb } from "../../db.ts";

/**
 * Series diarias de los últimos N días para los KPIs del dashboard.
 *
 * En lugar de N queries pesados, traemos los registros del rango (campos
 * mínimos) y agregamos por día en memoria. Para 30-60 días es liviano y
 * permite calcular en paralelo todas las métricas.
 */

export interface DailySeries {
  series: number[]; // longitud = days, ordenada cronológicamente
  current: number; // suma/cuenta del período actual
  previous: number; // suma/cuenta del período inmediatamente anterior
  deltaPct: number | null; // % de cambio vs período anterior
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildBuckets(days: number, from: Date): Date[] {
  const out: Date[] = [];
  const base = startOfDay(from);
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
}

function bucketIndex(date: Date, from: Date, days: number): number {
  const idx = Math.floor((date.getTime() - startOfDay(from).getTime()) / 86400_000);
  return idx >= 0 && idx < days ? idx : -1;
}

function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function salesDailySeries(organizationId: string, days = 30): Promise<DailySeries> {
  const db = getDb();
  const today = new Date();
  const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400_000));
  const prevFrom = new Date(from.getTime() - days * 86400_000);

  const invoices = await db.invoice.findMany({
    where: { organizationId, status: "issued", deletedAt: null, issueDate: { gte: prevFrom } },
    select: { issueDate: true, total: true },
  });

  const buckets = buildBuckets(days, from);
  const series = buckets.map(() => 0);
  let previous = 0;
  for (const inv of invoices) {
    const i = bucketIndex(inv.issueDate, from, days);
    if (i >= 0) series[i] += Number(inv.total);
    else previous += Number(inv.total);
  }
  const current = series.reduce((s, v) => s + v, 0);
  return { series, current, previous, deltaPct: deltaPct(current, previous) };
}

export async function receiptsDailySeries(organizationId: string, days = 30): Promise<DailySeries> {
  const db = getDb();
  const today = new Date();
  const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400_000));
  const prevFrom = new Date(from.getTime() - days * 86400_000);

  const receipts = await db.receipt.findMany({
    where: { organizationId, deletedAt: null, receivedAt: { gte: prevFrom } },
    select: { receivedAt: true, amount: true },
  });

  const buckets = buildBuckets(days, from);
  const series = buckets.map(() => 0);
  let previous = 0;
  for (const r of receipts) {
    const i = bucketIndex(r.receivedAt, from, days);
    if (i >= 0) series[i] += Number(r.amount);
    else previous += Number(r.amount);
  }
  const current = series.reduce((s, v) => s + v, 0);
  return { series, current, previous, deltaPct: deltaPct(current, previous) };
}

export async function leadsDailySeries(organizationId: string, days = 30): Promise<DailySeries> {
  const db = getDb();
  const today = new Date();
  const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400_000));
  const prevFrom = new Date(from.getTime() - days * 86400_000);

  const leads = await db.lead.findMany({
    where: { organizationId, createdAt: { gte: prevFrom } },
    select: { createdAt: true },
  });

  const buckets = buildBuckets(days, from);
  const series = buckets.map(() => 0);
  let previous = 0;
  for (const l of leads) {
    const i = bucketIndex(l.createdAt, from, days);
    if (i >= 0) series[i] += 1;
    else previous += 1;
  }
  const current = series.reduce((s, v) => s + v, 0);
  return { series, current, previous, deltaPct: deltaPct(current, previous) };
}

export async function conversationsDailySeries(organizationId: string, days = 30): Promise<DailySeries> {
  const db = getDb();
  const today = new Date();
  const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400_000));
  const prevFrom = new Date(from.getTime() - days * 86400_000);

  const convs = await db.waConversation.findMany({
    where: { organizationId, createdAt: { gte: prevFrom } },
    select: { createdAt: true },
  });

  const buckets = buildBuckets(days, from);
  const series = buckets.map(() => 0);
  let previous = 0;
  for (const c of convs) {
    const i = bucketIndex(c.createdAt, from, days);
    if (i >= 0) series[i] += 1;
    else previous += 1;
  }
  const current = series.reduce((s, v) => s + v, 0);
  return { series, current, previous, deltaPct: deltaPct(current, previous) };
}
