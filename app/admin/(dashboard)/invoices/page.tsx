"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Receipt } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface Invoice {
  id: string;
  number: string;
  docTypeCode: number;
  pointOfSale: number;
  afipNumber: number | null;
  cae: string | null;
  status: string;
  currency: string;
  total: string | number;
  issueDate: string;
  receiverName: string;
  account: { id: string; name: string } | null;
  _count: { lines: number; allocations: number };
}

const STATUSES = [
  { value: "draft", label: "Borrador", color: "border-slate-200 bg-slate-50 text-slate-700" },
  { value: "issued", label: "Emitida", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { value: "cancelled", label: "Anulada", color: "border-red-200 bg-red-50 text-red-900" },
];

const DOC_LABEL: Record<number, string> = {
  1: "FCA", 2: "NDA", 3: "NCA",
  6: "FCB", 7: "NDB", 8: "NCB",
  11: "FCC", 12: "NDC", 13: "NCC",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/invoices?${params}`);
      if (!res.ok) throw new Error("Error al cargar facturas");
      const json = await res.json();
      setInvoices(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Facturas</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Comprobantes electrónicos con CAE de AFIP.</p>
        </div>
        <AdminButton asChild><Link href="/admin/invoices/new"><Plus />Emitir factura</Link></AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por número, receptor o CAE…" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : invoices.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Receipt className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay facturas{statusFilter ? ` en "${statusMeta(statusFilter).label}"` : ""}.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.6fr_.5fr_1.2fr_.6fr_.7fr_.5fr_.4fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Tipo / PV</span><span>Nº</span><span>Receptor</span><span>Estado</span><span>Total</span><span>Fecha</span><span></span>
            </div>
            {invoices.map((inv) => (
              <div key={inv.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.6fr_.5fr_1.2fr_.6fr_.7fr_.5fr_.4fr] lg:items-center lg:gap-3">
                <p className="font-mono text-[12.5px] font-bold text-slate-700">{DOC_LABEL[inv.docTypeCode] || `CBT${inv.docTypeCode}`}-{String(inv.pointOfSale).padStart(4, "0")}</p>
                <Link href={`/admin/invoices/${inv.id}`} className="truncate font-mono text-[12.5px] font-bold text-brand hover:underline">
                  {inv.afipNumber ? String(inv.afipNumber).padStart(8, "0") : inv.number}
                </Link>
                <p className="truncate text-[13px] text-slate-700">{inv.receiverName}</p>
                <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(inv.status).color}`}>{statusMeta(inv.status).label}</span>
                <p className="text-[13px] font-bold text-slate-950">{inv.currency} {Number(inv.total).toLocaleString()}</p>
                <p className="text-[12px] text-slate-600">{new Date(inv.issueDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" asChild aria-label="Ver"><Link href={`/admin/invoices/${inv.id}`}><Eye className="size-4" /></Link></AdminButton>
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
