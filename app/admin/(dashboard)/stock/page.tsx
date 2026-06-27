"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Boxes, Save } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface StockRow {
  id: string;
  quantity: string;
  reserved: string;
  reorderPoint: string | null;
  product: { id: string; sku: string | null; name: string; unit: string };
  warehouse: { id: string; code: string; name: string };
}

interface Warehouse { id: string; code: string; name: string; }

export default function StockPage() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 30;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (warehouseFilter) params.set("warehouseId", warehouseFilter);
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (lowOnly) params.set("lowStock", "1");
      const res = await fetch(`/api/admin/stock?${params}`);
      if (!res.ok) throw new Error("Error al cargar stock");
      const json = await res.json();
      setRows(json.data || []);
      setTotal(json.meta?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, warehouseFilter, debouncedSearch, lowOnly]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [warehouseFilter, debouncedSearch, lowOnly]);

  useEffect(() => {
    fetch("/api/admin/warehouses").then((r) => r.json()).then((j) => setWarehouses(j.data || [])).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Stock</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Existencias por depósito. Reservado = comprometido por pedidos confirmados.</p>
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por producto o SKU…" /></div>
        <select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todos los depósitos</option>
          {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code} · {w.name}</option>)}
        </select>
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-bold text-slate-700">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
          Solo bajo stock
        </label>
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Boxes className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">Sin existencias.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.4fr_.7fr_.5fr_.5fr_.5fr_.7fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Producto</span><span>Depósito</span><span>Stock</span><span>Reservado</span><span>Disponible</span><span>Reposición</span>
            </div>
            {rows.map((r) => <StockRow key={r.id} row={r} onSaved={load} />)}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}
    </div>
  );
}

function StockRow({ row, onSaved }: { row: StockRow; onSaved: () => void }) {
  const qty = Number(row.quantity);
  const reserved = Number(row.reserved);
  const available = Math.max(0, qty - reserved);
  const reorderPoint = row.reorderPoint != null ? Number(row.reorderPoint) : null;
  const isLow = reorderPoint != null && qty <= reorderPoint;
  const [value, setValue] = useState(reorderPoint != null ? String(reorderPoint) : "");
  const [dirty, setDirty] = useState(false);

  async function save() {
    try {
      await fetch(`/api/admin/stock/${row.id}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorderPoint: Number(value) || 0 }),
      });
      setDirty(false);
      onSaved();
    } catch {
      // silent
    }
  }

  return (
    <div className="grid gap-2 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6 lg:grid-cols-[1.4fr_.7fr_.5fr_.5fr_.5fr_.7fr] lg:items-center lg:gap-3">
      <div className="min-w-0">
        <p className="truncate text-[13.5px] font-bold text-slate-950">{row.product.name}</p>
        {row.product.sku && <p className="text-[12px] text-slate-600">SKU {row.product.sku}</p>}
      </div>
      <p className="truncate text-[12.5px] text-slate-700">{row.warehouse.code}</p>
      <p className="text-[13px] font-bold text-slate-950">{qty.toLocaleString()}</p>
      <p className="text-[13px] text-slate-700">{reserved.toLocaleString()}</p>
      <p className="text-[13px] font-bold text-slate-950">
        {available.toLocaleString()}
        {isLow && <AlertTriangle className="ml-1 inline size-3.5 text-amber-600" />}
      </p>
      <div className="flex gap-2">
        <input type="number" step="0.01" min="0" value={value}
          onChange={(e) => { setValue(e.target.value); setDirty(true); }}
          placeholder="—"
          className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2 text-right text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
        {dirty && <AdminButton size="sm" onClick={() => void save()}><Save />Guardar</AdminButton>}
      </div>
    </div>
  );
}
