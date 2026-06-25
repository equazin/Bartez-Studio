"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, DollarSign, Mail, MessageSquare, Pencil, Phone, Plus, Save, Trash2, User, X } from "lucide-react";
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
  StatusBadge,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

type Lead = {
  id: number;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  value: number | null;
  notes: string | null;
  waId: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUSES = [
  { value: "nuevo", label: "Nuevo", color: "border-blue-300 bg-blue-50 text-blue-900" },
  { value: "contactado", label: "Contactado", color: "border-sky-300 bg-sky-50 text-sky-900" },
  { value: "cotizado", label: "Cotizado", color: "border-amber-300 bg-amber-50 text-amber-900" },
  { value: "negociacion", label: "Negociación", color: "border-purple-300 bg-purple-50 text-purple-900" },
  { value: "cerrado", label: "Cerrado", color: "border-green-300 bg-green-50 text-green-900" },
  { value: "perdido", label: "Perdido", color: "border-slate-300 bg-slate-50 text-slate-600" },
];

const SOURCES = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "web", label: "Web" },
  { value: "referido", label: "Referido" },
  { value: "manual", label: "Manual" },
  { value: "email", label: "Email" },
];

const emptyLead: Omit<Lead, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  company: null,
  email: null,
  phone: null,
  source: "manual",
  status: "nuevo",
  value: null,
  notes: null,
  waId: null,
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const [editing, setEditing] = useState<(typeof emptyLead & { id?: number }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) throw new Error("Error al cargar leads");
      const json = await res.json();
      setLeads(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter]);

  useEffect(() => { void fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  async function save() {
    if (!editing || !editing.name.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/leads" : `/api/admin/leads/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void fetchLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/leads/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void fetchLeads();
    } catch {
      setError("Error al eliminar el lead");
    }
  }

  const statusMeta = (s: string) => STATUSES.find((st) => st.value === s) || STATUSES[0];

  if (editing) {
    return (
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><X className="size-4" />Volver</button>
            <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{editing.id ? "Editar lead" : "Nuevo lead"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          </div>
        </div>

        <AdminPanel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Nombre *" htmlFor="lead-name">
              <AdminInput id="lead-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nombre del contacto" />
            </AdminField>
            <AdminField label="Empresa" htmlFor="lead-company">
              <AdminInput id="lead-company" value={editing.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value || null })} placeholder="Nombre de empresa" />
            </AdminField>
            <AdminField label="Email" htmlFor="lead-email">
              <AdminInput id="lead-email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value || null })} placeholder="email@empresa.com" />
            </AdminField>
            <AdminField label="Teléfono" htmlFor="lead-phone">
              <AdminInput id="lead-phone" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value || null })} placeholder="+54 11 ..." />
            </AdminField>
            <AdminField label="Origen" htmlFor="lead-source">
              <select
                id="lead-source"
                value={editing.source}
                onChange={(e) => setEditing({ ...editing, source: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
              >
                {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Estado" htmlFor="lead-status">
              <select
                id="lead-status"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
              >
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Valor estimado (USD)" htmlFor="lead-value">
              <AdminInput id="lead-value" value={editing.value ? String(editing.value) : ""} onChange={(e) => setEditing({ ...editing, value: e.target.value ? Number(e.target.value) : null })} placeholder="0.00" />
            </AdminField>
            <AdminField label="WhatsApp ID" htmlFor="lead-waid">
              <AdminInput id="lead-waid" value={editing.waId || ""} onChange={(e) => setEditing({ ...editing, waId: e.target.value || null })} placeholder="5491112345678" />
            </AdminField>
          </div>
          <div className="mt-5">
            <AdminField label="Notas" htmlFor="lead-notes">
              <AdminTextarea id="lead-notes" value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value || null })} placeholder="Notas internas sobre el lead..." rows={4} />
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
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">CRM — Leads</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Pipeline comercial de Bartez. Gestioná tus oportunidades de negocio.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyLead })}><Plus />Nuevo lead</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por nombre, empresa, email o teléfono…" /></div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-green-600"
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Pipeline summary */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {STATUSES.map((s) => {
          const count = leads.filter((l) => l.status === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(statusFilter === s.value ? "" : s.value)}
              className={`rounded-lg border p-3 text-center transition-colors ${statusFilter === s.value ? s.color + " ring-2 ring-offset-1" : "border-slate-200 bg-white hover:bg-slate-50"}`}
            >
              <p className="text-[20px] font-bold leading-none">{count}</p>
              <p className="mt-1 text-[11px] font-bold">{s.label}</p>
            </button>
          );
        })}
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : leads.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <User className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay leads{statusFilter ? ` con estado "${statusMeta(statusFilter).label}"` : ""}.</p>
            <p className="mt-2 text-[12.5px] text-slate-600">Creá el primer lead desde el botón superior.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.2fr_.8fr_.6fr_.5fr_.4fr_.5fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Contacto</span><span>Empresa</span><span>Origen</span><span>Estado</span><span>Valor</span><span>Acciones</span>
            </div>
            {leads.map((lead) => (
              <div key={lead.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[1.2fr_.8fr_.6fr_.5fr_.4fr_.5fr] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold text-slate-950">{lead.name}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-[12px] text-slate-600">
                    {lead.email && <span className="inline-flex items-center gap-1"><Mail className="size-3" />{lead.email}</span>}
                    {lead.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3" />{lead.phone}</span>}
                  </div>
                </div>
                <p className="truncate text-[13px] text-slate-700">{lead.company || "—"}</p>
                <p className="text-[12.5px] font-medium text-slate-700">{SOURCES.find((s) => s.value === lead.source)?.label || lead.source}</p>
                <div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(lead.status).color}`}>
                    {statusMeta(lead.status).label}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-slate-700">{lead.value ? `$${lead.value.toLocaleString()}` : "—"}</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" onClick={() => setEditing({ ...lead })} aria-label="Editar"><Pencil className="size-4" /></AdminButton>
                  {lead.waId && (
                    <AdminButton variant="ghost" size="icon" asChild aria-label="WhatsApp">
                      <a href={`https://wa.me/${lead.waId}`} target="_blank" rel="noopener noreferrer"><MessageSquare className="size-4" /></a>
                    </AdminButton>
                  )}
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(lead)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
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
        title="Eliminar lead"
        description={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
