"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Save, Tag, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  AdminToggle,
  ConfirmDialog,
} from "../../../../components/admin/AdminUI";

interface PriceList {
  id: string;
  name: string;
  currency: string;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
  _count?: { items: number };
}

type EditingList = Partial<PriceList> & { name: string; currency: string };

const emptyList: EditingList = { name: "", currency: "USD", isDefault: false, active: true };

export default function PriceListsPage() {
  const [lists, setLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingList | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PriceList | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/price-lists");
      const json = await res.json();
      setLists(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!editing || !editing.name.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/price-lists" : `/api/admin/price-lists/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/price-lists/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void load();
    } catch {
      setError("Error al eliminar la lista");
    }
  }

  return (
    <div className="mx-auto max-w-[960px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Listas de precios</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Multi-moneda. Una se usa por defecto para nuevos presupuestos.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyList })}><Plus />Nueva lista</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : lists.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Tag className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay listas de precios.</p>
          </div>
        ) : (
          <div>
            {lists.map((l) => (
              <div key={l.id} className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6">
                <Tag className="size-4 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/price-lists/${l.id}`} className="text-[13.5px] font-bold text-slate-950 hover:text-brand hover:underline">{l.name}</Link>
                  <p className="text-[11.5px] text-slate-600">
                    {l.currency} · {l._count?.items ?? 0} productos
                    {l.isDefault && <span className="ml-2 inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">Por defecto</span>}
                    {!l.active && <span className="ml-2 text-slate-500">Inactiva</span>}
                  </p>
                </div>
                <AdminButton variant="secondary" onClick={() => setEditing({ ...l })}>Editar</AdminButton>
                <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(l)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {editing && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[480px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[20px] font-bold text-slate-950">{editing.id ? "Editar lista" : "Nueva lista"}</h2>
              <AdminButton variant="ghost" size="icon" onClick={() => setEditing(null)}><X /></AdminButton>
            </div>
            <div className="mt-5 grid gap-4">
              <AdminField label="Nombre *" htmlFor="pl-name">
                <AdminInput id="pl-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Lista mayorista USD" />
              </AdminField>
              <AdminField label="Moneda" htmlFor="pl-currency">
                <select id="pl-currency" value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                  <option value="EUR">EUR</option>
                </select>
              </AdminField>
              <AdminToggle id="pl-default" label="Lista por defecto" checked={!!editing.isDefault} onCheckedChange={(v) => setEditing({ ...editing, isDefault: v })} />
              <AdminToggle id="pl-active" label="Activa" checked={editing.active !== false} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Eliminar lista de precios"
        description={`¿Eliminar "${deleteTarget?.name}"? Se borrarán también sus precios cargados.`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
