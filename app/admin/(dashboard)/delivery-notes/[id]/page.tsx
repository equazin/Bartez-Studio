"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ban, ChevronLeft } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner, ConfirmDialog } from "../../../../../components/admin/AdminUI";

interface DeliveryLine {
  id: string;
  description: string;
  quantity: string | number;
}

interface DeliveryNote {
  id: string;
  number: string;
  pointOfSale: number;
  status: string;
  issueDate: string;
  receiverName: string;
  receiverTaxId: string | null;
  receiverAddress: string | null;
  notes: string | null;
  account: { id: string; name: string; taxId: string | null } | null;
  order: { id: string; number: string } | null;
  lines: DeliveryLine[];
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  issued: { label: "Emitido", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  cancelled: { label: "Anulado", color: "border-red-200 bg-red-50 text-red-900" },
};

export default function DeliveryNoteDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<DeliveryNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/delivery-notes/${params.id}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar el remito");
      setItem(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  async function cancel() {
    setError(null);
    try {
      const res = await fetch(`/api/admin/delivery-notes/${params.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos anular el remito");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!item) return <p className="py-20 text-center text-slate-600">Remito no encontrado.</p>;

  const status = STATUS_META[item.status] || STATUS_META.issued;

  return (
    <div className="mx-auto max-w-[980px]">
      <Link href="/admin/delivery-notes" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a remitos
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{item.number}</h1>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate-600">PV {String(item.pointOfSale).padStart(4, "0")} - {new Date(item.issueDate).toLocaleDateString("es-AR")}</p>
        </div>
        {item.status === "issued" && <AdminButton variant="secondary" onClick={() => setCancelOpen(true)}><Ban />Anular</AdminButton>}
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Receptor</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">{item.receiverName}</p>
          {item.receiverTaxId && <p className="mt-1 text-[12px] text-slate-600">{item.receiverTaxId}</p>}
          {item.receiverAddress && <p className="text-[12px] text-slate-600">{item.receiverAddress}</p>}
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Cuenta y pedido</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">{item.account?.name || "-"}</p>
          {item.order && <p className="mt-1 text-[12px] text-slate-600">Pedido <Link href={`/admin/orders/${item.order.id}`} className="font-bold text-brand hover:underline">{item.order.number}</Link></p>}
        </AdminPanel>
      </div>

      <AdminPanel className="mt-6 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
            <tr><th className="px-4 py-2.5 text-left">Descripcion</th><th className="px-4 py-2.5 text-right">Cantidad</th></tr>
          </thead>
          <tbody>
            {item.lines.map((line) => (
              <tr key={line.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{line.description}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-950">{Number(line.quantity).toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminPanel>

      {item.notes && (
        <AdminPanel className="mt-5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Notas</p>
          <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{item.notes}</p>
        </AdminPanel>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Anular remito"
        description={`Anular ${item.number}. El remito quedara marcado como anulado.`}
        onConfirm={() => void cancel()}
      />
    </div>
  );
}
