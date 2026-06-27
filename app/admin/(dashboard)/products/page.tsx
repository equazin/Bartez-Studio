"use client";

import { useCallback, useEffect, useState } from "react";
import { Package, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
  AdminToggle,
  ConfirmDialog,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface Product {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  type: string;
  unit: string;
  brand: string | null;
  supplier: string | null;
  stockTracked: boolean;
  active: boolean;
  taxRate: string | number;
  createdAt: string;
}

type EditingProduct = Partial<Product> & { name: string; type: string; unit: string };

const TYPES = [
  { value: "good", label: "Producto" },
  { value: "service", label: "Servicio" },
];

const UNITS = [
  { value: "unit", label: "Unidad" },
  { value: "hour", label: "Hora" },
  { value: "month", label: "Mes" },
];

const emptyProduct: EditingProduct = { name: "", type: "good", unit: "unit", taxRate: 21, active: true, stockTracked: false };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const [editing, setEditing] = useState<EditingProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/products?${params}`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const json = await res.json();
      setProducts(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { void fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  async function save() {
    if (!editing || !editing.name.trim()) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      void fetchProducts();
    } catch {
      setError("Error al eliminar el producto");
    }
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><X className="size-4" />Volver</button>
            <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{editing.id ? "Editar producto" : "Nuevo producto"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          </div>
        </div>

        <AdminPanel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Nombre *" htmlFor="prod-name">
              <AdminInput id="prod-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </AdminField>
            <AdminField label="SKU / Código" htmlFor="prod-sku">
              <AdminInput id="prod-sku" value={editing.sku || ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value || null })} />
            </AdminField>
            <AdminField label="Tipo" htmlFor="prod-type">
              <select id="prod-type" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Unidad" htmlFor="prod-unit">
              <select id="prod-unit" value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Marca" htmlFor="prod-brand">
              <AdminInput id="prod-brand" value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value || null })} />
            </AdminField>
            <AdminField label="Proveedor" htmlFor="prod-supplier">
              <AdminInput id="prod-supplier" value={editing.supplier || ""} onChange={(e) => setEditing({ ...editing, supplier: e.target.value || null })} />
            </AdminField>
            <AdminField label="IVA por defecto %" htmlFor="prod-tax">
              <AdminInput id="prod-tax" type="number" min={0} max={100} value={String(editing.taxRate ?? 21)} onChange={(e) => setEditing({ ...editing, taxRate: Number(e.target.value) })} />
            </AdminField>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <AdminToggle id="prod-stock" label="Lleva stock" checked={!!editing.stockTracked} onCheckedChange={(v) => setEditing({ ...editing, stockTracked: v })} />
            <AdminToggle id="prod-active" label="Activo" checked={editing.active !== false} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
          </div>
          <div className="mt-5">
            <AdminField label="Descripción" htmlFor="prod-desc">
              <AdminTextarea id="prod-desc" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value || null })} rows={4} />
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
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Productos y servicios</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Catálogo central. Lo que se cotiza, factura y mueve el stock.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...emptyProduct })}><Plus />Nuevo producto</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6">
        <AdminSearch value={search} onChange={setSearch} placeholder="Buscar por nombre, SKU, marca…" />
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : products.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Package className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay productos cargados.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.5fr_1.4fr_.7fr_.5fr_.4fr_.4fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>SKU</span><span>Nombre</span><span>Marca</span><span>Tipo</span><span>IVA</span><span>Acciones</span>
            </div>
            {products.map((p) => (
              <div key={p.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.5fr_1.4fr_.7fr_.5fr_.4fr_.4fr] lg:items-center lg:gap-3">
                <p className="truncate text-[12.5px] text-slate-600">{p.sku || "—"}</p>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold text-slate-950">{p.name}</p>
                  {!p.active && <span className="text-[11px] font-bold text-slate-500">Inactivo</span>}
                </div>
                <p className="truncate text-[13px] text-slate-700">{p.brand || "—"}</p>
                <p className="text-[12.5px] text-slate-700">{TYPES.find((t) => t.value === p.type)?.label}</p>
                <p className="text-[12.5px] text-slate-700">{Number(p.taxRate)}%</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" onClick={() => setEditing({ ...p })} aria-label="Editar"><Pencil className="size-4" /></AdminButton>
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(p)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
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
        title="Eliminar producto"
        description={`¿Eliminar "${deleteTarget?.name}"?`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
