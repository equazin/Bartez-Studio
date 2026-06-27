"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LifeBuoy, Plus } from "lucide-react";
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

interface Ticket {
  id: string;
  number: string;
  type: string;
  priority: string;
  status: string;
  subject: string;
  channel: string;
  createdAt: string;
  dueAt: string | null;
  account: { id: string; name: string } | null;
  assignedTo: { id: string; name: string } | null;
  _count: { messages: number };
}

const STATUSES = [
  { value: "new", label: "Nuevo", color: "border-blue-200 bg-blue-50 text-blue-900" },
  { value: "open", label: "En progreso", color: "border-amber-200 bg-amber-50 text-amber-900" },
  { value: "pending", label: "Pendiente", color: "border-purple-200 bg-purple-50 text-purple-900" },
  { value: "solved", label: "Resuelto", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { value: "closed", label: "Cerrado", color: "border-slate-200 bg-slate-50 text-slate-700" },
];

const PRIORITIES = [
  { value: "low", label: "Baja", color: "text-slate-500" },
  { value: "normal", label: "Normal", color: "text-slate-700" },
  { value: "high", label: "Alta", color: "text-amber-700" },
  { value: "urgent", label: "Urgente", color: "text-red-700" },
];

const TYPES = [
  { value: "support", label: "Soporte" },
  { value: "rma", label: "RMA" },
  { value: "incident", label: "Incidente" },
  { value: "question", label: "Consulta" },
];

interface CreateState {
  subject: string;
  description: string;
  type: string;
  priority: string;
  accountId: string;
}

const emptyCreate: CreateState = { subject: "", description: "", type: "support", priority: "normal", accountId: "" };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [accounts, setAccounts] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
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
      if (priorityFilter) params.set("priority", priorityFilter);
      const res = await fetch(`/api/admin/tickets?${params}`);
      if (!res.ok) throw new Error("Error al cargar tickets");
      const json = await res.json();
      setTickets(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => {
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
  }, []);

  async function save() {
    if (!creating || !creating.subject.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: creating.subject,
          description: creating.description || null,
          type: creating.type,
          priority: creating.priority,
          accountId: creating.accountId || null,
        }),
      });
      if (!res.ok) throw new Error("Error al crear");
      setCreating(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear");
    } finally {
      setSaving(false);
    }
  }

  const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];
  const priorityMeta = (p: string) => PRIORITIES.find((x) => x.value === p) || PRIORITIES[1];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Tickets</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Soporte, RMA, incidentes y consultas.</p>
        </div>
        <AdminButton onClick={() => setCreating({ ...emptyCreate })}><Plus />Nuevo ticket</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por número o asunto…" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todas las prioridades</option>
          {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : tickets.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <LifeBuoy className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay tickets.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.7fr_1.4fr_.6fr_.6fr_.6fr_.6fr_.5fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Nº</span><span>Asunto</span><span>Cuenta</span><span>Estado</span><span>Prioridad</span><span>Asignado</span><span>Vence</span>
            </div>
            {tickets.map((t) => {
              const overdue = t.dueAt && new Date(t.dueAt) < new Date() && t.status !== "solved" && t.status !== "closed";
              return (
                <div key={t.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.7fr_1.4fr_.6fr_.6fr_.6fr_.6fr_.5fr] lg:items-center lg:gap-3">
                  <Link href={`/admin/tickets/${t.id}`} className="truncate font-mono text-[12.5px] font-bold text-brand hover:underline">{t.number}</Link>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-slate-950">{t.subject}</p>
                    <p className="text-[12px] text-slate-600">{TYPES.find((x) => x.value === t.type)?.label} · {t._count.messages} mensajes</p>
                  </div>
                  <p className="truncate text-[12.5px] text-slate-700">{t.account?.name || "—"}</p>
                  <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(t.status).color}`}>{statusMeta(t.status).label}</span>
                  <span className={`text-[12px] font-bold ${priorityMeta(t.priority).color}`}>{priorityMeta(t.priority).label}</span>
                  <p className="truncate text-[12px] text-slate-700">{t.assignedTo?.name || "—"}</p>
                  <p className={`text-[12px] ${overdue ? "font-bold text-red-700" : "text-slate-600"}`}>{t.dueAt ? new Date(t.dueAt).toLocaleDateString("es-AR") : "—"}</p>
                </div>
              );
            })}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}

      {creating && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[560px] p-6">
            <h2 className="font-display text-[20px] font-bold text-slate-950">Nuevo ticket</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminField label="Asunto *" htmlFor="t-subject">
                  <AdminInput id="t-subject" value={creating.subject} onChange={(e) => setCreating({ ...creating, subject: e.target.value })} />
                </AdminField>
              </div>
              <AdminField label="Tipo" htmlFor="t-type">
                <select id="t-type" value={creating.type} onChange={(e) => setCreating({ ...creating, type: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </AdminField>
              <AdminField label="Prioridad" htmlFor="t-priority">
                <select id="t-priority" value={creating.priority} onChange={(e) => setCreating({ ...creating, priority: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </AdminField>
              <div className="sm:col-span-2">
                <AdminField label="Cuenta" htmlFor="t-account">
                  <select id="t-account" value={creating.accountId} onChange={(e) => setCreating({ ...creating, accountId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                    <option value="">(Sin cuenta)</option>
                    {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </AdminField>
              </div>
              <div className="sm:col-span-2">
                <AdminField label="Descripción" htmlFor="t-desc">
                  <AdminTextarea id="t-desc" value={creating.description} onChange={(e) => setCreating({ ...creating, description: e.target.value })} rows={4} />
                </AdminField>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setCreating(null)}>Cancelar</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}>{saving ? "Creando…" : "Crear ticket"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}
    </div>
  );
}
