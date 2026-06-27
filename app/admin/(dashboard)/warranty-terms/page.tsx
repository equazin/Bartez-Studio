"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ShieldCheck, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
} from "../../../../components/admin/AdminUI";

interface Term {
  id: string;
  productId: string;
  durationDays: number;
  coverage: string | null;
  exclusions: string | null;
  active: boolean;
  product: { id: string; name: string; sku: string | null };
}

interface Product { id: string; name: string; sku: string | null; }

interface CreateState { productId: string; durationDays: number; coverage: string; exclusions: string; }
const empty: CreateState = { productId: "", durationDays: 365, coverage: "", exclusions: "" };

export default function WarrantyTermsPage() {
  const [items, setItems] = useState<Term[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<CreateState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/warranty-terms?limit=100");
      const json = await res.json();
      setItems(json.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
  }, []);

  async function save() {
    if (!creating || !creating.productId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/warranty-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: creating.productId,
          durationDays: creating.durationDays,
          coverage: creating.coverage || null,
          exclusions: creating.exclusions || null,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setCreating(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Garantías</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Definí la duración por producto y la cobertura.</p>
        </div>
        <AdminButton onClick={() => setCreating({ ...empty })}><Plus />Nueva garantía</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <ShieldCheck className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay políticas de garantía.</p>
          </div>
        ) : (
          <div>
            {items.map((t) => (
              <div key={t.id} className="border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6">
                <p className="text-[13.5px] font-bold text-slate-950">{t.product.name}</p>
                <p className="text-[12px] text-slate-600">{t.product.sku ? `SKU ${t.product.sku} · ` : ""}{t.durationDays} días {!t.active && "(inactiva)"}</p>
                {t.coverage && <p className="mt-2 text-[12.5px] text-slate-700">{t.coverage}</p>}
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {creating && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[560px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[20px] font-bold text-slate-950">Nueva garantía</h2>
              <AdminButton variant="ghost" size="icon" onClick={() => setCreating(null)}><X /></AdminButton>
            </div>
            <div className="mt-5 grid gap-4">
              <AdminField label="Producto *" htmlFor="g-product">
                <select id="g-product" value={creating.productId} onChange={(e) => setCreating({ ...creating, productId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  <option value="">— Seleccionar —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} · ` : ""}{p.name}</option>)}
                </select>
              </AdminField>
              <AdminField label="Duración (días)" htmlFor="g-days">
                <AdminInput id="g-days" type="number" min={0} value={creating.durationDays} onChange={(e) => setCreating({ ...creating, durationDays: Number(e.target.value) })} />
              </AdminField>
              <AdminField label="Cobertura" htmlFor="g-cov">
                <AdminTextarea id="g-cov" value={creating.coverage} onChange={(e) => setCreating({ ...creating, coverage: e.target.value })} rows={3} />
              </AdminField>
              <AdminField label="Exclusiones" htmlFor="g-exc">
                <AdminTextarea id="g-exc" value={creating.exclusions} onChange={(e) => setCreating({ ...creating, exclusions: e.target.value })} rows={3} />
              </AdminField>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setCreating(null)}>Cancelar</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}
    </div>
  );
}
