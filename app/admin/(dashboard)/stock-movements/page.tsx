"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Plus, Save, Settings, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPagination,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
} from "../../../../components/admin/AdminUI";

interface Movement {
  id: string;
  type: string;
  quantity: string;
  reason: string | null;
  createdAt: string;
  product: { id: string; sku: string | null; name: string };
  warehouse: { id: string; code: string } | null;
  fromWarehouse: { id: string; code: string } | null;
  toWarehouse: { id: string; code: string } | null;
}

interface Product { id: string; sku: string | null; name: string; }
interface Warehouse { id: string; code: string; name: string; }

const TYPES = [
  { value: "in", label: "Ingreso" },
  { value: "out", label: "Egreso" },
  { value: "adjust", label: "Ajuste" },
  { value: "transfer", label: "Transferencia" },
];

const TYPE_META: Record<string, { label: string; color: string; icon: typeof ArrowDownLeft }> = {
  in: { label: "Ingreso", color: "text-emerald-700", icon: ArrowDownLeft },
  out: { label: "Egreso", color: "text-red-700", icon: ArrowUpRight },
  adjust: { label: "Ajuste", color: "text-amber-700", icon: Settings },
  transfer: { label: "Transferencia", color: "text-blue-700", icon: ArrowRightLeft },
  reserve: { label: "Reserva", color: "text-purple-700", icon: Settings },
  release: { label: "Liberación", color: "text-slate-700", icon: Settings },
};

interface FormState {
  type: string;
  productId: string;
  warehouseId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: string;
  reason: string;
}

const emptyForm: FormState = { type: "in", productId: "", warehouseId: "", fromWarehouseId: "", toWarehouseId: "", quantity: "", reason: "" };

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const limit = 30;

  const [creating, setCreating] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/admin/stock-movements?${params}`);
      const json = await res.json();
      setMovements(json.data || []);
      setTotal(json.meta?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    fetch("/api/admin/warehouses").then((r) => r.json()).then((j) => setWarehouses(j.data || [])).catch(() => {});
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
  }, []);

  async function save() {
    if (!creating || !creating.productId || !creating.quantity) return;
    setSaving(true);
    setError(null);
    const payload: Record<string, unknown> = {
      type: creating.type,
      productId: creating.productId,
      quantity: Number(creating.quantity),
      reason: creating.reason || null,
    };
    if (creating.type === "transfer") {
      payload.fromWarehouseId = creating.fromWarehouseId;
      payload.toWarehouseId = creating.toWarehouseId;
    } else {
      payload.warehouseId = creating.warehouseId;
    }
    try {
      const res = await fetch("/api/admin/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Error al registrar el movimiento");
      }
      setCreating(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Movimientos de stock</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Ingresos, egresos, transferencias y ajustes. Trazabilidad completa.</p>
        </div>
        <AdminButton onClick={() => setCreating({ ...emptyForm })}><Plus />Nuevo movimiento</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex gap-1 rounded-lg bg-slate-100 p-1 max-w-fit">
        {[{ value: "", label: "Todos" }, ...TYPES].map((s) => (
          <button key={s.value} onClick={() => setTypeFilter(s.value)} className={`rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors ${typeFilter === s.value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{s.label}</button>
        ))}
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : movements.length === 0 ? (
          <p className="px-5 py-14 text-center text-[13px] text-slate-600">Sin movimientos.</p>
        ) : (
          <div>
            {movements.map((m) => {
              const meta = TYPE_META[m.type] || TYPE_META.adjust;
              const Icon = meta.icon;
              return (
                <div key={m.id} className="grid grid-cols-[24px_1.4fr_.5fr_.5fr_.6fr_.5fr] items-center gap-3 border-b border-slate-200 px-5 py-3.5 last:border-0 sm:px-6">
                  <Icon className={`size-4 ${meta.color}`} />
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-slate-950">{m.product.name}</p>
                    <p className="text-[11.5px] text-slate-500">{m.reason || "—"}</p>
                  </div>
                  <span className={`text-[12px] font-bold ${meta.color}`}>{meta.label}</span>
                  <span className="text-[13px] font-bold text-slate-950">{Number(m.quantity).toLocaleString()}</span>
                  <span className="text-[12px] text-slate-700">
                    {m.type === "transfer" ? `${m.fromWarehouse?.code} → ${m.toWarehouse?.code}` : m.warehouse?.code || "—"}
                  </span>
                  <span className="text-[11.5px] text-slate-600">{new Date(m.createdAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              );
            })}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}

      {creating && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[560px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[20px] font-bold text-slate-950">Nuevo movimiento</h2>
              <AdminButton variant="ghost" size="icon" onClick={() => setCreating(null)}><X /></AdminButton>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <AdminField label="Tipo" htmlFor="m-type">
                <select id="m-type" value={creating.type} onChange={(e) => setCreating({ ...creating, type: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </AdminField>
              <AdminField label="Producto *" htmlFor="m-prod">
                <select id="m-prod" value={creating.productId} onChange={(e) => setCreating({ ...creating, productId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  <option value="">— Seleccionar —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} · ` : ""}{p.name}</option>)}
                </select>
              </AdminField>

              {creating.type !== "transfer" ? (
                <AdminField label="Depósito *" htmlFor="m-wh">
                  <select id="m-wh" value={creating.warehouseId} onChange={(e) => setCreating({ ...creating, warehouseId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                    <option value="">— Seleccionar —</option>
                    {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code} · {w.name}</option>)}
                  </select>
                </AdminField>
              ) : (
                <>
                  <AdminField label="Desde *" htmlFor="m-from">
                    <select id="m-from" value={creating.fromWarehouseId} onChange={(e) => setCreating({ ...creating, fromWarehouseId: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                      <option value="">— Seleccionar —</option>
                      {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code}</option>)}
                    </select>
                  </AdminField>
                  <AdminField label="Hasta *" htmlFor="m-to">
                    <select id="m-to" value={creating.toWarehouseId} onChange={(e) => setCreating({ ...creating, toWarehouseId: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                      <option value="">— Seleccionar —</option>
                      {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code}</option>)}
                    </select>
                  </AdminField>
                </>
              )}

              <AdminField label={creating.type === "adjust" ? "Cantidad final *" : "Cantidad *"} htmlFor="m-qty">
                <AdminInput id="m-qty" type="number" step="0.01" min="0" value={creating.quantity} onChange={(e) => setCreating({ ...creating, quantity: e.target.value })} />
              </AdminField>
            </div>

            <div className="mt-4">
              <AdminField label="Motivo (opcional)" htmlFor="m-reason">
                <AdminTextarea id="m-reason" value={creating.reason} onChange={(e) => setCreating({ ...creating, reason: e.target.value })} rows={2} />
              </AdminField>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setCreating(null)}><X />Cancelar</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Registrando…" : "Registrar"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}
    </div>
  );
}
