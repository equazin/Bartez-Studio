import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Boxes,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Inbox,
  Landmark,
  Package,
  Plus,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AdminButton } from "../../../components/admin/AdminUI";
import { Sparkline } from "../../../components/admin/Sparkline";
import { getDb } from "../../../lib/db";
import { resolveOrgId } from "../../../lib/tenant";
import { getAdminSession } from "../../../lib/auth";
import { computeAlerts } from "../../../lib/modules/alerts/alerts-service";
import {
  financialOverview,
  topProducts,
} from "../../../lib/modules/reports/report-service";
import {
  receiptsDailySeries,
  salesDailySeries,
} from "../../../lib/modules/reports/daily-series";

export const dynamic = "force-dynamic";

function money(value: number, currency = "ARS"): string {
  return `${currency} ${Math.round(value).toLocaleString("es-AR")}`;
}

function moneyShort(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$ ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$ ${Math.round(value / 1_000)}K`;
  return `$ ${Math.round(value)}`;
}

function greeting(name: string): string {
  const hour = new Date().getHours();
  const prefix = hour < 13 ? "Buen día" : hour < 20 ? "Buenas tardes" : "Buenas noches";
  return `${prefix}, ${name}`;
}

function dateLabel(): string {
  return new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export default async function AdminDashboard() {
  const db = getDb();
  const session = await getAdminSession();
  const orgId = await resolveOrgId(session);
  const username = (session?.username as string | undefined) ?? "admin";

  const now = new Date();
  const from30 = new Date(now.getTime() - 30 * 86400_000);
  const inSevenDays = new Date(now.getTime() + 7 * 86400_000);

  const [alerts, overview, sales, receipts, products, ordersToFulfill, invoicesDueSoon, recentInvoices, recentReceipts, recentLeads] = await Promise.all([
    computeAlerts(orgId).catch(() => null),
    financialOverview({ organizationId: orgId, from: from30, to: now }).catch(() => null),
    salesDailySeries(orgId, 30).catch(() => null),
    receiptsDailySeries(orgId, 30).catch(() => null),
    topProducts({ organizationId: orgId, from: from30, to: now, limit: 5 }).catch(() => []),
    db.salesOrder.count({
      where: { organizationId: orgId, deletedAt: null, status: { in: ["confirmed", "processing"] } },
    }).catch(() => 0),
    db.invoice.count({
      where: { organizationId: orgId, status: "issued", deletedAt: null, paymentDueDate: { gte: now, lte: inSevenDays } },
    }).catch(() => 0),
    db.invoice.findMany({
      where: { organizationId: orgId, deletedAt: null },
      orderBy: { issueDate: "desc" },
      take: 4,
      select: { id: true, number: true, receiverName: true, total: true, currency: true, issueDate: true },
    }).catch(() => []),
    db.receipt.findMany({
      where: { organizationId: orgId, deletedAt: null },
      orderBy: { receivedAt: "desc" },
      take: 4,
      select: { id: true, number: true, amount: true, currency: true, receivedAt: true, account: { select: { name: true } } },
    }).catch(() => []),
    db.lead.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, company: true, source: true, createdAt: true },
    }).catch(() => []),
  ]);

  // Resúmenes de alertas
  const overduePending = alerts?.overdueInvoices.reduce((s, i) => s + i.pending, 0) ?? 0;
  const overdueCount = alerts?.counts.overdueInvoices ?? 0;
  const lowStockCount = alerts?.counts.lowStock ?? 0;
  const pendingApprovals = alerts?.pendingApprovals ?? [];
  const pendingApprovalsAmount = pendingApprovals.reduce((s, p) => s + p.total, 0);

  // Aging % para barras
  const ar = overview?.accountsReceivable;
  const arTotal = ar?.total ?? 0;
  const agingPct = (v: number) => (arTotal > 0 ? Math.round((v / arTotal) * 100) : 0);

  const cashByCurrency = new Map<string, number>();
  for (const c of overview?.cashBalances ?? []) {
    cashByCurrency.set(c.currency, (cashByCurrency.get(c.currency) ?? 0) + c.balance);
  }

  return (
    <div className="mx-auto max-w-[1240px] space-y-7">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">{dateLabel()}</p>
          <h1 className="mt-1 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{greeting(username)}</h1>
          <p className="mt-1.5 text-[13.5px] font-medium text-slate-600">Resumen operativo de Bartez — todo lo que necesitás de un vistazo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton asChild size="sm"><Link href="/admin/invoices/new"><Plus />Nueva factura</Link></AdminButton>
          <AdminButton asChild variant="secondary" size="sm"><Link href="/admin/orders"><FileSpreadsheet />Pedidos</Link></AdminButton>
          <AdminButton asChild variant="secondary" size="sm"><Link href="/admin/leads"><Inbox />Leads</Link></AdminButton>
        </div>
      </header>

      {/* SECCIÓN 1 — Para hacer hoy */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">Para hacer hoy</h2>
          {(overdueCount + lowStockCount + pendingApprovals.length) === 0 && (
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-700"><CheckCircle2 className="size-3.5" />Todo en orden</span>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TodoCard
            href="/admin/alerts"
            tone="red"
            icon={Clock}
            count={overdueCount}
            label="Cobranzas vencidas"
            value={overdueCount > 0 ? money(overduePending) : "Al día"}
          />
          <TodoCard
            href="/admin/alerts"
            tone="amber"
            icon={Boxes}
            count={lowStockCount}
            label="Stock bajo"
            value={lowStockCount > 0 ? `${lowStockCount} productos` : "Sin alertas"}
          />
          <TodoCard
            href="/admin/purchase-orders"
            tone="sky"
            icon={ShieldAlert}
            count={pendingApprovals.length}
            label="OC a aprobar"
            value={pendingApprovals.length > 0 ? money(pendingApprovalsAmount) : "Nada pendiente"}
          />
          <TodoCard
            href="/admin/orders"
            tone="violet"
            icon={Package}
            count={ordersToFulfill}
            label="Pedidos a entregar"
            value={ordersToFulfill > 0 ? `${ordersToFulfill} confirmados` : "Sin pendientes"}
            extra={invoicesDueSoon > 0 ? `+${invoicesDueSoon} facturas vencen en 7d` : undefined}
          />
        </div>
      </section>

      {/* SECCIÓN 2 — Posición financiera */}
      <section>
        <h2 className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">Posición financiera</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Por cobrar con aging */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Wallet className="size-4 text-emerald-600" />Por cobrar</span>
              <Link href="/admin/customer-accounts" className="text-[11.5px] font-semibold text-brand hover:underline">Ver cuentas →</Link>
            </div>
            <p className="mt-2 font-display text-[28px] font-bold leading-none tracking-[-0.025em] text-slate-950">{moneyShort(arTotal)}</p>
            <div className="mt-4 space-y-2">
              <AgingBar label="0-30 días" value={ar?.aging.d0_30 ?? 0} pct={agingPct(ar?.aging.d0_30 ?? 0)} color="bg-emerald-500" />
              <AgingBar label="31-60 días" value={ar?.aging.d31_60 ?? 0} pct={agingPct(ar?.aging.d31_60 ?? 0)} color="bg-amber-500" />
              <AgingBar label="61-90 días" value={ar?.aging.d61_90 ?? 0} pct={agingPct(ar?.aging.d61_90 ?? 0)} color="bg-orange-500" />
              <AgingBar label="+90 días" value={ar?.aging.d90_plus ?? 0} pct={agingPct(ar?.aging.d90_plus ?? 0)} color="bg-red-500" warn />
            </div>
          </article>

          {/* Por pagar */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Banknote className="size-4 text-rose-600" />Por pagar</span>
              <Link href="/admin/supplier-accounts" className="text-[11.5px] font-semibold text-brand hover:underline">Ver proveedores →</Link>
            </div>
            <p className="mt-2 font-display text-[28px] font-bold leading-none tracking-[-0.025em] text-slate-950">{moneyShort(overview?.accountsPayable.total ?? 0)}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-600">Pagos del mes</span>
                <span className="font-semibold text-slate-950">{moneyShort(overview?.supplierPayments.total ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-600">Compras del mes</span>
                <span className="font-semibold text-slate-950">{moneyShort(overview?.purchases.total ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-600">OC abiertas</span>
                <span className="font-semibold text-slate-950">{overview?.purchases.count ?? 0}</span>
              </div>
            </div>
          </article>

          {/* Caja y bancos */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Landmark className="size-4 text-brand" />Caja y bancos</span>
              <Link href="/admin/cash-accounts" className="text-[11.5px] font-semibold text-brand hover:underline">Ver detalle →</Link>
            </div>
            <p className="mt-2 font-display text-[28px] font-bold leading-none tracking-[-0.025em] text-slate-950">
              {cashByCurrency.size === 0 ? "—" : moneyShort(cashByCurrency.get("ARS") ?? 0)}
              {cashByCurrency.has("ARS") && <span className="ml-1 text-[14px] font-medium text-slate-500">ARS</span>}
            </p>
            <div className="mt-4 space-y-2">
              {(overview?.cashBalances ?? []).slice(0, 4).map((acc) => (
                <div key={acc.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="truncate text-slate-700">{acc.name}</span>
                  <span className="font-semibold text-slate-950">{acc.currency} {Math.round(acc.balance).toLocaleString("es-AR")}</span>
                </div>
              ))}
              {(overview?.cashBalances ?? []).length === 0 && (
                <p className="text-[12.5px] text-slate-500">Sin cuentas activas.</p>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* SECCIÓN 3 — Pulso del mes */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">Pulso del mes</h2>
          <Link href="/admin/reports" className="text-[12px] font-semibold text-brand hover:underline">Reportes BI →</Link>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <PulseCard
            label="Facturación"
            value={moneyShort(sales?.current ?? 0)}
            delta={sales?.deltaPct ?? null}
            series={sales?.series ?? []}
            icon={TrendingUp}
            positiveIsGood
          />
          <PulseCard
            label="Cobranzas"
            value={moneyShort(receipts?.current ?? 0)}
            delta={receipts?.deltaPct ?? null}
            series={receipts?.series ?? []}
            icon={Wallet}
            positiveIsGood
          />
          <PulseCard
            label="Compras"
            value={moneyShort(overview?.purchases.total ?? 0)}
            delta={null}
            series={[]}
            icon={Package}
            footnote={`${overview?.purchases.count ?? 0} OC en el período`}
          />
        </div>
      </section>

      {/* SECCIÓN 4 — Top productos + Actividad */}
      <section className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        {/* Top productos */}
        <article className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
            <h3 className="text-[14px] font-bold text-slate-950">Productos top del mes</h3>
            <Link href="/admin/reports" className="text-[11.5px] font-semibold text-brand hover:underline">Ver más →</Link>
          </header>
          {products.length === 0 ? (
            <div className="px-5 py-10 text-center text-[12.5px] text-slate-600">Sin ventas en el período.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {products.map((p, idx) => (
                <li key={p.productId} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid size-6 flex-none place-items-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">{idx + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-slate-950">{p.name}</p>
                    <p className="text-[11.5px] text-slate-600">{p.quantity.toLocaleString("es-AR")} u. vendidas</p>
                  </div>
                  <span className="text-[13px] font-bold text-slate-950">{moneyShort(p.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Actividad reciente */}
        <article className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <header className="border-b border-slate-200 px-5 py-3.5">
            <h3 className="text-[14px] font-bold text-slate-950">Últimos movimientos</h3>
          </header>
          <ul className="divide-y divide-slate-100">
            {[
              ...recentInvoices.map((i) => ({ id: `i-${i.id}`, kind: "Factura", title: i.number, sub: i.receiverName, amount: `${i.currency} ${Math.round(Number(i.total)).toLocaleString("es-AR")}`, date: i.issueDate, href: `/admin/invoices/${i.id}`, color: "text-blue-700 bg-blue-50" })),
              ...recentReceipts.map((r) => ({ id: `r-${r.id}`, kind: "Cobro", title: r.number, sub: r.account?.name ?? "—", amount: `${r.currency} ${Math.round(Number(r.amount)).toLocaleString("es-AR")}`, date: r.receivedAt, href: "/admin/receipts", color: "text-emerald-700 bg-emerald-50" })),
              ...recentLeads.map((l) => ({ id: `l-${l.id}`, kind: "Lead", title: l.name, sub: l.company ?? l.source ?? "—", amount: "", date: l.createdAt, href: "/admin/leads", color: "text-violet-700 bg-violet-50" })),
            ]
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 6)
              .map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold ${item.color}`}>{item.kind}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-950">{item.title}</p>
                      <p className="truncate text-[11.5px] text-slate-600">{item.sub}</p>
                    </div>
                    {item.amount && <span className="text-[12.5px] font-semibold text-slate-950">{item.amount}</span>}
                  </Link>
                </li>
              ))}
            {recentInvoices.length === 0 && recentReceipts.length === 0 && recentLeads.length === 0 && (
              <li className="px-5 py-10 text-center text-[12.5px] text-slate-600">Sin movimientos recientes.</li>
            )}
          </ul>
        </article>
      </section>
    </div>
  );
}

