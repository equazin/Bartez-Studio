"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, Pencil, PackageCheck, Play, XCircle } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner, ConfirmDialog } from "../../../../../components/admin/AdminUI";

interface OrderLine {
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
  delivered: string;
  backorder: boolean;
  product: { id: string; sku: string | null; name: string; unit: string; stockTracked: boolean } | null;
}

interface OrderDetail {
  id: string;
  number: string;
  status: string;
  currency: string;
  orderDate: string;
  expectedDate: string | null;
  notes: string | null;
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  total: string;
  confirmedAt: string | null;
  preparedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  warehouseId: string | null;
  account: { id: string; name: string; taxId: string | null; email: string | null; phone: string | null } | null;
  owner: { id: string; name: string } | null;
  quote: { id: string; number: string } | null;
  lines: OrderLine[];
  airPreorder: { id: string; number: string; status: string; total: string; currency: string } | null;
}

const PREORDER_STATUSES: Record<string, string> = {
  preorden: "Pre-orden (sin emitir)",
  issued: "Emitida",
  partially_received: "Recibida parcial",
  received: "Recibida",
  cancelled: "Anulada",
};

const STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "border-slate-200 bg-slate-50 text-slate-700" },
  confirmed: { label: "Confirmado", color: "border-blue-200 bg-blue-50 text-blue-900" },
  in_preparation: { label: "En preparación", color: "border-amber-200 bg-amber-50 text-amber-900" },
  delivered: { label: "Entregado", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  cancelled: { label: "Cancelado", color: "border-red-200 bg-red-50 text-red-900" },
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const json = await res.json();
      setOrder(json.data);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  async function changeStatus(status: string) {
    setTransitioning(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cambiar estado");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setTransitioning(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!order) return <p className="py-20 text-center text-slate-600">Pedido no encontrado.</p>;

  const status = STATUSES[order.status] || STATUSES.draft;
  const hasBackorderLines = order.lines.some((l) => l.backorder);

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a pedidos
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{order.number}</h1>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate-600">
            Pedido {new Date(order.orderDate).toLocaleDateString("es-AR")}
            {order.expectedDate && ` · Entrega esperada ${new Date(order.expectedDate).toLocaleDateString("es-AR")}`}
            {order.account && ` · ${order.account.name}`}
            {order.quote && <> · desde <Link href={`/admin/quotes/${order.quote.id}`} className="font-bold text-brand hover:underline">{order.quote.number}</Link></>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {order.status === "draft" && (
            <>
              <AdminButton variant="secondary" asChild><Link href={`/admin/orders/${order.id}/edit`}><Pencil />Editar</Link></AdminButton>
              <AdminButton onClick={() => void changeStatus("confirmed")} disabled={transitioning}><CheckCircle2 />Confirmar</AdminButton>
            </>
          )}
          {order.status === "confirmed" && (
            <>
              <AdminButton onClick={() => void changeStatus("in_preparation")} disabled={transitioning}><Play />Pasar a preparación</AdminButton>
              <AdminButton onClick={() => void changeStatus("delivered")} disabled={transitioning}><PackageCheck />Marcar entregado</AdminButton>
            </>
          )}
          {order.status === "in_preparation" && (
            <AdminButton onClick={() => void changeStatus("delivered")} disabled={transitioning}><PackageCheck />Marcar entregado</AdminButton>
          )}
          {(order.status === "draft" || order.status === "confirmed" || order.status === "in_preparation") && (
            <AdminButton variant="secondary" onClick={() => setCancelOpen(true)} disabled={transitioning}><XCircle />Cancelar pedido</AdminButton>
          )}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      {hasBackorderLines && order.status !== "delivered" && order.status !== "cancelled" && (
        <div className="mt-5">
          <AdminAlert tone="error">
            Este pedido tiene líneas marcadas como <strong>bajo pedido</strong>. No se reserva stock — habrá que comprarlas o producirlas antes de entregar.
          </AdminAlert>
        </div>
      )}

      {order.airPreorder && (
        <div className="mt-5 rounded-xl border border-orange-300 bg-orange-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold text-orange-900">Pre-orden de compra a AIR derivada de este pedido</p>
              <p className="mt-0.5 text-[13px] text-orange-800">
                <Link href={`/admin/purchase-orders/${order.airPreorder.id}`} className="font-mono font-bold text-brand hover:underline">{order.airPreorder.number}</Link>
                {" · "}{PREORDER_STATUSES[order.airPreorder.status] ?? order.airPreorder.status}
                {" · "}{order.airPreorder.currency} {Number(order.airPreorder.total).toLocaleString("es-AR")}
              </p>
            </div>
            <AdminButton variant="secondary" size="sm" asChild>
              <Link href={`/admin/purchase-orders/${order.airPreorder.id}`}>Ver pre-orden</Link>
            </AdminButton>
          </div>
        </div>
      )}

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
                <th className="px-4 py-2.5 text-right">Entregado</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line) => (
                <tr key={line.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-950">{line.description}</p>
                    <div className="mt-0.5 flex gap-2 text-[11.5px]">
                      {line.product?.sku && <span className="text-slate-500">SKU {line.product.sku}</span>}
                      {line.backorder && <span className="font-bold text-amber-700">Bajo pedido</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{Number(line.quantity).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.unitPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.discountPct)}%</td>
                  <td className="px-4 py-3 text-right">{Number(line.taxRate)}%</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-950">{order.currency} {Number(line.lineTotal).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{Number(line.delivered).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="ml-auto grid max-w-sm gap-2 text-[13px]">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-bold text-slate-950">{order.currency} {Number(order.subtotal).toLocaleString()}</span></div>
            {Number(order.discountTotal) > 0 && <div className="flex justify-between"><span className="text-slate-600">Descuentos</span><span className="font-bold text-slate-950">- {order.currency} {Number(order.discountTotal).toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-slate-600">IVA</span><span className="font-bold text-slate-950">{order.currency} {Number(order.taxTotal).toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 text-[15px]"><span className="font-bold text-slate-900">Total</span><span className="font-display font-bold text-slate-950">{order.currency} {Number(order.total).toLocaleString()}</span></div>
          </div>
        </div>
      </AdminPanel>

      {order.notes && (
        <AdminPanel className="mt-5 p-5">
          <h3 className="font-display text-[14px] font-bold text-slate-950">Notas</h3>
          <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{order.notes}</p>
        </AdminPanel>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar pedido"
        description={`¿Cancelar ${order.number}? Se liberará el stock reservado (si corresponde).`}
        onConfirm={() => void changeStatus("cancelled")}
      />
    </div>
  );
}
