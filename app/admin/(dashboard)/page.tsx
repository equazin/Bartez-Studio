import { prisma } from "../../../lib/db";
import { FileText, Image as ImageIcon, Briefcase, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const postsCount = await prisma.post.count().catch(() => 0);
  const clientsCount = await prisma.clientLogo.count().catch(() => 0);
  const casesCount = await prisma.successCase.count().catch(() => 0);

  const stats = [
    { label: "Artículos en Recursos", count: postsCount, icon: FileText, color: "text-sky bg-sky/10" },
    { label: "Logos de Clientes", count: clientsCount, icon: ImageIcon, color: "text-accent bg-accent/10" },
    { label: "Casos de Éxito", count: casesCount, icon: Briefcase, color: "text-bronce bg-bronce/10" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div>
        <h1 className="font-display text-[28px] font-bold text-white tracking-tight">
          ¡Hola, Administrador!
        </h1>
        <p className="mt-2 text-[15px] text-slate-400">
          Acá podés gestionar el contenido institucional y dinámico de Bartez Tecnología.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-2xl border border-white/5 bg-[#0C2014] p-6 shadow-soft flex items-center justify-between">
              <div>
                <span className="text-[13.5px] font-medium text-slate-400">{stat.label}</span>
                <h2 className="mt-2 font-display text-[32px] font-bold text-white leading-none">{stat.count}</h2>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-[16.5px] font-semibold text-white">Accesos rápidos</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/posts"
            className="group flex flex-col justify-between rounded-xl border border-white/5 bg-[#0A2215] hover:bg-[#0E3220] p-5 transition-all text-left"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-sky/15 text-sky flex items-center justify-center mb-4">
                <Plus size={20} />
              </div>
              <h4 className="text-[15px] font-semibold text-white">Gestionar Artículos</h4>
              <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
                Creá, editá y eliminá guías de tecnología para la sección de Recursos.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-accent group-hover:translate-x-1 transition-transform">
              Ir ahora <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/admin/clients"
            className="group flex flex-col justify-between rounded-xl border border-white/5 bg-[#0A2215] hover:bg-[#0E3220] p-5 transition-all text-left"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4">
                <Plus size={20} />
              </div>
              <h4 className="text-[15px] font-semibold text-white">Gestionar Logos</h4>
              <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
                Subí los logos de marcas oficiales y clientes para la barra de confianza.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-accent group-hover:translate-x-1 transition-transform">
              Ir ahora <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/admin/cases"
            className="group flex flex-col justify-between rounded-xl border border-white/5 bg-[#0A2215] hover:bg-[#0E3220] p-5 transition-all text-left"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-bronce/15 text-bronce flex items-center justify-center mb-4">
                <Plus size={20} />
              </div>
              <h4 className="text-[15px] font-semibold text-white">Gestionar Casos</h4>
              <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
                Agregá testimonios y casos de éxito de proyectos reales con métricas.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-accent group-hover:translate-x-1 transition-transform">
              Ir ahora <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
