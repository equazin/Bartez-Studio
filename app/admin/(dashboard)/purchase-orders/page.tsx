"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, FileSpreadsheet, Plus, Save, ShieldAlert } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPagination, AdminPanel, AdminSearch, AdminSpinner, useDebouncedValue } from "../../../../components/admin/AdminUI";

interface PurchaseOrder {
  id: string;
  number: string;
  status: string;
  approvalStatus?: string;
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

  const [threshold, setThreshold] = useState("");
  const [savedThreshold, setSavedThreshold] = useState<number | null>(null);
  const [savingThreshold, setSavingThreshold] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((j) => {
      if (j.ok) { setSavedThreshold(j.data.purchaseApprovalThreshold); setThreshold(String(j.data.purchaseApprovalThreshold || "")); }
    }).catch(() => {});
  }, []);

  async function saveThreshold() {
    setSavingThreshold(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseApprovalThreshold: Number(threshold) || 0 }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos guardar la configuración");
      setSavedThreshold(json.data.purchaseApprovalThreshold);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingThreshold(false);
    }
  }

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

      <AdminPanel className="mt-6 p-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-[18px] text-amber-600" />
          <h2 className="font-display text-[16px] font-bold text-slate-950">Aprobación de compras</h2>
        </div>
        <p className="mt-1.5 text-[12.5px] text-slate-600">
          Las OC cuyo total iguale o supere este monto (ARS) requieren aprobación antes de poder recibirse. Poné 0 para desactivar.
          {savedThreshold != null && savedThreshold > 0 && <span className="ml-1 font-bold text-slate-800">Actual: ARS {savedThreshold.toLocaleString("es-AR")}.</span>}
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <AdminField label="Umbral (ARS)" htmlFor="threshold">
            <AdminInput id="threshold" type="number" min="0" step="1000" placeholder="0" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          </AdminField>
          <AdminButton onClick={() => void saveThreshold()} disabled={savingThreshold}><Save />{savingThreshold ? "..." : "Guardar"}</AdminButton>
        </div>
      </AdminPanel>

      <div className="mt-6"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por numero o proveedor..." /></div>
      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? <div className="grid min-h-48 place-items-center"><AdminSpinner /></div> : items.length === 0 ? (
          <div className="px-5 py-14 text-center"><FileSpreadsheet className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-[14px] font-bold text-slate-950">No hay ordenes de compra.</p></div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.8fr_1.2fr_.7fr_.7fr_.5fr_.3fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Numero</span><span>Proveedor</span><span>Estado</span><span>Total</span><span>Fecha</span><span></span>
            </div>
            {items.map((item) => {
              const status = STATUS_META[item.status] || STATUS_META.issued;
              return (
                <div key={item.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.8fr_1.2fr_.7fr_.7fr_.5fr_.3fr] lg:items-center lg:gap-3">
                  <Link href={`/admin/purchase-orders/${item.id}`} className="font-mono text-[12.5px] font-bold text-brand hover:underline">{item.number}</Link>
                  <p className="truncate text-[13px] font-bold text-slate-950">{item.supplier.name}</p>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
                    {item.approvalStatus === "pending" && <span className="inline-flex w-fit items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800"><ShieldAlert className="size-3" />Aprobar</span>}
                    {item.approvalStatus === "rejected" && <span className="inline-flex w-fit rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">Rechazada</span>}
                  </span>
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
