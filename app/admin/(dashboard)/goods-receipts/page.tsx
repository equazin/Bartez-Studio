"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, PackageCheck } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPagination,
  AdminPanel,
  AdminSpinner,
} from "../../../../components/admin/AdminUI";

interface GoodsReceipt {
  id: string;
  number: string;
  receivedAt: string;
  status: string;
  supplier: { id: string; name: string } | null;
  purchaseOrder: { id: string; number: string } | null;
  warehouse: { id: string; name: string };
  _count: { lines: number };
}

export default function GoodsReceiptsPage() {
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/goods-receipts?page=${page}&limit=${limit}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar recepciones");
      setReceipts(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Recepciones de compra</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Ingresos de mercaderia asociados a ordenes de compra y deposito.</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? (
          <div className="grid min-h-48 place-items-center"><AdminSpinner /></div>
        ) : receipts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <PackageCheck className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay recepciones registradas.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.75fr_1fr_.75fr_.85fr_.45fr_.35fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Numero</span><span>Proveedor</span><span>OC</span><span>Deposito</span><span>Fecha</span><span></span>
            </div>
            {receipts.map((receipt) => (
              <div key={receipt.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.75fr_1fr_.75fr_.85fr_.45fr_.35fr] lg:items-center lg:gap-3">
                <p className="font-mono text-[12.5px] font-bold text-brand">{receipt.number}</p>
                <p className="truncate text-[13px] font-bold text-slate-950">{receipt.supplier?.name || "-"}</p>
                {receipt.purchaseOrder ? (
                  <Link href={`/admin/purchase-orders/${receipt.purchaseOrder.id}`} className="font-mono text-[12.5px] font-bold text-brand hover:underline">{receipt.purchaseOrder.number}</Link>
                ) : <p className="text-[12.5px] text-slate-600">-</p>}
                <p className="truncate text-[13px] text-slate-700">{receipt.warehouse.name}</p>
                <p className="text-[12px] text-slate-600">{new Date(receipt.receivedAt).toLocaleDateString("es-AR")}</p>
                <div className="flex justify-end">
                  {receipt.purchaseOrder && (
                    <AdminButton variant="ghost" size="icon" asChild aria-label="Ver orden de compra">
                      <Link href={`/admin/purchase-orders/${receipt.purchaseOrder.id}`}><Eye className="size-4" /></Link>
                    </AdminButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}
    </div>
  );
}
