import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, Plus, ShieldCheck } from "lucide-react";
import { AdminButton, AdminPanel, StatusBadge } from "../../../components/admin/AdminUI";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

type RecentItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "Artículo" | "Logo" | "Caso de éxito";
  active: boolean;
  updatedAt: Date | null;
  href: string;
};

export default async function AdminDashboard() {
  const db = getDb();
  const [articleCount, publishedCount, logoCount, caseCount, posts, logos, cases] = await Promise.all([
    db.post.count().catch(() => 0),
    db.post.count({ where: { published: true } }).catch(() => 0),
    db.clientLogo.count({ where: { active: true } }).catch(() => 0),
    db.successCase.count({ where: { active: true } }).catch(() => 0),
    db.post.findMany({ take: 4, orderBy: { createdAt: "desc" } }).catch(() => []),
    db.clientLogo.findMany({ take: 3, orderBy: { id: "desc" } }).catch(() => []),
    db.successCase.findMany({ take: 3, orderBy: { id: "desc" } }).catch(() => []),
  ]);

  const recent: RecentItem[] = [
    ...posts.map((item) => ({ id: `post-${item.id}`, title: item.title, subtitle: `/recursos/${item.slug}`, type: "Artículo" as const, active: item.published, updatedAt: item.createdAt, href: "/admin/posts" })),
    ...logos.map((item) => ({ id: `logo-${item.id}`, title: item.name, subtitle: "Logo institucional", type: "Logo" as const, active: item.active, updatedAt: null, href: "/admin/clients" })),
    ...cases.map((item) => ({ id: `case-${item.id}`, title: item.title, subtitle: item.clientName, type: "Caso de éxito" as const, active: item.active, updatedAt: null, href: "/admin/cases" })),
  ].sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)).slice(0, 8);

  const stats = [
    { label: "Artículos", value: articleCount, note: `${publishedCount} publicados`, icon: FileText },
    { label: "Logos activos", value: logoCount, note: "visibles en el sitio", icon: ShieldCheck },
    { label: "Casos publicados", value: caseCount, note: "experiencias activas", icon: BriefcaseBusiness },
  ];

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(30px,4vw,42px)] font-bold tracking-[-0.04em] text-ink">Panel de contenidos</h1>
          <p className="mt-2 text-[14.5px] text-slate-600">Gestioná lo que se publica en el sitio institucional de Bartez.</p>
        </div>
        <AdminButton asChild><Link href="/admin/posts"><Plus />Crear contenido</Link></AdminButton>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <AdminPanel key={stat.label} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-slate-600">{stat.label}</p>
                <p className="mt-3 font-display text-[38px] font-bold leading-none tracking-[-0.04em] text-ink">{stat.value}</p>
                <p className="mt-3 text-[12px] text-slate-500">{stat.note}</p>
              </div>
              <span className="grid size-11 place-items-center rounded-[10px] bg-emerald-50 text-brand"><stat.icon className="size-5" strokeWidth={1.6} /></span>
            </div>
          </AdminPanel>
        ))}
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-display text-[17px] font-bold text-ink">Contenido reciente</h2>
          <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand">Ver contenido <ArrowRight className="size-4" /></Link>
        </div>
        {recent.length > 0 ? (
          <div>
            <div className="hidden grid-cols-[1.5fr_.6fr_.55fr_.7fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 md:grid">
              <span>Contenido</span><span>Tipo</span><span>Estado</span><span>Actualizado</span>
            </div>
            {recent.map((item) => (
              <Link key={item.id} href={item.href} className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 hover:bg-slate-50 md:grid-cols-[1.5fr_.6fr_.55fr_.7fr] md:items-center md:gap-4">
                <div className="min-w-0"><p className="truncate text-[13.5px] font-semibold text-ink">{item.title}</p><p className="mt-1 truncate text-[11.5px] text-slate-500">{item.subtitle}</p></div>
                <p className="text-[12.5px] text-slate-600">{item.type}</p>
                <div><StatusBadge active={item.active} activeLabel={item.type === "Logo" ? "Activo" : "Publicado"} inactiveLabel={item.type === "Logo" ? "Inactivo" : "Borrador"} /></div>
                <time className="text-[12px] text-slate-500">{item.updatedAt ? item.updatedAt.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) : "Sin fecha"}</time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-14 text-center"><p className="text-[14px] font-semibold text-ink">Todavía no hay contenido dinámico.</p><p className="mt-2 text-[12.5px] text-slate-500">Creá el primer artículo, logo o caso desde la navegación.</p></div>
        )}
      </AdminPanel>
    </div>
  );
}