/* ──────────────────────────── Subcomponentes ──────────────────────────── */

function TodoCard({
  href,
  tone,
  icon: Icon,
  count,
  label,
  value,
  extra,
}: {
  href: string;
  tone: "red" | "amber" | "sky" | "violet";
  icon: React.ElementType;
  count: number;
  label: string;
  value: string;
  extra?: string;
}) {
  const isUrgent = count > 0;
  const toneStyles = {
    red: { ring: "ring-red-200", iconBg: "bg-red-50 text-red-700", count: "text-red-600", border: isUrgent ? "border-red-200" : "border-slate-200" },
    amber: { ring: "ring-amber-200", iconBg: "bg-amber-50 text-amber-700", count: "text-amber-600", border: isUrgent ? "border-amber-200" : "border-slate-200" },
    sky: { ring: "ring-sky-200", iconBg: "bg-sky-50 text-sky-700", count: "text-sky-700", border: isUrgent ? "border-sky-200" : "border-slate-200" },
    violet: { ring: "ring-violet-200", iconBg: "bg-violet-50 text-violet-700", count: "text-violet-700", border: isUrgent ? "border-violet-200" : "border-slate-200" },
  }[tone];

  return (
    <Link
      href={href}
      className={`group relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] ${toneStyles.border}`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid size-9 place-items-center rounded-xl ${toneStyles.iconBg}`}>
          <Icon className="size-[18px]" strokeWidth={1.8} />
        </span>
        <ArrowRight className="size-4 text-slate-300 transition-colors group-hover:text-slate-600" />
      </div>
      <p className={`mt-3 font-display text-[32px] font-bold leading-none tracking-[-0.03em] ${isUrgent ? toneStyles.count : "text-slate-400"}`}>{count}</p>
      <p className="mt-2 text-[13px] font-semibold text-slate-800">{label}</p>
      <p className="mt-0.5 text-[12px] text-slate-600">{value}</p>
      {extra && <p className="mt-1 text-[11px] font-medium text-slate-500">{extra}</p>}
    </Link>
  );
}

function AgingBar({ label, value, pct, color, warn }: { label: string; value: number; pct: number; color: string; warn?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-[12px]">
      <span className={`w-20 flex-none ${warn && value > 0 ? "font-bold text-red-700" : "text-slate-600"}`}>{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, pct)}%`, opacity: value > 0 ? 1 : 0.3 }} />
      </div>
      <span className="w-20 flex-none text-right font-semibold text-slate-950">{value > 0 ? moneyShort(value) : "—"}</span>
    </div>
  );
}

function PulseCard({
  label,
  value,
  delta,
  series,
  icon: Icon,
  positiveIsGood = true,
  footnote,
}: {
  label: string;
  value: string;
  delta: number | null;
  series: number[];
  icon: React.ElementType;
  positiveIsGood?: boolean;
  footnote?: string;
}) {
  const tone: "up" | "down" | "neutral" = delta == null || Math.abs(delta) < 0.5
    ? "neutral"
    : (delta > 0 ? (positiveIsGood ? "up" : "down") : (positiveIsGood ? "down" : "up"));
  const deltaText = delta == null ? null : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;
  const deltaStyles = tone === "up" ? "bg-emerald-50 text-emerald-700" : tone === "down" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Icon className="size-4 text-brand" />{label}</span>
        {deltaText && <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-bold ${deltaStyles}`}>{deltaText}</span>}
      </div>
      <p className="mt-2 font-display text-[28px] font-bold leading-none tracking-[-0.025em] text-slate-950">{value}</p>
      <div className="mt-3 min-h-[36px]">
        {series.length > 1 ? <Sparkline data={series} tone={tone} /> : footnote && <p className="text-[12px] text-slate-600">{footnote}</p>}
      </div>
    </article>
  );
}

