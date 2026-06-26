"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
  AdminAlert,
  AdminPagination,
  AdminPanel,
  AdminSpinner,
} from "../../../../components/admin/AdminUI";

interface Receipt {
  id: string;
  number: string;
  receivedAt: string;
  method: string;
  reference: string | null;
  amount: string | number;
  currency: string;
  account: { id: string; name: string };
  _count: { allocations: number };
}

const METHOD_LABEL: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  mercadopago: "MercadoPago",
  other: "Otro",
};

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/receipts?page=${page}&limit=${limit}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar los recibos");
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
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Recibos</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Cobranzas registradas e imputadas a facturas.</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : receipts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <FileText className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay recibos registrados.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.75fr_1.2fr_.8fr_.7fr_.7fr_.5fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Numero</span><span>Cuenta</span><span>Metodo</span><span>Referencia</span><span>Total</span><span>Fecha</span>
            </div>
            {receipts.map((receipt) => (
              <div key={receipt.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.75fr_1.2fr_.8fr_.7fr_.7fr_.5fr] lg:items-center lg:gap-3">
                <p className="font-mono text-[12.5px] font-bold text-brand">{receipt.number}</p>
                <p className="truncate text-[13px] font-bold text-slate-950">{receipt.account.name}</p>
                <p className="text-[13px] text-slate-700">{METHOD_LABEL[receipt.method] || receipt.method}</p>
                <p className="truncate text-[12px] text-slate-600">{receipt.reference || "-"}</p>
                <p className="text-[13px] font-bold text-slate-950">{receipt.currency} {Number(receipt.amount).toLocaleString("es-AR")}</p>
                <p className="text-[12px] text-slate-600">{new Date(receipt.receivedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}
    </div>
  );
}
