"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  AdminTextarea,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface WorkOrder {
  id: string;
  number: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  scheduledFor: string | null;
  account: { id: string; name: string } | null;
  assignedTo: { id: string; name: string } | null;
  _count: { items: number };
}

const STATUSES = [
  { value: "scheduled", label: "Programada", color: "border-blue-200 bg-blue-50 text-blue-900" },
  { value: "in_progress", label: "En curso", color: "border-amber-200 bg-amber-50 text-amber-900" },
  { value: "completed", label: "Completada", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { value: "cancelled", label: "Cancelada", color: "border-slate-200 bg-slate-50 text-slate-700" },
];
const TYPES = [
  { value: "install", label: "Instalación" },
  { value: "repair", label: "Reparación" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "training", label: "Capacitación" },
];

interface CreateState {
  title: string;
  description: string;
  type: string;
  priority: string;
  accountId: string;
  scheduledFor: string;
}
const emptyCreate: CreateState = { title: "", description: "", type: "repair", priority: "normal", accountId: "", scheduledFor: "" };

export default function WorkOrdersPage() {
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [accounts, setAccounts] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;
  const [creating, setCreating] = useState<CreateState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/work-orders?${params}`);
      if (!res.ok) throw new Error("Error al cargar OT");
      const json = await res.json();
      setItems(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
  }, []);

  async function save() {
    if (!creating || !creating.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: creating.title,
          description: creating.description || null,
          type: creating.type,
          priority: creating.priority,
          accountId: creating.accountId || null,
          scheduledFor: creating.scheduledFor || null,
          items: [],
        }),
      });
      if (!res.ok) throw new Error("Error al crear");
      setCreating(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Órdenes de trabajo</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Instalaciones, reparaciones y mantenimientos.</p>
        </div>
        <AdminButton onClick={() => setCreating({ ...emptyCreate })}><Plus />Nueva OT</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por número o título…" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Wrench className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay OT.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.7fr_1.4fr_.6fr_.6fr_.6fr_.6fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Nº</span><span>Título</span><span>Cuenta</span><span>Estado</span><span>Tipo</span><span>Programada</span>
            </div>
            {items.map((wo) => (
              <Link key={wo.id} href={`/admin/work-orders/${wo.id}`} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 hover:bg-slate-50 sm:px-6 lg:grid-cols-[.7fr_1.4fr_.6fr_.6fr_.6fr_.6fr] lg:items-center lg:gap-3">
                <p className="truncate font-mono text-[12.5px] font-bold text-brand">{wo.number}</p>
                <p className="truncate text-[13px] font-bold text-slate-950">{wo.title}</p>
                <p className="truncate text-[12.5px] text-slate-700">{wo.account?.name || "—"}</p>
                <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(wo.status).color}`}>{statusMeta(wo.status).label}</span>
                <span className="text-[12px] text-slate-700">{TYPES.find((x) => x.value === wo.type)?.label}</span>
                <span className="text-[12px] text-slate-600">{wo.scheduledFor ? new Date(wo.scheduledFor).toLocaleDateString("es-AR") : "—"}</span>
              </Link>
            ))}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}

      {creating && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[560px] p-6">
            <h2 className="font-display text-[20px] font-bold text-slate-950">Nueva OT</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminField label="Título *" htmlFor="w-title">
                  <AdminInput id="w-title" value={creating.title} onChange={(e) => setCreating({ ...creating, title: e.target.value })} />
                </AdminField>
              </div>
              <AdminField label="Tipo" htmlFor="w-type">
                <select id="w-type" value={creating.type} onChange={(e) => setCreating({ ...creating, type: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </AdminField>
              <AdminField label="Programada para" htmlFor="w-sched">
                <AdminInput id="w-sched" type="datetime-local" value={creating.scheduledFor} onChange={(e) => setCreating({ ...creating, scheduledFor: e.target.value })} />
              </AdminField>
              <div className="sm:col-span-2">
                <AdminField label="Cuenta" htmlFor="w-account">
                  <select id="w-account" value={creating.accountId} onChange={(e) => setCreating({ ...creating, accountId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                    <option value="">(Sin cuenta)</option>
                    {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </AdminField>
              </div>
              <div className="sm:col-span-2">
                <AdminField label="Descripción" htmlFor="w-desc">
                  <AdminTextarea id="w-desc" value={creating.description} onChange={(e) => setCreating({ ...creating, description: e.target.value })} rows={3} />
                </AdminField>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setCreating(null)}>Cancelar</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}>{saving ? "Creando…" : "Crear OT"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}
    </div>
  );
}
