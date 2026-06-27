"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Mail, Pencil, Phone, Plus, Save, Trash2, X } from "lucide-react";
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
  taxId: string | null;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { contacts: number; opportunities: number };
}

type EditingAccount = Partial<Account> & { id?: string; name: string };

const emptyAccount: EditingAccount = { name: "" };

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const [editing, setEditing] = useState<EditingAccount | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/accounts?${params}`);
      if (!res.ok) throw new Error("Error al cargar cuentas");
      const json = await res.json();
      setAccounts(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { void fetchAccounts(); }, [fetchAccounts]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  async function save() {
    if (!editing || !editing.name.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/accounts" : `/api/admin/accounts/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/accounts/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void fetchAccounts();
    } catch {
      setError("Error al eliminar la cuenta");
    }
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><X className="size-4" />Volver</button>
            <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{editing.id ? "Editar cuenta" : "Nueva cuenta"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          </div>
        </div>

        <AdminPanel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Razón social *" htmlFor="acc-name">
              <AdminInput id="acc-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Empresa SA" />
            </AdminField>
            <AdminField label="CUIT" htmlFor="acc-taxid">
              <AdminInput id="acc-taxid" value={editing.taxId || ""} onChange={(e) => setEditing({ ...editing, taxId: e.target.value || null })} placeholder="30-12345678-9" />
            </AdminField>
            <AdminField label="Industria" htmlFor="acc-industry">
              <AdminInput id="acc-industry" value={editing.industry || ""} onChange={(e) => setEditing({ ...editing, industry: e.target.value || null })} placeholder="Gastronomía, retail…" />
            </AdminField>
            <AdminField label="Sitio web" htmlFor="acc-website">
              <AdminInput id="acc-website" value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value || null })} placeholder="https://" />
            </AdminField>
            <AdminField label="Email" htmlFor="acc-email">
              <AdminInput id="acc-email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value || null })} placeholder="contacto@empresa.com" />
            </AdminField>
            <AdminField label="Teléfono" htmlFor="acc-phone">
              <AdminInput id="acc-phone" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value || null })} placeholder="+54 11 ..." />
            </AdminField>
            <AdminField label="Ciudad" htmlFor="acc-city">
              <AdminInput id="acc-city" value={editing.city || ""} onChange={(e) => setEditing({ ...editing, city: e.target.value || null })} placeholder="Rosario" />
            </AdminField>
          </div>
          <div className="mt-5">
            <AdminField label="Notas" htmlFor="acc-notes">
              <AdminTextarea id="acc-notes" value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value || null })} rows={4} />
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
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Cuentas</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Empresas con las que opera Bartez. Contactos, oportunidades y actividades cuelgan de cada cuenta.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyAccount })}><Plus />Nueva cuenta</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6">
        <AdminSearch value={search} onChange={setSearch} placeholder="Buscar por nombre, CUIT, email o ciudad…" />
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : accounts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Building2 className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay cuentas todavía.</p>
            <p className="mt-2 text-[12.5px] text-slate-600">Convertí un lead o creá una cuenta desde el botón superior.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.4fr_.7fr_.6fr_.5fr_.5fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Cuenta</span><span>Industria / Ciudad</span><span>Contacto</span><span>Contactos · Opp.</span><span>Acciones</span>
            </div>
            {accounts.map((acc) => (
              <div key={acc.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[1.4fr_.7fr_.6fr_.5fr_.5fr] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/accounts/${acc.id}`} className="truncate text-[13.5px] font-bold text-slate-950 hover:text-brand hover:underline">{acc.name}</Link>
                  {acc.taxId && <p className="mt-0.5 text-[12px] text-slate-600">CUIT {acc.taxId}</p>}
                </div>
                <p className="truncate text-[12.5px] text-slate-700">
                  {acc.industry || "—"}
                  {acc.city ? <span className="text-slate-500"> · {acc.city}</span> : null}
                </p>
                <div className="flex flex-wrap gap-3 text-[12px] text-slate-600">
                  {acc.email && <span className="inline-flex items-center gap-1"><Mail className="size-3" />{acc.email}</span>}
                  {acc.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3" />{acc.phone}</span>}
                  {!acc.email && !acc.phone && "—"}
                </div>
                <p className="text-[12.5px] font-medium text-slate-700">
                  {acc._count ? `${acc._count.contacts} / ${acc._count.opportunities}` : "—"}
                </p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" onClick={() => setEditing({ ...acc })} aria-label="Editar"><Pencil className="size-4" /></AdminButton>
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(acc)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
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
        title="Eliminar cuenta"
        description={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
