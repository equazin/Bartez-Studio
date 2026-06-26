"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, FileText, Pencil, Send, XCircle } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner } from "../../../../../components/admin/AdminUI";

interface QuoteLine {
  id: string;
  position: number;
  description: string;
  quantity: string;
  unitPrice: string;
  discountPct: string;
  taxRate: string;
  lineSubtotal: string;
  lineTax: string;
  lineTotal: string;
  product: { id: string; sku: string | null; name: string; unit: string } | null;
}

interface QuoteDetail {
  id: string;
  number: string;
  status: string;
  currency: string;
  issueDate: string;
  validUntil: string | null;
  notes: string | null;
  terms: string | null;
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  total: string;
  sentAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  account: { id: string; name: string; taxId: string | null; email: string | null; phone: string | null; address: string | null; city: string | null } | null;
  owner: { id: string; name: string } | null;
  priceList: { id: string; name: string; currency: string } | null;
  lines: QuoteLine[];
}

const STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "border-slate-200 bg-slate-50 text-slate-700" },
  sent: { label: "Enviado", color: "border-blue-200 bg-blue-50 text-blue-900" },
  accepted: { label: "Aceptado", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  rejected: { label: "Rechazado", color: "border-red-200 bg-red-50 text-red-900" },
  expired: { label: "Vencido", color: "border-amber-200 bg-amber-50 text-amber-900" },
};

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${params.id}`);
      const json = await res.json();
      setQuote(json.data);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  async function changeStatus(status: string) {
    setTransitioning(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${params.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Error al cambiar estado");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setTransitioning(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!quote) return <p className="py-20 text-center text-slate-600">Presupuesto no encontrado.</p>;

  const status = STATUSES[quote.status] || STATUSES.draft;

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/quotes" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a presupuestos
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{quote.number}</h1>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate-600">
            Emisión {new Date(quote.issueDate).toLocaleDateString("es-AR")}
            {quote.validUntil && ` · Vence ${new Date(quote.validUntil).toLocaleDateString("es-AR")}`}
            {quote.account && ` · ${quote.account.name}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" asChild><Link href={`/admin/quotes/${quote.id}/pdf`} target="_blank"><FileText />Ver PDF</Link></AdminButton>
          <AdminButton variant="secondary" asChild><Link href={`/admin/quotes/${quote.id}/edit`}><Pencil />Editar</Link></AdminButton>
          {quote.status === "draft" && <AdminButton onClick={() => void changeStatus("sent")} disabled={transitioning}><Send />Marcar enviado</AdminButton>}
          {quote.status === "sent" && (
            <>
              <AdminButton onClick={() => void changeStatus("accepted")} disabled={transitioning}><CheckCircle2 />Aceptado</AdminButton>
              <AdminButton variant="secondary" onClick={() => void changeStatus("rejected")} disabled={transitioning}><XCircle />Rechazado</AdminButton>
            </>
          )}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-[13px]">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
              <tr>
                <th className="px-4 py-2.5 text-left">Descripción</th>
                <th className="px-4 py-2.5 text-right">Cantidad</th>
                <th className="px-4 py-2.5 text-right">Precio</th>
                <th className="px-4 py-2.5 text-right">Desc.</th>
                <th className="px-4 py-2.5 text-right">IVA</th>
                <th className="px-4 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.lines.map((line) => (
                <tr key={line.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-950">{line.description}</p>
                    {line.product?.sku && <p className="text-[11.5px] text-slate-500">SKU {line.product.sku}</p>}
                  </td>
                  <td className="px-4 py-3 text-right">{Number(line.quantity).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.unitPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.discountPct)}%</td>
                  <td className="px-4 py-3 text-right">{Number(line.taxRate)}%</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-950">{quote.currency} {Number(line.lineTotal).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="ml-auto grid max-w-sm gap-2 text-[13px]">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-bold text-slate-950">{quote.currency} {Number(quote.subtotal).toLocaleString()}</span></div>
            {Number(quote.discountTotal) > 0 && <div className="flex justify-between"><span className="text-slate-600">Descuentos</span><span className="font-bold text-slate-950">- {quote.currency} {Number(quote.discountTotal).toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-slate-600">IVA</span><span className="font-bold text-slate-950">{quote.currency} {Number(quote.taxTotal).toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 text-[15px]"><span className="font-bold text-slate-900">Total</span><span className="font-display font-bold text-slate-950">{quote.currency} {Number(quote.total).toLocaleString()}</span></div>
          </div>
        </div>
      </AdminPanel>

      {(quote.notes || quote.terms) && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {quote.notes && (
            <AdminPanel className="p-5">
              <h3 className="font-display text-[14px] font-bold text-slate-950">Notas</h3>
              <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{quote.notes}</p>
            </AdminPanel>
          )}
          {quote.terms && (
            <AdminPanel className="p-5">
              <h3 className="font-display text-[14px] font-bold text-slate-950">Términos y condiciones</h3>
              <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{quote.terms}</p>
            </AdminPanel>
          )}
        </div>
      )}
    </div>
  );
}
