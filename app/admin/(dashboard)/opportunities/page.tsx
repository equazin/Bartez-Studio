"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Save, Target, Trash2, X } from "lucide-react";
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
  ConfirmDialog,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface Account {
  id: string;
  name: string;
}

interface Opportunity {
  id: string;
  title: string;
  stage: string;
  amount: string | number | null;
  currency: string;
  probability: number;
  expectedClose: string | null;
  closedAt: string | null;
  notes: string | null;
  accountId: string | null;
  account: Account | null;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

type EditingOpp = Partial<Opportunity> & { title: string; stage: string };

const STAGES = [
  { value: "qualification", label: "Calificación", color: "border-blue-200 bg-blue-50 text-blue-900" },
  { value: "proposal", label: "Propuesta", color: "border-amber-200 bg-amber-50 text-amber-900" },
  { value: "negotiation", label: "Negociación", color: "border-purple-200 bg-purple-50 text-purple-900" },
  { value: "won", label: "Ganada", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { value: "lost", label: "Perdida", color: "border-slate-200 bg-slate-100 text-slate-600" },
];

const emptyOpp: EditingOpp = { title: "", stage: "qualification", currency: "USD", probability: 20 };

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const [editing, setEditing] = useState<EditingOpp | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);

  const fetchOpps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (stageFilter) params.set("stage", stageFilter);
      const res = await fetch(`/api/admin/opportunities?${params}`);
      if (!res.ok) throw new Error("Error al cargar oportunidades");
      const json = await res.json();
      setOpps(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, stageFilter]);

  useEffect(() => { void fetchOpps(); }, [fetchOpps]);
  useEffect(() => { setPage(1); }, [debouncedSearch, stageFilter]);

  // Cuentas para selector
  useEffect(() => {
    fetch("/api/admin/accounts?limit=100")
      .then((r) => r.json())
      .then((j) => setAccounts(j.data || []))
      .catch(() => {});
  }, []);

  async function save() {
    if (!editing || !editing.title.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/opportunities" : `/api/admin/opportunities/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void fetchOpps();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/opportunities/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void fetchOpps();
    } catch {
      setError("Error al eliminar la oportunidad");
    }
  }

  const stageMeta = (s: string) => STAGES.find((x) => x.value === s) || STAGES[0];
  const stageCount = (s: string) => opps.filter((o) => o.stage === s).length;

  if (editing) {
    return (
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><X className="size-4" />Volver</button>
            <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{editing.id ? "Editar oportunidad" : "Nueva oportunidad"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          </div>
        </div>

        <AdminPanel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Título *" htmlFor="opp-title">
              <AdminInput id="opp-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="BarPOS - 5 puestos" />
            </AdminField>
            <AdminField label="Cuenta" htmlFor="opp-account">
              <select id="opp-account" value={editing.accountId || ""} onChange={(e) => setEditing({ ...editing, accountId: e.target.value || null })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                <option value="">(Sin cuenta)</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </AdminField>
            <AdminField label="Etapa" htmlFor="opp-stage">
              <select id="opp-stage" value={editing.stage} onChange={(e) => setEditing({ ...editing, stage: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Probabilidad %" htmlFor="opp-prob">
              <AdminInput id="opp-prob" type="number" min={0} max={100} value={editing.probability ?? 20} onChange={(e) => setEditing({ ...editing, probability: Number(e.target.value) })} />
            </AdminField>
            <AdminField label="Importe" htmlFor="opp-amount">
              <AdminInput id="opp-amount" value={editing.amount ? String(editing.amount) : ""} onChange={(e) => setEditing({ ...editing, amount: e.target.value ? Number(e.target.value) : null })} placeholder="0.00" />
            </AdminField>
            <AdminField label="Moneda" htmlFor="opp-currency">
              <select id="opp-currency" value={editing.currency || "USD"} onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </AdminField>
            <AdminField label="Cierre estimado" htmlFor="opp-close">
              <AdminInput id="opp-close" type="date" value={editing.expectedClose ? String(editing.expectedClose).slice(0, 10) : ""} onChange={(e) => setEditing({ ...editing, expectedClose: e.target.value || null })} />
            </AdminField>
          </div>
          <div className="mt-5">
            <AdminField label="Notas" htmlFor="opp-notes">
              <AdminTextarea id="opp-notes" value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value || null })} rows={4} />
            </AdminField>
          </div>
        </AdminPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Oportunidades</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Pipeline ponderado por etapa y probabilidad de cierre.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyOpp })}><Plus />Nueva oportunidad</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6">
        <AdminSearch value={search} onChange={setSearch} placeholder="Buscar por título…" />
      </div>

      {/* Etapas */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STAGES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStageFilter(stageFilter === s.value ? "" : s.value)}
            className={`rounded-lg border p-3 text-center transition-colors ${stageFilter === s.value ? s.color + " ring-2 ring-offset-1" : "border-slate-200 bg-white hover:bg-slate-50"}`}
          >
            <p className="text-[20px] font-bold leading-none">{stageCount(s.value)}</p>
            <p className="mt-1 text-[11px] font-bold">{s.label}</p>
          </button>
        ))}
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : opps.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Target className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay oportunidades{stageFilter ? ` en "${stageMeta(stageFilter).label}"` : ""}.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.4fr_.8fr_.6fr_.5fr_.5fr_.4fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Título</span><span>Cuenta</span><span>Etapa</span><span>Importe</span><span>Cierre</span><span>Acciones</span>
            </div>
            {opps.map((o) => (
              <div key={o.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[1.4fr_.8fr_.6fr_.5fr_.5fr_.4fr] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold text-slate-950">{o.title}</p>
                  <p className="mt-0.5 text-[12px] text-slate-600">Prob. {o.probability}%</p>
                </div>
                <p className="truncate text-[13px] text-slate-700">{o.account?.name || "—"}</p>
                <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${stageMeta(o.stage).color}`}>{stageMeta(o.stage).label}</span>
                <p className="text-[13px] font-medium text-slate-700">{o.amount ? `${o.currency} ${Number(o.amount).toLocaleString()}` : "—"}</p>
                <p className="text-[12.5px] text-slate-600">{o.expectedClose ? new Date(o.expectedClose).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "—"}</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" onClick={() => setEditing({ ...o })} aria-label="Editar"><Pencil className="size-4" /></AdminButton>
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(o)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
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
        title="Eliminar oportunidad"
        description={`¿Eliminar "${deleteTarget?.title}"?`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
