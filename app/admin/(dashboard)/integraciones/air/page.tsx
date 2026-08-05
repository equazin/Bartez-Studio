"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Zap } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner } from "../../../../../components/admin/AdminUI";

interface Stats {
  total: number;
  active: number;
  inactive: number;
  withStock: number;
  lastSyncedAt: string | null;
}

interface SyncRun {
  id: string;
  kind: string;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  pageCursor: number;
  itemsTouched: number;
  error: string | null;
}

interface AirStatus {
  enabled: boolean;
  stats?: Stats;
  runs?: SyncRun[];
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}

function statusBadge(status: string): { label: string; className: string; Icon: React.ElementType } {
  if (status === "ok") return { label: "OK", className: "bg-emerald-500/10 text-emerald-300", Icon: CheckCircle2 };
  if (status === "error") return { label: "Error", className: "bg-red-500/10 text-red-300", Icon: AlertTriangle };
  return { label: "Corriendo", className: "bg-amber-500/10 text-amber-300", Icon: RefreshCw };
}

export default function AirIntegrationPage() {
  const [state, setState] = useState<AirStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/air", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; data?: AirStatus; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setState(json.data ?? { enabled: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el estado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const syncNow = useCallback(async (kind: "catalog" | "syp") => {
    setSyncing(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/air?kind=${kind}`, { method: "POST" });
      const json = (await res.json()) as { ok: boolean; data?: { itemsTouched: number; pages: number }; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setMessage(`Sincronización completa: ${json.data?.pages ?? 0} páginas, ${json.data?.itemsTouched ?? 0} items.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al sincronizar");
    } finally {
      setSyncing(false);
    }
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Integración AIR</h1>
          <p className="text-sm text-white/60">
            Catálogo y stock del proveedor AIR S.R.L. Sincroniza cada 15 minutos.
          </p>
        </div>
        <AdminButton onClick={() => void load()} variant="secondary" size="sm" disabled={loading}>
          <RefreshCw className="mr-1 h-4 w-4" /> Actualizar
        </AdminButton>
      </div>

      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      {message && <AdminAlert tone="success">{message}</AdminAlert>}

      {loading && <AdminPanel><AdminSpinner label="Cargando estado" /></AdminPanel>}

      {!loading && state && !state.enabled && (
        <AdminPanel>
          <div className="flex items-start gap-3 text-white/80">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
            <div>
              <div className="font-medium text-white">La integración está deshabilitada.</div>
              <p className="mt-1 text-sm text-white/60">
                Configurá <code className="rounded bg-white/10 px-1">AIR_INTEGRATION_ENABLED=true</code> y el token{" "}
                <code className="rounded bg-white/10 px-1">AIR_TOKEN</code> en las variables de entorno de Vercel, o
                cargalo desde Sistema → Integraciones → AIR.
              </p>
            </div>
          </div>
        </AdminPanel>
      )}

      {!loading && state?.enabled && state.stats && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Productos totales" value={state.stats.total} />
            <StatCard label="Activos" value={state.stats.active} accent="emerald" />
            <StatCard label="Inactivos" value={state.stats.inactive} accent="slate" />
            <StatCard label="Con stock" value={state.stats.withStock} accent="amber" />
          </div>

          <AdminPanel>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm text-white/60">Última sincronización</div>
                <div className="text-lg font-medium text-white">{formatDateTime(state.stats.lastSyncedAt)}</div>
              </div>
              <div className="flex gap-2">
                <AdminButton onClick={() => void syncNow("syp")} variant="secondary" size="sm" disabled={syncing}>
                  <Zap className="mr-1 h-4 w-4" /> Sync stock+precio
                </AdminButton>
                <AdminButton onClick={() => void syncNow("catalog")} size="sm" disabled={syncing}>
                  <RefreshCw className={`mr-1 h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Sync catálogo completo
                </AdminButton>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel>
            <h2 className="mb-3 text-sm font-semibold text-white/80">Últimas corridas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-white/50">
                  <tr>
                    <th className="pb-2 pr-4">Inicio</th>
                    <th className="pb-2 pr-4">Tipo</th>
                    <th className="pb-2 pr-4">Estado</th>
                    <th className="pb-2 pr-4 text-right">Páginas</th>
                    <th className="pb-2 pr-4 text-right">Items</th>
                    <th className="pb-2">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {(state.runs ?? []).length === 0 && (
                    <tr><td className="py-3 text-white/50" colSpan={6}>Sin corridas todavía.</td></tr>
                  )}
                  {(state.runs ?? []).map((r) => {
                    const badge = statusBadge(r.status);
                    return (
                      <tr key={r.id} className="border-t border-white/5">
                        <td className="py-2 pr-4 text-white/80">{formatDateTime(r.startedAt)}</td>
                        <td className="py-2 pr-4 text-white/70">{r.kind}</td>
                        <td className="py-2 pr-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${badge.className}`}>
                            <badge.Icon className="h-3 w-3" /> {badge.label}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right text-white/80">{r.pageCursor}</td>
                        <td className="py-2 pr-4 text-right text-white/80">{r.itemsTouched}</td>
                        <td className="py-2 text-xs text-white/50">{r.error ?? (r.finishedAt ? formatDateTime(r.finishedAt) : "—")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "emerald" | "slate" | "amber" }) {
  const color =
    accent === "emerald" ? "text-emerald-300" :
    accent === "amber" ? "text-amber-300" :
    accent === "slate" ? "text-white/50" : "text-white";
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase text-white/50">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${color}`}>{value.toLocaleString("es-AR")}</div>
    </div>
  );
}
