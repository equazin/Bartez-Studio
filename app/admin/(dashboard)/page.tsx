import Link from "next/link";
import { BarChart3, BriefcaseBusiness, FileClock, FileText, MessageSquare, Plus, TrendingUp, UserCheck, UsersRound } from "lucide-react";
import { AdminButton, AdminPanel, StatusBadge } from "../../../components/admin/AdminUI";
import { getDb } from "../../../lib/db";

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

export default async function AdminDashboard() {
  const db = getDb();
  const [articleCount, publishedCount, clientCount, caseCount, leadCount, activeConvos, posts, clients, cases, leads] = await Promise.all([
    db.post.count().catch(() => 0),
    db.post.count({ where: { published: true } }).catch(() => 0),
    db.clientLogo.count({ where: { active: true } }).catch(() => 0),
    db.successCase.count({ where: { active: true } }).catch(() => 0),
    db.lead.count().catch(() => 0),
    db.waConversation.count({ where: { status: "active" } }).catch(() => 0),
    db.post.findMany({ take: 3, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.clientLogo.findMany({ take: 3, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.successCase.findMany({ take: 3, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.lead.findMany({ take: 4, orderBy: { updatedAt: "desc" } }).catch(() => []),
  ]);

  const recent: RecentItem[] = [
    ...posts.map((item) => ({ id: `post-${item.id}`, title: item.title, subtitle: `/recursos/${item.slug}`, type: "Artículo" as const, active: item.published, updatedAt: item.updatedAt, href: "/admin/posts" })),
    ...clients.map((item) => ({ id: `client-${item.id}`, title: item.name, subtitle: "Identidad de cliente", type: "Cliente" as const, active: item.active, updatedAt: item.updatedAt, href: "/admin/clients" })),
    ...cases.map((item) => ({ id: `case-${item.id}`, title: item.title, subtitle: item.clientName, type: "Caso de éxito" as const, active: item.active, updatedAt: item.updatedAt, href: "/admin/cases" })),
    ...leads.map((item) => ({ id: `lead-${item.id}`, title: item.name, subtitle: item.company || item.source, type: "Lead" as const, active: item.status !== "perdido", updatedAt: item.updatedAt, href: "/admin/leads" })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 10);

  const stats = [
    { label: "Leads", value: leadCount, note: "oportunidades comerciales", icon: UserCheck, accent: "border-blue-200 bg-blue-50 text-blue-900" },
    { label: "WhatsApp activos", value: activeConvos, note: "conversaciones en curso", icon: MessageSquare, accent: "border-purple-200 bg-purple-50 text-purple-900" },
    { label: "Artículos", value: articleCount, note: `${publishedCount} publicados`, icon: FileText, accent: "border-sky-200 bg-sky-50 text-sky-900" },
    { label: "Clientes", value: clientCount, note: "visibles en el sitio", icon: UsersRound, accent: "border-emerald-200 bg-emerald-50 text-emerald-900" },
    { label: "Casos de éxito", value: caseCount, note: "publicados", icon: BriefcaseBusiness, accent: "border-amber-200 bg-amber-50 text-amber-900" },
    { label: "Borradores", value: Math.max(0, articleCount - publishedCount), note: "pendientes de publicar", icon: FileClock, accent: "border-slate-200 bg-slate-50 text-slate-900" },
  ];

  const quickActions = [
    { label: "Nuevo lead", href: "/admin/leads", icon: UserCheck },
    { label: "Nuevo artículo", href: "/admin/posts", icon: Plus },
    { label: "Ver analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Ver WhatsApp", href: "/admin/conversations", icon: MessageSquare },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Sistema Bartez</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Centro de operaciones — contenidos, leads, comunicación y métricas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <AdminButton key={a.label} asChild variant={a.label === "Nuevo lead" ? "primary" : "secondary"}>
              <Link href={a.href}><a.icon className="size-4" />{a.label}</Link>
            </AdminButton>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <AdminPanel key={stat.label} className="p-5">
            <div className="flex items-start gap-4">
              <span className={`grid size-11 flex-none place-items-center rounded-lg border ${stat.accent}`}><stat.icon className="size-5" strokeWidth={1.8} /></span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-800">{stat.label}</p>
                <p className="mt-1 font-display text-[30px] font-bold leading-none tracking-[-0.035em] text-slate-950">{stat.value}</p>
                <p className="mt-2 text-[12px] font-medium text-slate-600">{stat.note}</p>
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>

      <AdminPanel className="mt-7 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-[19px] font-bold text-slate-950">Actividad reciente</h2>
            <p className="mt-1 text-[12.5px] font-medium text-slate-600">Últimos cambios en el sistema.</p>
          </div>
        </div>
        {recent.length > 0 ? (
          <div>
            <div className="hidden grid-cols-[1.6fr_.6fr_.55fr_.7fr] gap-4 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 md:grid">
              <span>Contenido</span><span>Tipo</span><span>Estado</span><span>Actualizado</span>
            </div>
            {recent.map((item) => (
              <Link key={item.id} href={item.href} className="grid gap-2 border-b border-slate-200 px-5 py-4 transition-colors last:border-0 hover:bg-blue-50/60 sm:px-6 md:grid-cols-[1.6fr_.6fr_.55fr_.7fr] md:items-center md:gap-4">
                <div className="min-w-0"><p className="truncate text-[13.5px] font-bold text-slate-950">{item.title}</p><p className="mt-1 truncate text-[12px] text-slate-600">{item.subtitle}</p></div>
                <p className="text-[12.5px] font-medium text-slate-700">{item.type}</p>
                <div><StatusBadge active={item.active} activeLabel={item.type === "Lead" ? "Activo" : item.type === "Cliente" ? "Activo" : "Publicado"} inactiveLabel={item.type === "Lead" ? "Perdido" : item.type === "Cliente" ? "Inactivo" : "Borrador"} /></div>
                <time className="text-[12px] font-medium text-slate-600">{item.updatedAt.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-14 text-center"><p className="text-[14px] font-bold text-slate-950">Todavía no hay contenido dinámico.</p><p className="mt-2 text-[12.5px] text-slate-600">Creá el primer artículo, lead o caso desde la navegación.</p></div>
        )}
      </AdminPanel>
    </div>
  );
}
