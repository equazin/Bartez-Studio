"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Truck } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface DeliveryNote {
  id: string;
  number: string;
  pointOfSale: number;
  status: string;
  issueDate: string;
  receiverName: string;
  account: { id: string; name: string } | null;
  order: { id: string; number: string } | null;
  _count: { lines: number };
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  issued: { label: "Emitido", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  cancelled: { label: "Anulado", color: "border-red-200 bg-red-50 text-red-900" },
};

export default function DeliveryNotesPage() {
  const [items, setItems] = useState<DeliveryNote[]>([]);
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
      const res = await fetch(`/api/admin/delivery-notes?${params}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar los remitos");
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
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Remitos</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Comprobantes de entrega vinculados a pedidos y cuentas.</p>
        </div>
        <AdminButton asChild><Link href="/admin/delivery-notes/new"><Plus />Nuevo remito</Link></AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por numero o receptor..." /></div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Truck className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay remitos emitidos.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.8fr_1.2fr_.9fr_.7fr_.6fr_.3fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Numero</span><span>Receptor</span><span>Cuenta/Pedido</span><span>Estado</span><span>Fecha</span><span></span>
            </div>
            {items.map((item) => {
              const status = STATUS_META[item.status] || STATUS_META.issued;
              return (
                <div key={item.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.8fr_1.2fr_.9fr_.7fr_.6fr_.3fr] lg:items-center lg:gap-3">
                  <Link href={`/admin/delivery-notes/${item.id}`} className="font-mono text-[12.5px] font-bold text-brand hover:underline">{item.number}</Link>
                  <p className="truncate text-[13px] text-slate-700">{item.receiverName}</p>
                  <p className="truncate text-[12.5px] text-slate-600">{item.account?.name || item.order?.number || "-"}</p>
                  <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
                  <p className="text-[12px] text-slate-600">{new Date(item.issueDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
                  <div className="flex justify-end">
                    <AdminButton variant="ghost" size="icon" asChild aria-label="Ver"><Link href={`/admin/delivery-notes/${item.id}`}><Eye className="size-4" /></Link></AdminButton>
                  </div>
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
