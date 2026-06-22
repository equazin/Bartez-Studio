import Link from "next/link";
import { BriefcaseBusiness, FileClock, FileText, Plus, UsersRound } from "lucide-react";
import { AdminButton, AdminPanel, StatusBadge } from "../../../components/admin/AdminUI";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

type RecentItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "Artículo" | "Cliente" | "Caso de éxito";
  active: boolean;
  updatedAt: Date;
  href: string;
};

export default async function AdminDashboard() {
  const db = getDb();
  const [articleCount, publishedCount, clientCount, caseCount, posts, clients, cases] = await Promise.all([
    db.post.count().catch(() => 0),
    db.post.count({ where: { published: true } }).catch(() => 0),
    db.clientLogo.count({ where: { active: true } }).catch(() => 0),
    db.successCase.count({ where: { active: true } }).catch(() => 0),
    db.post.findMany({ take: 5, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.clientLogo.findMany({ take: 4, orderBy: { updatedAt: "desc" } }).catch(() => []),
    db.successCase.findMany({ take: 4, orderBy: { updatedAt: "desc" } }).catch(() => []),
  ]);

  const recent: RecentItem[] = [
    ...posts.map((item) => ({ id: `post-${item.id}`, title: item.title, subtitle: `/recursos/${item.slug}`, type: "Artículo" as const, active: item.published, updatedAt: item.updatedAt, href: "/admin/posts" })),
    ...clients.map((item) => ({ id: `client-${item.id}`, title: item.name, subtitle: "Identidad de cliente", type: "Cliente" as const, active: item.active, updatedAt: item.updatedAt, href: "/admin/clients" })),
    ...cases.map((item) => ({ id: `case-${item.id}`, title: item.title, subtitle: item.clientName, type: "Caso de éxito" as const, active: item.active, updatedAt: item.updatedAt, href: "/admin/cases" })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 10);

  const stats = [
    { label: "Artículos", value: articleCount, note: `${publishedCount} publicados`, icon: FileText },
    { label: "Clientes", value: clientCount, note: "visibles en el sitio", icon: UsersRound },
    { label: "Casos de éxito", value: caseCount, note: "publicados", icon: BriefcaseBusiness },
    { label: "Borradores", value: Math.max(0, articleCount - publishedCount), note: "pendientes de publicar", icon: FileClock },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Panel de contenidos</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Administrá la información visible en el sitio institucional.</p>
        </div>
        <AdminButton asChild><Link href="/admin/posts"><Plus />Nuevo artículo</Link></AdminButton>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminPanel key={stat.label} className="p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-11 flex-none place-items-center rounded-lg border border-green-200 bg-green-50 text-green-900"><stat.icon className="size-5" strokeWidth={1.8} /></span>
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
            <p className="mt-1 text-[12.5px] font-medium text-slate-600">Últimos cambios realizados en el panel.</p>
          </div>
        </div>
        {recent.length > 0 ? (
          <div>
            <div className="hidden grid-cols-[1.6fr_.6fr_.55fr_.7fr] gap-4 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 md:grid">
              <span>Contenido</span><span>Tipo</span><span>Estado</span><span>Actualizado</span>
            </div>
            {recent.map((item) => (
              <Link key={item.id} href={item.href} className="grid gap-2 border-b border-slate-200 px-5 py-4 transition-colors last:border-0 hover:bg-green-50/60 sm:px-6 md:grid-cols-[1.6fr_.6fr_.55fr_.7fr] md:items-center md:gap-4">
                <div className="min-w-0"><p className="truncate text-[13.5px] font-bold text-slate-950">{item.title}</p><p className="mt-1 truncate text-[12px] text-slate-600">{item.subtitle}</p></div>
                <p className="text-[12.5px] font-medium text-slate-700">{item.type}</p>
                <div><StatusBadge active={item.active} activeLabel={item.type === "Cliente" ? "Activo" : "Publicado"} inactiveLabel={item.type === "Cliente" ? "Inactivo" : "Borrador"} /></div>
                <time className="text-[12px] font-medium text-slate-600">{item.updatedAt.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-14 text-center"><p className="text-[14px] font-bold text-slate-950">Todavía no hay contenido dinámico.</p><p className="mt-2 text-[12.5px] text-slate-600">Creá el primer artículo, cliente o caso desde la navegación.</p></div>
        )}
      </AdminPanel>
    </div>
  );
}
