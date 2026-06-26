"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Plus, Save, Trash2 } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  ConfirmDialog,
} from "../../../../../components/admin/AdminUI";

interface PriceListDetail {
  id: string;
  name: string;
  currency: string;
  isDefault: boolean;
  active: boolean;
  items: Array<{
    id: string;
    productId: string;
    unitPrice: string;
    product: { id: string; name: string; sku: string | null; unit: string; active: boolean };
  }>;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
}

export default function PriceListDetailPage() {
  const params = useParams<{ id: string }>();
  const [list, setList] = useState<PriceListDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [removeTarget, setRemoveTarget] = useState<PriceListDetail["items"][number] | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/price-lists/${params.id}`);
      const json = await res.json();
      setList(json.data);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    fetch("/api/admin/products?limit=100&active=1")
      .then((r) => r.json())
      .then((j) => setProducts(j.data || []))
      .catch(() => {});
  }, []);

  async function addItem() {
    if (!newProductId || !newPrice) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/admin/price-lists/${params.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: newProductId, unitPrice: Number(newPrice) }),
      });
      if (!res.ok) throw new Error("Error al agregar");
      setNewProductId("");
      setNewPrice("");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar");
    } finally {
      setAdding(false);
    }
  }

  async function updatePrice(productId: string, price: number) {
    try {
      await fetch(`/api/admin/price-lists/${params.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, unitPrice: price }),
      });
      void load();
    } catch {
      setError("Error al actualizar precio");
    }
  }

  async function confirmRemove() {
    if (!removeTarget) return;
    try {
      await fetch(`/api/admin/price-lists/${params.id}/items/${removeTarget.id}`, { method: "DELETE" });
      setRemoveTarget(null);
      void load();
    } catch {
      setError("Error al quitar producto");
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!list) return <p className="py-20 text-center text-slate-600">Lista no encontrada.</p>;

  const availableProducts = products.filter((p) => !list.items.some((i) => i.productId === p.id));

  return (
    <div className="mx-auto max-w-[1000px]">
      <Link href="/admin/price-lists" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a listas
      </Link>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{list.name}</h1>
          <p className="mt-1 text-[13px] text-slate-600">Moneda {list.currency} · {list.items.length} productos {list.isDefault && "· Por defecto"}</p>
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-5 sm:p-6">
        <h2 className="font-display text-[15px] font-bold text-slate-950">Agregar producto</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1.6fr_.6fr_auto]">
          <AdminField label="Producto" htmlFor="add-product">
            <select id="add-product" value={newProductId} onChange={(e) => setNewProductId(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">— Seleccionar —</option>
              {availableProducts.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} · ` : ""}{p.name}</option>)}
            </select>
          </AdminField>
          <AdminField label={`Precio (${list.currency})`} htmlFor="add-price">
            <AdminInput id="add-price" type="number" step="0.01" min="0" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0.00" />
          </AdminField>
          <div className="flex items-end">
            <AdminButton onClick={() => void addItem()} disabled={adding || !newProductId || !newPrice}><Plus />Agregar</AdminButton>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 overflow-hidden">
        {list.items.length === 0 ? (
          <p className="px-5 py-12 text-center text-[13px] text-slate-600">Lista vacía. Agregá productos arriba.</p>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.6fr_.5fr_.6fr_.3fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Producto</span><span>SKU</span><span>Precio ({list.currency})</span><span>Acciones</span>
            </div>
            {list.items.map((item) => (
              <PriceRow key={item.id} item={item} onSave={(p) => void updatePrice(item.productId, p)} onRemove={() => setRemoveTarget(item)} />
            ))}
          </div>
        )}
      </AdminPanel>

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}
        title="Quitar producto"
        description={`¿Quitar "${removeTarget?.product.name}" de la lista?`}
        onConfirm={() => void confirmRemove()}
      />
    </div>
  );
}

function PriceRow({ item, onSave, onRemove }: { item: PriceListDetail["items"][number]; onSave: (price: number) => void; onRemove: () => void }) {
  const [value, setValue] = useState(String(item.unitPrice));
  const [dirty, setDirty] = useState(false);

  return (
    <div className="grid gap-2 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6 lg:grid-cols-[1.6fr_.5fr_.6fr_.3fr] lg:items-center lg:gap-3">
      <p className="truncate text-[13px] font-bold text-slate-950">{item.product.name}</p>
      <p className="truncate text-[12.5px] text-slate-600">{item.product.sku || "—"}</p>
      <div className="flex gap-2">
        <input type="number" step="0.01" min="0" value={value}
          onChange={(e) => { setValue(e.target.value); setDirty(true); }}
          className="h-9 w-32 rounded-lg border border-slate-300 bg-white px-2.5 text-[13px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
        {dirty && <AdminButton size="sm" onClick={() => { onSave(Number(value)); setDirty(false); }}><Save />Guardar</AdminButton>}
      </div>
      <div>
        <AdminButton variant="ghost" size="icon" onClick={onRemove} aria-label="Quitar"><Trash2 className="size-4 text-red-600" /></AdminButton>
      </div>
    </div>
  );
}
