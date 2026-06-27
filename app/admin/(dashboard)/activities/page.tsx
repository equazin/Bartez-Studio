"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPagination,
  AdminPanel,
  AdminPanel as Panel,
  AdminSpinner,
  AdminTextarea,
  ConfirmDialog,
} from "../../../../components/admin/AdminUI";

interface Activity {
  id: string;
  type: string;
  subject: string;
  body: string | null;
  status: string;
  dueAt: string | null;
  completedAt: string | null;
  assignedToId: string | null;
  accountId: string | null;
  contactId: string | null;
  opportunityId: string | null;
  account: { id: string; name: string } | null;
  contact: { id: string; firstName: string; lastName: string | null } | null;
  opportunity: { id: string; title: string } | null;
  assignedTo: { id: string; name: string } | null;
}

type EditingActivity = Partial<Activity> & { type: string; subject: string; status: string };

const TYPES = [
  { value: "call", label: "Llamada" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Reunión" },
  { value: "task", label: "Tarea" },
  { value: "note", label: "Nota" },
];

const STATUSES = [
  { value: "pending", label: "Pendiente", color: "border-amber-200 bg-amber-50 text-amber-900" },
  { value: "done", label: "Hecho", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { value: "cancelled", label: "Cancelado", color: "border-slate-200 bg-slate-100 text-slate-600" },
];

const emptyActivity: EditingActivity = { type: "task", subject: "", status: "pending" };

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 30;

  const [editing, setEditing] = useState<EditingActivity | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/activities?${params}`);
      if (!res.ok) throw new Error("Error al cargar actividades");
      const json = await res.json();
      setActivities(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { void fetchActivities(); }, [fetchActivities]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  async function save() {
    if (!editing || !editing.subject.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/activities" : `/api/admin/activities/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void fetchActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function markDone(a: Activity) {
    try {
      await fetch(`/api/admin/activities/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      void fetchActivities();
    } catch {
      setError("Error al completar la actividad");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/activities/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void fetchActivities();
    } catch {
      setError("Error al eliminar la actividad");
    }
  }

  const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];

  if (editing) {
    return (
      <div className="mx-auto max-w-[760px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><X className="size-4" />Volver</button>
            <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{editing.id ? "Editar actividad" : "Nueva actividad"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          </div>
        </div>

        <Panel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Tipo" htmlFor="act-type">
              <select id="act-type" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Estado" htmlFor="act-status">
              <select id="act-status" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </AdminField>
            <div className="sm:col-span-2">
              <AdminField label="Asunto *" htmlFor="act-subject">
                <AdminInput id="act-subject" value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} placeholder="Llamar a cliente…" />
              </AdminField>
            </div>
            <AdminField label="Fecha límite" htmlFor="act-due">
              <AdminInput id="act-due" type="datetime-local" value={editing.dueAt ? String(editing.dueAt).slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, dueAt: e.target.value || null })} />
            </AdminField>
          </div>
          <div className="mt-5">
            <AdminField label="Detalle" htmlFor="act-body">
              <AdminTextarea id="act-body" value={editing.body || ""} onChange={(e) => setEditing({ ...editing, body: e.target.value || null })} rows={5} />
            </AdminField>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Actividades</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Tareas, llamadas, emails y reuniones. Lo que mueve el pipeline.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyActivity })}><Plus />Nueva actividad</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex gap-1 rounded-lg bg-slate-100 p-1 max-w-fit">
        {[{ value: "", label: "Todas" }, ...STATUSES].map((s) => (
          <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors ${statusFilter === s.value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{s.label}</button>
        ))}
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : activities.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <CalendarCheck className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">Sin actividades.</p>
          </div>
        ) : (
          <div>
            {activities.map((a) => (
              <div key={a.id} className="grid grid-cols-[24px_1.4fr_.6fr_.6fr_.7fr_.3fr] items-center gap-3 border-b border-slate-200 px-5 py-3.5 last:border-0 sm:px-6">
                <CalendarCheck className={`size-4 ${a.status === "done" ? "text-emerald-600" : a.status === "cancelled" ? "text-slate-400" : "text-amber-600"}`} />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold text-slate-950">{a.subject}</p>
                  <p className="mt-0.5 text-[12px] text-slate-600">
                    {TYPES.find((t) => t.value === a.type)?.label || a.type}
                    {a.account ? ` · ${a.account.name}` : a.opportunity ? ` · ${a.opportunity.title}` : ""}
                  </p>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(a.status).color}`}>{statusMeta(a.status).label}</span>
                <span className="text-[12px] text-slate-600">{a.dueAt ? new Date(a.dueAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                <span className="truncate text-[12px] text-slate-600">{a.assignedTo?.name || "—"}</span>
                <div className="flex gap-1">
                  {a.status === "pending" && (
                    <AdminButton variant="ghost" size="icon" onClick={() => void markDone(a)} aria-label="Marcar como hecho"><Check className="size-4 text-emerald-600" /></AdminButton>
                  )}
                  <AdminButton variant="ghost" size="icon" onClick={() => setEditing({ ...a })} aria-label="Editar"><Pencil className="size-4" /></AdminButton>
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(a)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Eliminar actividad"
        description={`¿Eliminar "${deleteTarget?.subject}"?`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
