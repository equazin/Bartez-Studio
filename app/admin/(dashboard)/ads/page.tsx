import { BarChart3, CircleDollarSign, MousePointerClick, RefreshCw, Target, TrendingUp, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import { Sparkline } from "../../../../components/admin/Sparkline";
import { AdminPanel } from "../../../../components/admin/AdminUI";
import { getAdminSession } from "../../../../lib/auth";
import { resolveOrgId } from "../../../../lib/tenant";
import { getAdPerformanceDashboard, type AdPerformanceRow } from "../../../../lib/modules/ads/performance-service";

export const dynamic = "force-dynamic";

const PERIODS = [
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
  { label: "90 días", days: 90 },
];

function money(value: number): string {
  return `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

function metric(value: number | null, suffix = ""): string {
  if (value == null) return "—";
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 2 })}${suffix}`;
}

function platformLabel(platform: string): string {
  return platform === "google_ads" ? "Google Ads" : "Meta Ads";
}

function platformClass(platform: string): string {
  return platform === "google_ads"
    ? "border-blue-200 bg-blue-50 text-blue-800"
    : "border-indigo-200 bg-indigo-50 text-indigo-800";
}

export default async function AdsPage({ searchParams }: { searchParams?: { days?: string } }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const orgId = await resolveOrgId(session);
  const days = Math.min(90, Math.max(7, Number(searchParams?.days) || 30));
  const dashboard = await getAdPerformanceDashboard(orgId, days);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Ads / ROAS</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">
            Cruce de gasto publicitario, leads atribuidos, conversiones y facturación real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {PERIODS.map((period) => (
              <a
                key={period.days}
                href={`/admin/ads?days=${period.days}`}
                className={`rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors ${
                  days === period.days ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {period.label}
              </a>
            ))}
          </div>
          <form action="/api/admin/ads/sync" method="post">
            <input type="hidden" name="days" value={days} />
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[12px] font-bold text-slate-800 hover:bg-slate-50">
              <RefreshCw className="size-3.5" />
              Sincronizar
            </button>
          </form>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Gasto" value={money(dashboard.totals.spend)} sub={`${dashboard.totals.clicks.toLocaleString("es-AR")} clicks`} icon={CircleDollarSign} tone="bg-blue-50 border-blue-200 text-blue-900" />
        <Kpi label="Revenue" value={money(dashboard.totals.revenue)} sub={`${dashboard.totals.conversions} conversiones`} icon={TrendingUp} tone="bg-emerald-50 border-emerald-200 text-emerald-900" />
        <Kpi label="ROAS" value={metric(dashboard.totals.roas, "x")} sub="facturación / gasto" icon={BarChart3} tone="bg-slate-100 border-slate-200 text-slate-900" />
        <Kpi label="CAC" value={dashboard.totals.cac == null ? "—" : money(dashboard.totals.cac)} sub="gasto / conversión" icon={Target} tone="bg-amber-50 border-amber-200 text-amber-900" />
        <Kpi label="CPL" value={dashboard.totals.cpl == null ? "—" : money(dashboard.totals.cpl)} sub={`${dashboard.totals.leads} leads`} icon={UsersRound} tone="bg-purple-50 border-purple-200 text-purple-900" />
      </div>

      <AdminPanel className="mt-7 overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-slate-300 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-[19px] font-bold text-slate-950">Campañas</h2>
            <p className="mt-1 text-[12.5px] text-slate-600">
              {dashboard.lastSyncedAt ? `Última sincronización: ${new Date(dashboard.lastSyncedAt).toLocaleString("es-AR")}` : "Aún sin sync externo de gasto. Se muestra atribución local disponible."}
            </p>
          </div>
          <span className="text-[12px] font-bold text-slate-500">{dashboard.rows.length} campañas</span>
        </div>

        {dashboard.rows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <MousePointerClick className="mx-auto size-9 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">Todavía no hay campañas atribuidas.</p>
            <p className="mt-1 text-[13px] text-slate-600">Entrá leads con UTMs, gclid o fbclid y emití facturas asociadas a la cuenta.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-[13px]">
              <thead className="bg-slate-100 text-[12px] font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-2.5 text-left">Campaña</th>
                  <th className="px-3 py-2.5 text-right">Gasto</th>
                  <th className="px-3 py-2.5 text-right">Clicks</th>
                  <th className="px-3 py-2.5 text-right">Leads</th>
                  <th className="px-3 py-2.5 text-right">Conv.</th>
                  <th className="px-3 py-2.5 text-right">Revenue</th>
                  <th className="px-3 py-2.5 text-right">ROAS</th>
                  <th className="px-3 py-2.5 text-right">CAC</th>
                  <th className="px-5 py-2.5 text-left">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.rows.map((row) => (
                  <CampaignRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

function Kpi({ label, value, sub, icon: Icon, tone }: { label: string; value: string; sub: string; icon: typeof BarChart3; tone: string }) {
  return (
    <AdminPanel className="p-5">
      <div className="flex items-start gap-3">
        <span className={`grid size-10 flex-none place-items-center rounded-lg border ${tone}`}>
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-slate-700">{label}</p>
          <p className="mt-1 font-display text-[24px] font-bold leading-none tracking-[-0.035em] text-slate-950">{value}</p>
          <p className="mt-2 text-[12px] font-medium text-slate-600">{sub}</p>
        </div>
      </div>
    </AdminPanel>
  );
}

function CampaignRow({ row }: { row: AdPerformanceRow }) {
  const tone = row.revenue >= row.spend ? "up" : "down";
  return (
    <tr className="border-t border-slate-200">
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${platformClass(row.platform)}`}>
            {platformLabel(row.platform)}
          </span>
          <span className="truncate font-bold text-slate-950">{row.name}</span>
        </div>
        <p className="mt-1 font-mono text-[11px] text-slate-500">{row.externalCampaignId} · {row.status}</p>
      </td>
      <td className="px-3 py-3 text-right font-bold text-slate-950">{money(row.spend)}</td>
      <td className="px-3 py-3 text-right text-slate-700">{row.clicks.toLocaleString("es-AR")}</td>
      <td className="px-3 py-3 text-right text-slate-700">{row.leads.toLocaleString("es-AR")}</td>
      <td className="px-3 py-3 text-right text-slate-700">{row.conversions.toLocaleString("es-AR")}</td>
      <td className="px-3 py-3 text-right font-bold text-slate-950">{money(row.revenue)}</td>
      <td className="px-3 py-3 text-right">
        <span className={`font-bold ${row.roas == null ? "text-slate-400" : row.roas >= 1 ? "text-emerald-700" : "text-red-600"}`}>{metric(row.roas, "x")}</span>
      </td>
      <td className="px-3 py-3 text-right text-slate-700">{row.cac == null ? "—" : money(row.cac)}</td>
      <td className="px-5 py-3">
        <Sparkline data={row.series} tone={tone} className="min-w-32" />
      </td>
    </tr>
  );
}
