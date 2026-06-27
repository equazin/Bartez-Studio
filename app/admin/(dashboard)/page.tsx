import Link from "next/link";
import { ArrowRight, BarChart3, Bell, FileSpreadsheet, MessageSquare, Plus, UserCheck } from "lucide-react";
import { AdminButton, StatusBadge } from "../../../components/admin/AdminUI";
import { BigKpiCard } from "../../../components/admin/BigKpiCard";
import { getDb } from "../../../lib/db";
import { resolveOrgId } from "../../../lib/tenant";
import { getAdminSession } from "../../../lib/auth";
import {
  conversationsDailySeries,
  leadsDailySeries,
  receiptsDailySeries,
  salesDailySeries,
} from "../../../lib/modules/reports/daily-series";
import { computeAlerts } from "../../../lib/modules/alerts/alerts-service";

export const dynamic = "force-dynamic";

type RecentItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "Artículo" | "Cliente" | "Caso de éxito" | "Lead";
  active: boolean;
  updatedAt: Date;
  href: string;
};

function money(value: number): string {
  return `$ ${Math.round(value).toLocaleString("es-AR")}`;
}

function greeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 13) return `Buen día, ${name}`;
  if (hour < 20) return `Buenas tardes, ${name}`;
  return `Buenas noches, ${name}`;
}

