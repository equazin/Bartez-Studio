"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ban, ChevronLeft, ExternalLink, FileText, Link2 } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner, ConfirmDialog } from "../../../../../components/admin/AdminUI";

interface Line {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discountPct: string;
  taxRate: string;
  lineSubtotal: string;
  lineTax: string;
  lineTotal: string;
}

interface PaymentLink {
  id: string;
  url: string | null;
  amount: string;
  status: string;
  externalId: string | null;
  createdAt: string;
}

interface InvoiceDetail {
  id: string;
  number: string;
  docTypeCode: number;
  pointOfSale: number;
  afipNumber: number | null;
  cae: string | null;
  caeExpiresAt: string | null;
  afipStatus: string;
  status: string;
  currency: string;
  issueDate: string;
  receiverName: string;
  receiverTaxId: string | null;
  receiverDocType: number | null;
  receiverAddress: string | null;
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  total: string;
  notes: string | null;
  account: { id: string; name: string; taxId: string | null } | null;
  order: { id: string; number: string } | null;
  lines: Line[];
  paymentLinks: PaymentLink[];
}

const DOC_LABEL: Record<number, string> = {
  1: "Factura A", 6: "Factura B", 11: "Factura C",
  2: "Nota de Debito A", 7: "Nota de Debito B", 12: "Nota de Debito C",
  3: "Nota de Crédito A", 8: "Nota de Crédito B", 13: "Nota de Crédito C",
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "border-slate-200 bg-slate-50 text-slate-700" },
  issued: { label: "Emitida", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  cancelled: { label: "Anulada", color: "border-red-200 bg-red-50 text-red-900" },
};

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<{ invoice: InvoiceDetail; qrUrl: string | null; balance: { total: number; paid: number; pending: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/invoices/${params.id}`);
      const json = await res.json();
      setData(json.data ? { invoice: json.data, qrUrl: json.qrUrl, balance: json.balance } : null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  async function generatePaymentLink() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/invoices/${params.id}/payment-link`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al generar link");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setGenerating(false);
    }
  }

  async function cancel() {
    try {
      await fetch(`/api/admin/invoices/${params.id}`, { method: "DELETE" });
      void load();
    } catch {
      setError("Error al anular");
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!data) return <p className="py-20 text-center text-slate-600">Factura no encontrada.</p>;

  const { invoice, qrUrl, balance } = data;
  const status = STATUS_META[invoice.status] || STATUS_META.draft;
  const isCreditNote = [3, 8, 13].includes(invoice.docTypeCode);

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/invoices" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a facturas
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">
              {DOC_LABEL[invoice.docTypeCode] || `CBT${invoice.docTypeCode}`}
            </h1>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate-600">
            PV {String(invoice.pointOfSale).padStart(4, "0")} · Nº {invoice.afipNumber ? String(invoice.afipNumber).padStart(8, "0") : "—"}
            {invoice.cae && ` · CAE ${invoice.cae}`}
            {invoice.caeExpiresAt && ` · vence ${new Date(invoice.caeExpiresAt).toLocaleDateString("es-AR")}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" asChild><Link href={`/admin/invoices/${invoice.id}/pdf`} target="_blank"><FileText />Ver PDF fiscal</Link></AdminButton>
          {invoice.status === "issued" && !isCreditNote && balance.pending > 0 && (
            <AdminButton onClick={() => void generatePaymentLink()} disabled={generating}><Link2 />{generating ? "Generando…" : "Link de pago"}</AdminButton>
          )}
          {invoice.status === "issued" && (
            <AdminButton variant="secondary" onClick={() => setCancelOpen(true)}><Ban />Anular</AdminButton>
          )}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Receptor</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">{invoice.receiverName}</p>
          {invoice.receiverTaxId && <p className="mt-1 text-[12px] text-slate-600">{invoice.receiverDocType === 80 ? "CUIT" : invoice.receiverDocType === 96 ? "DNI" : "Doc"} {invoice.receiverTaxId}</p>}
          {invoice.receiverAddress && <p className="text-[12px] text-slate-600">{invoice.receiverAddress}</p>}
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Cuenta y pedido</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">{invoice.account?.name || "—"}</p>
          {invoice.order && <p className="mt-1 text-[12px] text-slate-600">Pedido <Link href={`/admin/orders/${invoice.order.id}`} className="font-bold text-brand hover:underline">{invoice.order.number}</Link></p>}
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Cobro</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">Pagado {invoice.currency} {balance.paid.toLocaleString()}</p>
          <p className="text-[12px] text-slate-600">Pendiente {invoice.currency} {balance.pending.toLocaleString()}</p>
        </AdminPanel>
      </div>

      <AdminPanel className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-[13px]">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
              <tr>
                <th className="px-4 py-2.5 text-left">Descripción</th>
                <th className="px-4 py-2.5 text-right">Cant.</th>
                <th className="px-4 py-2.5 text-right">Precio</th>
                <th className="px-4 py-2.5 text-right">Desc.</th>
                <th className="px-4 py-2.5 text-right">IVA</th>
                <th className="px-4 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{line.description}</td>
                  <td className="px-4 py-3 text-right">{Number(line.quantity).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.unitPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.discountPct)}%</td>
                  <td className="px-4 py-3 text-right">{Number(line.taxRate)}%</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-950">{invoice.currency} {Number(line.lineTotal).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="ml-auto grid max-w-sm gap-2 text-[13px]">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-bold">{invoice.currency} {Number(invoice.subtotal).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">IVA</span><span className="font-bold">{invoice.currency} {Number(invoice.taxTotal).toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 text-[15px]"><span className="font-bold text-slate-900">Total</span><span className="font-display font-bold">{invoice.currency} {Number(invoice.total).toLocaleString()}</span></div>
          </div>
        </div>
      </AdminPanel>

      {invoice.paymentLinks.length > 0 && (
        <AdminPanel className="mt-5 overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-3.5"><h3 className="font-display text-[15px] font-bold text-slate-950">Links de pago</h3></div>
          {invoice.paymentLinks.map((pl) => (
            <div key={pl.id} className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-slate-950">{invoice.currency} {Number(pl.amount).toLocaleString()} · {pl.status === "paid" ? "Pagado" : "Pendiente"}</p>
                <p className="truncate text-[11px] text-slate-500">{pl.externalId || "—"}</p>
              </div>
              {pl.url && <a href={pl.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12.5px] font-bold text-brand hover:underline"><ExternalLink className="size-3" />Abrir</a>}
            </div>
          ))}
        </AdminPanel>
      )}

      {qrUrl && (
        <AdminPanel className="mt-5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">QR fiscal AFIP</p>
          <a href={qrUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex break-all text-[11px] font-mono text-slate-700 hover:underline">{qrUrl}</a>
        </AdminPanel>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Anular factura"
        description={`¿Anular ${invoice.number}? Se registrará un asiento espejo en la cuenta corriente.`}
        onConfirm={() => void cancel()}
      />
    </div>
  );
}
