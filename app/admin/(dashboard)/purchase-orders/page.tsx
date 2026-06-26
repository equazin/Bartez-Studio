"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, FileSpreadsheet, Plus } from "lucide-react";
import { AdminAlert, AdminButton, AdminPagination, AdminPanel, AdminSearch, AdminSpinner, useDebouncedValue } from "../../../../components/admin/AdminUI";

interface PurchaseOrder {
  id: string;
  number: string;
  status: string;
  currency: string;
  total: string | number;
  issueDate: string;
  supplier: { id: string; name: string };
  _count: { lines: number; receipts: number; allocations: number };
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  issued: { label: "Emitida", color: "border-sky-200 bg-sky-50 text-sky-900" },
  partially_received: { label: "Parcial", color: "border-amber-200 bg-amber-50 text-amber-900" },
  received: { label: "Recibida", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  cancelled: { label: "Anulada", color: "border-red-200 bg-red-50 text-red-900" },
};

export default function PurchaseOrdersPage() {
  const [items, setItems] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/purchase-orders?${params}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar ordenes de compra");
      setItems(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Ordenes de compra</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Compras a proveedores, recepciones y saldos pendientes.</p>
        </div>
        <AdminButton asChild><Link href="/admin/purchase-orders/new"><Plus />Nueva OC</Link></AdminButton>
      </div>
      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}
      <div className="mt-6"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por numero o proveedor..." /></div>
      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? <div className="grid min-h-48 place-items-center"><AdminSpinner /></div> : items.length === 0 ? (
          <div className="px-5 py-14 text-center"><FileSpreadsheet className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-[14px] font-bold text-slate-950">No hay ordenes de compra.</p></div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.8fr_1.2fr_.7fr_.7fr_.5fr_.3fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Numero</span><span>Proveedor</span><span>Estado</span><span>Total</span><span>Fecha</span><span></span>
            </div>
            {items.map((item) => {
              const status = STATUS_META[item.status] || STATUS_META.issued;
              return (
                <div key={item.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.8fr_1.2fr_.7fr_.7fr_.5fr_.3fr] lg:items-center lg:gap-3">
                  <Link href={`/admin/purchase-orders/${item.id}`} className="font-mono text-[12.5px] font-bold text-brand hover:underline">{item.number}</Link>
                  <p className="truncate text-[13px] font-bold text-slate-950">{item.supplier.name}</p>
                  <span className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
                  <p className="text-[13px] font-bold text-slate-950">{item.currency} {Number(item.total).toLocaleString("es-AR")}</p>
                  <p className="text-[12px] text-slate-600">{new Date(item.issueDate).toLocaleDateString("es-AR")}</p>
                  <AdminButton variant="ghost" size="icon" asChild aria-label="Ver"><Link href={`/admin/purchase-orders/${item.id}`}><Eye className="size-4" /></Link></AdminButton>
                </div>
              );
            })}
          </div>
        )}
      </AdminPanel>
      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}
    </div>
  );
}
