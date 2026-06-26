"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, Warehouse, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
  AdminToggle,
  ConfirmDialog,
} from "../../../../components/admin/AdminUI";

interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string | null;
  isDefault: boolean;
  active: boolean;
  _count?: { stockItems: number };
}

type EditingWh = Partial<Warehouse> & { code: string; name: string };

const emptyWh: EditingWh = { code: "", name: "", isDefault: false, active: true };

export default function WarehousesPage() {
  const [items, setItems] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingWh | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/warehouses");
      const json = await res.json();
      setItems(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!editing || !editing.code.trim() || !editing.name.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/warehouses" : `/api/admin/warehouses/${editing.id}`, {
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
      await fetch(`/api/admin/warehouses/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void load();
    } catch {
      setError("Error al eliminar el depósito");
    }
  }

  return (
    <div className="mx-auto max-w-[960px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Depósitos</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Ubicaciones físicas donde llevás stock. Uno se usa por defecto en pedidos nuevos.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyWh })}><Plus />Nuevo depósito</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Warehouse className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay depósitos.</p>
          </div>
        ) : (
          <div>
            {items.map((w) => (
              <div key={w.id} className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6">
                <Warehouse className="size-4 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-950">{w.code} · {w.name}</p>
                  <p className="text-[11.5px] text-slate-600">
                    {w._count?.stockItems ?? 0} productos con stock
                    {w.isDefault && <span className="ml-2 inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">Por defecto</span>}
                    {!w.active && <span className="ml-2 text-slate-500">Inactivo</span>}
                  </p>
                </div>
                <AdminButton variant="ghost" size="icon" onClick={() => setEditing({ ...w })} aria-label="Editar"><Pencil className="size-4" /></AdminButton>
                <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(w)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {editing && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[480px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[20px] font-bold text-slate-950">{editing.id ? "Editar depósito" : "Nuevo depósito"}</h2>
              <AdminButton variant="ghost" size="icon" onClick={() => setEditing(null)}><X /></AdminButton>
            </div>
            <div className="mt-5 grid gap-4">
              <AdminField label="Código *" htmlFor="w-code">
                <AdminInput id="w-code" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="DEP01" />
              </AdminField>
              <AdminField label="Nombre *" htmlFor="w-name">
                <AdminInput id="w-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Depósito Rosario" />
              </AdminField>
              <AdminField label="Dirección" htmlFor="w-addr">
                <AdminTextarea id="w-addr" value={editing.address || ""} onChange={(e) => setEditing({ ...editing, address: e.target.value || null })} rows={2} />
              </AdminField>
              <AdminToggle id="w-default" label="Por defecto" checked={!!editing.isDefault} onCheckedChange={(v) => setEditing({ ...editing, isDefault: v })} />
              <AdminToggle id="w-active" label="Activo" checked={editing.active !== false} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
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
        title="Eliminar depósito"
        description={`¿Eliminar "${deleteTarget?.name}"? Se perderá el stock y los movimientos asociados.`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
