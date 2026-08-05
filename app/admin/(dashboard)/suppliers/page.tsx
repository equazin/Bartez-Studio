"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2, Truck, X } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSearch, AdminSpinner, useDebouncedValue } from "../../../../components/admin/AdminUI";

interface Supplier {
  id: string;
  name: string;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
}

const emptySupplier = { name: "", taxId: "", email: "", phone: "", address: "", city: "", paymentTerms: "", notes: "", active: true };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editing, setEditing] = useState<typeof emptySupplier | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/suppliers?${params}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar proveedores");
      setSuppliers(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!editing?.name.trim()) { setError("Falta el nombre del proveedor."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos guardar");
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/suppliers/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.ok) setError(json.error || "No pudimos eliminar");
    else await load();
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Proveedores</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Datos comerciales y fiscales para compras y pagos.</p>
        </div>
        <AdminButton onClick={() => setEditing(emptySupplier)}><Plus />Nuevo proveedor</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      {editing && (
        <AdminPanel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <AdminField label="Nombre" htmlFor="supplier-name"><AdminInput id="supplier-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></AdminField>
            <AdminField label="CUIT" htmlFor="supplier-tax"><AdminInput id="supplier-tax" value={editing.taxId} onChange={(e) => setEditing({ ...editing, taxId: e.target.value })} /></AdminField>
            <AdminField label="Email" htmlFor="supplier-email"><AdminInput id="supplier-email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></AdminField>
            <AdminField label="Teléfono" htmlFor="supplier-phone"><AdminInput id="supplier-phone" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></AdminField>
            <AdminField label="Direccion" htmlFor="supplier-address"><AdminInput id="supplier-address" value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></AdminField>
            <AdminField label="Condiciones" htmlFor="supplier-terms"><AdminInput id="supplier-terms" value={editing.paymentTerms} onChange={(e) => setEditing({ ...editing, paymentTerms: e.target.value })} /></AdminField>
          </div>
          <div className="mt-5 flex gap-2">
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando..." : "Guardar"}</AdminButton>
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
          </div>
        </AdminPanel>
      )}

      <div className="mt-6"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar proveedor..." /></div>
      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? <div className="grid min-h-48 place-items-center"><AdminSpinner /></div> : suppliers.length === 0 ? (
          <div className="px-5 py-14 text-center"><Truck className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-[14px] font-bold text-slate-950">No hay proveedores.</p></div>
        ) : suppliers.map((supplier) => (
          <div key={supplier.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:grid-cols-[1.2fr_.7fr_1fr_.7fr_.2fr] sm:items-center">
            <p className="text-[13.5px] font-bold text-slate-950">{supplier.name}</p>
            <p className="text-[12.5px] text-slate-700">{supplier.taxId || "-"}</p>
            <p className="truncate text-[12.5px] text-slate-700">{supplier.email || "-"}</p>
            <p className="text-[12.5px] text-slate-700">{supplier.phone || "-"}</p>
            <AdminButton variant="ghost" size="icon" onClick={() => void remove(supplier.id)} aria-label="Eliminar"><Trash2 /></AdminButton>
          </div>
        ))}
      </AdminPanel>
    </div>
  );
}
