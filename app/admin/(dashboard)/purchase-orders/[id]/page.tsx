"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ban, CheckCircle2, ChevronLeft, PackageCheck, ShieldAlert, XCircle } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSpinner, AdminTextarea, ConfirmDialog } from "../../../../../components/admin/AdminUI";

interface Line {
  id: string;
  description: string;
  quantity: string | number;
  received: string | number;
  unitPrice: string | number;
  lineTotal: string | number;
  product: { id: string; sku: string | null; name: string } | null;
}
interface PurchaseOrder {
  id: string;
  number: string;
  status: string;
  approvalStatus: string;
  approvalNote: string | null;
  approvedAt: string | null;
  currency: string;
  issueDate: string;
  total: string | number;
  supplier: { id: string; name: string; taxId: string | null };
  lines: Line[];
  receipts: Array<{ id: string; number: string; receivedAt: string; warehouse: { id: string; name: string }; lines: Array<{ id: string }> }>;
}
interface Warehouse { id: string; name: string; }

export default function PurchaseOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [po, setPo] = useState<PurchaseOrder | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [notes, setNotes] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [poRes, whRes] = await Promise.all([
        fetch(`/api/admin/purchase-orders/${params.id}`),
        fetch("/api/admin/warehouses?limit=100&active=1"),
      ]);
      const poJson = await poRes.json();
      const whJson = await whRes.json();
      if (!poRes.ok || !poJson.ok) throw new Error(poJson.error || "No pudimos cargar la OC");
      setPo(poJson.data);
      setWarehouses(whJson.data || []);
      setWarehouseId((whJson.data || [])[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  const receivableLines = useMemo(() => (po?.lines || []).filter((line) => Number(line.quantity) - Number(line.received) > 0.0001), [po]);

  useEffect(() => {
    if (!po) return;
    const next: Record<string, number> = {};
    for (const line of receivableLines) next[line.id] = Number(line.quantity) - Number(line.received);
    setQuantities(next);
  }, [po, receivableLines]);

  async function receive() {
    if (!warehouseId) { setError("Selecciona un deposito."); return; }
    setSaving(true);
    setError(null);
    try {
      const lines = Object.entries(quantities).filter(([, qty]) => Number(qty) > 0).map(([purchaseOrderLineId, quantity]) => ({ purchaseOrderLineId, quantity }));
      const res = await fetch(`/api/admin/purchase-orders/${params.id}/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseId, notes: notes || null, lines }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos recepcionar");
      setNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  async function cancel() {
    const res = await fetch(`/api/admin/purchase-orders/${params.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.ok) setError(json.error || "No pudimos anular");
    else await load();
  }

  async function decideApproval(decision: "approved" | "rejected") {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/purchase-orders/${params.id}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos procesar la aprobación");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!po) return <p className="py-20 text-center text-slate-600">OC no encontrada.</p>;

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/purchase-orders" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><ChevronLeft className="size-4" />Volver a compras</Link>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{po.number}</h1><p className="mt-1 text-[13px] text-slate-600">{po.supplier.name} - {new Date(po.issueDate).toLocaleDateString("es-AR")}</p></div>
        {po.status === "issued" && <AdminButton variant="secondary" onClick={() => setCancelOpen(true)}><Ban />Anular</AdminButton>}
      </div>
      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      {po.approvalStatus === "pending" && (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-[14px] font-bold text-amber-900">Pendiente de aprobación</p>
              <p className="mt-0.5 text-[13px] text-amber-800">Esta orden supera el monto que requiere aprobación. No se puede recibir hasta aprobarla.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <AdminButton size="sm" onClick={() => void decideApproval("approved")} disabled={saving}><CheckCircle2 />Aprobar</AdminButton>
                <AdminButton size="sm" variant="secondary" onClick={() => void decideApproval("rejected")} disabled={saving}><XCircle />Rechazar</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
      {po.approvalStatus === "approved" && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12.5px] font-bold text-emerald-800"><CheckCircle2 className="size-4" />Aprobada{po.approvedAt ? ` el ${new Date(po.approvedAt).toLocaleDateString("es-AR")}` : ""}</div>
      )}
      {po.approvalStatus === "rejected" && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[12.5px] font-bold text-red-700"><XCircle className="size-4" />Rechazada</div>
      )}

      <AdminPanel className="mt-6 overflow-hidden">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700"><tr><th className="px-4 py-2 text-left">Linea</th><th className="px-4 py-2 text-right">Pedida</th><th className="px-4 py-2 text-right">Recibida</th><th className="px-4 py-2 text-right">Costo</th><th className="px-4 py-2 text-right">Total</th></tr></thead>
          <tbody>{po.lines.map((line) => <tr key={line.id} className="border-t border-slate-200"><td className="px-4 py-3">{line.description}</td><td className="px-4 py-3 text-right">{Number(line.quantity).toLocaleString("es-AR")}</td><td className="px-4 py-3 text-right">{Number(line.received).toLocaleString("es-AR")}</td><td className="px-4 py-3 text-right">{Number(line.unitPrice).toLocaleString("es-AR")}</td><td className="px-4 py-3 text-right font-bold">{po.currency} {Number(line.lineTotal).toLocaleString("es-AR")}</td></tr>)}</tbody>
        </table>
        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 text-right font-display text-lg font-bold text-slate-950">Total {po.currency} {Number(po.total).toLocaleString("es-AR")}</div>
      </AdminPanel>

      {receivableLines.length > 0 && po.status !== "cancelled" && po.approvalStatus !== "pending" && po.approvalStatus !== "rejected" && (
        <AdminPanel className="mt-5 p-5">
          <h2 className="font-display text-[16px] font-bold text-slate-950">Recepcionar mercaderia</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField label="Deposito" htmlFor="receive-warehouse"><select id="receive-warehouse" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]"><option value="">Seleccionar</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></AdminField>
            <AdminField label="Notas" htmlFor="receive-notes"><AdminInput id="receive-notes" value={notes} onChange={(e) => setNotes(e.target.value)} /></AdminField>
          </div>
          <div className="mt-4 grid gap-3">
            {receivableLines.map((line) => {
              const pending = Number(line.quantity) - Number(line.received);
              return <div key={line.id} className="grid gap-2 sm:grid-cols-[1fr_120px] sm:items-center"><p className="text-[13px] font-bold text-slate-950">{line.description}<span className="ml-2 font-normal text-slate-500">Pendiente {pending.toLocaleString("es-AR")}</span></p><AdminInput type="number" step="0.01" max={pending} value={quantities[line.id] ?? 0} onChange={(e) => setQuantities({ ...quantities, [line.id]: Number(e.target.value) })} /></div>;
            })}
          </div>
          <AdminButton className="mt-5" onClick={() => void receive()} disabled={saving}><PackageCheck />{saving ? "Recepcionando..." : "Registrar recepcion"}</AdminButton>
        </AdminPanel>
      )}

      {po.receipts.length > 0 && <AdminPanel className="mt-5 overflow-hidden"><div className="border-b border-slate-300 px-5 py-3.5"><h2 className="font-display text-[16px] font-bold text-slate-950">Recepciones</h2></div>{po.receipts.map((receipt) => <div key={receipt.id} className="grid gap-2 border-b border-slate-200 px-5 py-3 last:border-0 sm:grid-cols-[.8fr_1fr_.5fr]"><p className="font-mono text-[12.5px] font-bold text-brand">{receipt.number}</p><p className="text-[13px] text-slate-700">{receipt.warehouse.name}</p><p className="text-[12px] text-slate-600">{new Date(receipt.receivedAt).toLocaleDateString("es-AR")}</p></div>)}</AdminPanel>}
      <ConfirmDialog open={cancelOpen} onOpenChange={setCancelOpen} title="Anular OC" description={`Anular ${po.number}. Se reversara la cuenta corriente proveedor si no tiene recepciones.`} onConfirm={() => void cancel()} />
    </div>
  );
}
