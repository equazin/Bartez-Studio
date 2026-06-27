"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  ConfirmDialog,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface Order {
  id: string;
  number: string;
  status: string;
  currency: string;
  total: string | number;
  orderDate: string;
  expectedDate: string | null;
  account: { id: string; name: string } | null;
  owner: { id: string; name: string } | null;
  _count: { lines: number };
}

const STATUSES = [
  { value: "draft", label: "Borrador", color: "border-slate-200 bg-slate-50 text-slate-700" },
  { value: "confirmed", label: "Confirmado", color: "border-blue-200 bg-blue-50 text-blue-900" },
  { value: "in_preparation", label: "En preparación", color: "border-amber-200 bg-amber-50 text-amber-900" },
  { value: "delivered", label: "Entregado", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { value: "cancelled", label: "Cancelado", color: "border-red-200 bg-red-50 text-red-900" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Error al cargar pedidos");
      const json = await res.json();
      setOrders(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/orders/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      }
      setDeleteTarget(null);
      void load();
    } catch {
      setError("Error al eliminar el pedido");
    }
  }

  const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];
  const stageCount = (s: string) => orders.filter((o) => o.status === s).length;

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Pedidos</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Órdenes de venta confirmadas, en preparación y entregadas.</p>
        </div>
        <AdminButton asChild><Link href="/admin/orders/new"><Plus />Nuevo pedido</Link></AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por número o cuenta…" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Resumen por etapa */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(statusFilter === s.value ? "" : s.value)}
            className={`rounded-lg border p-3 text-center transition-colors ${statusFilter === s.value ? s.color + " ring-2 ring-offset-1" : "border-slate-200 bg-white hover:bg-slate-50"}`}
          >
            <p className="text-[20px] font-bold leading-none">{stageCount(s.value)}</p>
            <p className="mt-1 text-[11px] font-bold">{s.label}</p>
          </button>
        ))}
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : orders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <ShoppingCart className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay pedidos{statusFilter ? ` en "${statusMeta(statusFilter).label}"` : ""}.</p>
            <p className="mt-2 text-[12.5px] text-slate-600">Creá el primero desde el botón superior o desde un presupuesto aceptado.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.7fr_1.4fr_.7fr_.5fr_.5fr_.5fr_.4fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>N°</span><span>Cuenta</span><span>Estado</span><span>Total</span><span>Fecha</span><span>Esperado</span><span>Acciones</span>
            </div>
            {orders.map((o) => (
              <div key={o.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.7fr_1.4fr_.7fr_.5fr_.5fr_.5fr_.4fr] lg:items-center lg:gap-3">
                <Link href={`/admin/orders/${o.id}`} className="truncate font-mono text-[12.5px] font-bold text-brand hover:underline">{o.number}</Link>
                <p className="truncate text-[13px] text-slate-700">{o.account?.name || "—"}</p>
                <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(o.status).color}`}>{statusMeta(o.status).label}</span>
                <p className="text-[13px] font-bold text-slate-950">{o.currency} {Number(o.total).toLocaleString()}</p>
                <p className="text-[12px] text-slate-600">{new Date(o.orderDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
                <p className="text-[12px] text-slate-600">{o.expectedDate ? new Date(o.expectedDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "—"}</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" asChild aria-label="Ver"><Link href={`/admin/orders/${o.id}`}><Eye className="size-4" /></Link></AdminButton>
                  {(o.status === "draft" || o.status === "cancelled") && (
                    <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(o)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
                  )}
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
        title="Eliminar pedido"
        description={`¿Eliminar ${deleteTarget?.number}? Solo se eliminan borradores o pedidos cancelados.`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