export default async function AdminDashboard() {
  const db = getDb();
  const session = await getAdminSession();
  const orgId = await resolveOrgId(session);
  const username = (session?.username as string | undefined) ?? "admin";

  const [sales, receipts, leads, convos, alerts, posts, clients, cases, leadsRecent] = await Promise.all([
    salesDailySeries(orgId).catch(() => null),
    receiptsDailySeries(orgId).catch(() => null),
    leadsDailySeries(orgId).catch(() => null),
    conversationsDailySeries(orgId).catch(() => null),
    computeAlerts(orgId).catch(() => null),
    db.post.findMany({ take: 3, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.clientLogo.findMany({ take: 3, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.successCase.findMany({ take: 3, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.lead.findMany({ take: 4, orderBy: { updatedAt: "desc" } }).catch(() => []),
  ]);

  const recent: RecentItem[] = [
    ...posts.map((item) => ({ id: `post-${item.id}`, title: item.title, subtitle: `/recursos/${item.slug}`, type: "Artículo" as const, active: item.published, updatedAt: item.updatedAt, href: "/admin/posts" })),
    ...clients.map((item) => ({ id: `client-${item.id}`, title: item.name, subtitle: "Identidad de cliente", type: "Cliente" as const, active: item.active, updatedAt: item.updatedAt, href: "/admin/clients" })),
    ...cases.map((item) => ({ id: `case-${item.id}`, title: item.title, subtitle: item.clientName, type: "Caso de éxito" as const, active: item.active, updatedAt: item.updatedAt, href: "/admin/cases" })),
    ...leadsRecent.map((item) => ({ id: `lead-${item.id}`, title: item.name, subtitle: item.company || item.source, type: "Lead" as const, active: item.status !== "perdido", updatedAt: item.updatedAt, href: "/admin/leads" })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 8);

  const quickActions = [
    { label: "Nuevo lead", href: "/admin/leads", icon: UserCheck, variant: "primary" as const },
    { label: "Nueva factura", href: "/admin/invoices/new", icon: Plus, variant: "secondary" as const },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3, variant: "secondary" as const },
    { label: "WhatsApp", href: "/admin/conversations", icon: MessageSquare, variant: "secondary" as const },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">Dashboard</p>
          <h1 className="mt-1 font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">{greeting(username)}</h1>
          <p className="mt-1.5 text-[14px] font-medium text-slate-600">Esto pasó en Bartez en los últimos 30 días.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <AdminButton key={a.label} asChild variant={a.variant} size="sm">
              <Link href={a.href}><a.icon />{a.label}</Link>
            </AdminButton>
          ))}
        </div>
      </div>

      {/* Alertas pinned (si hay) */}
      {alerts && alerts.counts.total > 0 && (
        <Link
          href="/admin/alerts"
          className="mt-7 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/40 px-5 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-amber-300 hover:shadow-[0_4px_12px_rgba(245,158,11,0.18)]"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-amber-100 text-amber-700"><Bell className="size-[18px]" /></span>
            <div>
              <p className="text-[14px] font-bold text-amber-950">Tenés {alerts.counts.total} alertas operativas</p>
              <p className="text-[12.5px] text-amber-800">
                {alerts.counts.overdueInvoices > 0 && `${alerts.counts.overdueInvoices} cobranzas vencidas · `}
                {alerts.counts.lowStock > 0 && `${alerts.counts.lowStock} con stock bajo · `}
                {alerts.counts.pendingApprovals > 0 && `${alerts.counts.pendingApprovals} OC a aprobar`}
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 flex-none text-amber-700" />
        </Link>
      )}

      {/* KPIs grandes */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sales && <BigKpiCard label="Facturación" periodLabel="Últimos 30 días" value={money(sales.current)} delta={sales.deltaPct} series={sales.series} footnote="vs 30 días previos" />}
        {receipts && <BigKpiCard label="Cobranzas" periodLabel="Últimos 30 días" value={money(receipts.current)} delta={receipts.deltaPct} series={receipts.series} footnote="vs 30 días previos" />}
        {leads && <BigKpiCard label="Leads nuevos" periodLabel="Últimos 30 días" value={leads.current.toLocaleString("es-AR")} delta={leads.deltaPct} series={leads.series} footnote="vs 30 días previos" />}
        {convos && <BigKpiCard label="Conversaciones WA" periodLabel="Últimos 30 días" value={convos.current.toLocaleString("es-AR")} delta={convos.deltaPct} series={convos.series} footnote="vs 30 días previos" />}
      </div>

      {/* Atajos a módulos */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/invoices", label: "Facturas", icon: FileSpreadsheet, color: "from-blue-500/10 to-blue-500/0 text-blue-700" },
          { href: "/admin/orders", label: "Pedidos", icon: FileSpreadsheet, color: "from-emerald-500/10 to-emerald-500/0 text-emerald-700" },
          { href: "/admin/accounting", label: "Contabilidad", icon: BarChart3, color: "from-purple-500/10 to-purple-500/0 text-purple-700" },
          { href: "/admin/reports", label: "Reportes BI", icon: BarChart3, color: "from-amber-500/10 to-amber-500/0 text-amber-700" },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:shadow-[0_4px_18px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-center gap-3">
              <span className={`grid size-10 place-items-center rounded-lg bg-gradient-to-br ${q.color}`}><q.icon className="size-5" strokeWidth={1.8} /></span>
              <span className="text-[14px] font-bold text-slate-950">{q.label}</span>
            </div>
            <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
          </Link>
        ))}
      </div>

      {/* Actividad reciente */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-[18px] font-bold text-slate-950">Actividad reciente</h2>
            <p className="mt-0.5 text-[12.5px] font-medium text-slate-600">Últimos cambios en el sistema.</p>
          </div>
        </div>
        {recent.length > 0 ? (
          <div>
            <div className="hidden grid-cols-[1.6fr_.6fr_.55fr_.7fr] gap-4 border-b border-slate-200 bg-slate-50/60 px-6 py-3 text-[12px] font-semibold text-slate-700 md:grid">
              <span>Contenido</span><span>Tipo</span><span>Estado</span><span>Actualizado</span>
            </div>
            {recent.map((item) => (
              <Link key={item.id} href={item.href} className="grid gap-2 border-b border-slate-100 px-5 py-3.5 transition-colors last:border-0 hover:bg-blue-50/40 sm:px-6 md:grid-cols-[1.6fr_.6fr_.55fr_.7fr] md:items-center md:gap-4">
                <div className="min-w-0"><p className="truncate text-[13.5px] font-bold text-slate-950">{item.title}</p><p className="mt-1 truncate text-[12px] text-slate-600">{item.subtitle}</p></div>
                <p className="text-[12.5px] font-medium text-slate-700">{item.type}</p>
                <div><StatusBadge active={item.active} activeLabel={item.type === "Lead" ? "Activo" : item.type === "Cliente" ? "Activo" : "Publicado"} inactiveLabel={item.type === "Lead" ? "Perdido" : item.type === "Cliente" ? "Inactivo" : "Borrador"} /></div>
                <time className="text-[12px] font-medium text-slate-600">{item.updatedAt.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-14 text-center"><p className="text-[14px] font-bold text-slate-950">Todavía no hay actividad.</p><p className="mt-2 text-[12.5px] text-slate-600">Empezá creando un lead, una factura o un artículo.</p></div>
        )}
      </section>
    </div>
  );
}
