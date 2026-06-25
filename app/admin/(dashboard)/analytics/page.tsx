"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  BriefcaseBusiness,
  Activity,
  DollarSign,
} from "lucide-react";
import { AdminPanel, AdminSpinner } from "../../../../components/admin/AdminUI";

type AnalyticsData = {
  overview: {
    totalLeads: number;
    leadsThisMonth: number;
    totalConversations: number;
    conversationsThisMonth: number;
    activeConversations: number;
    totalPosts: number;
    publishedPosts: number;
    totalClients: number;
    totalCases: number;
  };
  leadsByStatus: { status: string; count: number }[];
  recentLeads: { id: number; name: string; company: string | null; status: string; source: string; createdAt: string }[];
  recentAudit: { id: number; action: string; entity: string; entityId: string; adminUser: string; createdAt: string }[];
};

const statusLabels: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cotizado: "Cotizado",
  negociacion: "Negociación",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

const statusColors: Record<string, string> = {
  nuevo: "#3b82f6",
  contactado: "#0ea5e9",
  cotizado: "#f59e0b",
  negociacion: "#a855f7",
  cerrado: "#22c55e",
  perdido: "#94a3b8",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!data) return <p className="py-20 text-center text-slate-600">No se pudieron cargar las métricas.</p>;

  const { overview } = data;
  const maxLeadCount = Math.max(...(data.leadsByStatus.length > 0 ? data.leadsByStatus.map((s) => s.count) : [1]));

  const kpis = [
    { label: "Leads totales", value: overview.totalLeads, icon: Users, accent: "bg-blue-50 border-blue-200 text-blue-900" },
    { label: "Leads (30 días)", value: overview.leadsThisMonth, icon: TrendingUp, accent: "bg-green-50 border-green-200 text-green-900" },
    { label: "Conversaciones", value: overview.totalConversations, icon: MessageSquare, accent: "bg-purple-50 border-purple-200 text-purple-900" },
    { label: "Conv. activas", value: overview.activeConversations, icon: Activity, accent: "bg-amber-50 border-amber-200 text-amber-900" },
    { label: "Artículos", value: overview.totalPosts, sub: `${overview.publishedPosts} publicados`, icon: FileText, accent: "bg-sky-50 border-sky-200 text-sky-900" },
    { label: "Clientes", value: overview.totalClients, icon: BriefcaseBusiness, accent: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Analytics</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Métricas internas del negocio — datos actualizados en tiempo real.</p>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <AdminPanel key={kpi.label} className="p-5">
            <div className="flex items-start gap-4">
              <span className={`grid size-11 flex-none place-items-center rounded-lg border ${kpi.accent}`}>
                <kpi.icon className="size-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-800">{kpi.label}</p>
                <p className="mt-1 font-display text-[30px] font-bold leading-none tracking-[-0.035em] text-slate-950">{kpi.value}</p>
                {"sub" in kpi && kpi.sub && <p className="mt-2 text-[12px] font-medium text-slate-600">{kpi.sub}</p>}
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-2">
        {/* Lead pipeline chart */}
        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4 sm:px-6">
            <h2 className="font-display text-[19px] font-bold text-slate-950">Pipeline de leads</h2>
            <p className="mt-1 text-[12.5px] font-medium text-slate-600">Distribución por estado actual.</p>
          </div>
          <div className="p-5 sm:p-6">
            {data.leadsByStatus.length === 0 ? (
              <p className="py-10 text-center text-[13px] text-slate-600">No hay leads todavía.</p>
            ) : (
              <div className="space-y-3">
                {data.leadsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <span className="w-24 text-right text-[12.5px] font-bold text-slate-700">{statusLabels[item.status] || item.status}</span>
                    <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-slate-100">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md transition-all duration-500"
                        style={{ width: `${Math.max(8, (item.count / maxLeadCount) * 100)}%`, backgroundColor: statusColors[item.status] || "#64748b" }}
                      />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[12px] font-bold text-white drop-shadow-sm">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminPanel>

        {/* Recent leads */}
        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4 sm:px-6">
            <h2 className="font-display text-[19px] font-bold text-slate-950">Últimos leads</h2>
            <p className="mt-1 text-[12.5px] font-medium text-slate-600">Leads más recientes del sistema.</p>
          </div>
          {data.recentLeads.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-slate-600">No hay leads registrados.</p>
          ) : (
            <div>
              {data.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                  <span className="grid size-9 flex-none place-items-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-600">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-950">{lead.name}</p>
                    <p className="text-[11.5px] text-slate-600">{lead.company || lead.source} · {new Date(lead.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
                  </div>
                  <span
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-bold"
                    style={{ borderColor: statusColors[lead.status] || "#cbd5e1", backgroundColor: (statusColors[lead.status] || "#f1f5f9") + "20", color: statusColors[lead.status] || "#64748b" }}
                  >
                    {statusLabels[lead.status] || lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>
      </div>

      {/* Recent audit */}
      <AdminPanel className="mt-7 overflow-hidden">
        <div className="border-b border-slate-300 px-5 py-4 sm:px-6">
          <h2 className="font-display text-[19px] font-bold text-slate-950">Actividad reciente</h2>
          <p className="mt-1 text-[12.5px] font-medium text-slate-600">Últimas acciones realizadas en el sistema.</p>
        </div>
        {data.recentAudit.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-slate-600">No hay actividad registrada.</p>
        ) : (
          <div>
            {data.recentAudit.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                <span className={`size-2 flex-none rounded-full ${entry.action === "create" ? "bg-green-500" : entry.action === "update" ? "bg-blue-500" : "bg-red-500"}`} />
                <p className="min-w-0 flex-1 text-[13px] text-slate-700">
                  <span className="font-bold text-slate-950">{entry.adminUser}</span>{" "}
                  {entry.action === "create" ? "creó" : entry.action === "update" ? "editó" : "eliminó"}{" "}
                  {entry.entity} #{entry.entityId}
                </p>
                <time className="flex-none text-[11.5px] text-slate-500">{new Date(entry.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
