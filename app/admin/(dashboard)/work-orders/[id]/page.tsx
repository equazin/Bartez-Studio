"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, Play, XCircle } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner } from "../../../../../components/admin/AdminUI";

interface WorkOrderDetail {
  id: string;
  number: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  scheduledFor: string | null;
  startedAt: string | null;
  completedAt: string | null;
  durationMinutes: number | null;
  resolutionNotes: string | null;
  account: { id: string; name: string } | null;
  ticket: { id: string; number: string; subject: string } | null;
  assignedTo: { id: string; name: string } | null;
  serialNumber: { id: string; serial: string; product: { id: string; name: string; sku: string | null } } | null;
  items: Array<{ id: string; description: string; quantity: string; unitPrice: string; kind: string; billable: boolean; product: { id: string; name: string } | null }>;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Programada", color: "border-blue-200 bg-blue-50 text-blue-900" },
  in_progress: { label: "En curso", color: "border-amber-200 bg-amber-50 text-amber-900" },
  completed: { label: "Completada", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  cancelled: { label: "Cancelada", color: "border-slate-200 bg-slate-50 text-slate-700" },
};

export default function WorkOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [wo, setWo] = useState<WorkOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/work-orders/${params.id}`);
      const json = await res.json();
      setWo(json.data);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  async function changeStatus(status: string, resolutionNotes?: string, durationMinutes?: number) {
    setTransitioning(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/work-orders/${params.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolutionNotes, durationMinutes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setTransitioning(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!wo) return <p className="py-20 text-center text-slate-600">OT no encontrada.</p>;

  const status = STATUS_META[wo.status] || STATUS_META.scheduled;

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/work-orders" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a OT
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{wo.title}</h1>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate-600">
            <span className="font-mono font-bold">{wo.number}</span>
            {wo.account && ` · ${wo.account.name}`}
            {wo.scheduledFor && ` · programada ${new Date(wo.scheduledFor).toLocaleString("es-AR")}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {wo.status === "scheduled" && <AdminButton onClick={() => void changeStatus("in_progress")} disabled={transitioning}><Play />Comenzar</AdminButton>}
          {wo.status === "in_progress" && <AdminButton onClick={() => void changeStatus("completed")} disabled={transitioning}><CheckCircle2 />Completar</AdminButton>}
          {(wo.status === "scheduled" || wo.status === "in_progress") && (
            <AdminButton variant="secondary" onClick={() => void changeStatus("cancelled")} disabled={transitioning}><XCircle />Cancelar</AdminButton>
          )}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Técnico</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">{wo.assignedTo?.name || "Sin asignar"}</p>
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Equipo</p>
          {wo.serialNumber ? (
            <>
              <p className="mt-1 text-[14px] font-bold text-slate-950">{wo.serialNumber.product.name}</p>
              <p className="text-[11.5px] text-slate-600">SN {wo.serialNumber.serial}</p>
            </>
          ) : <p className="mt-1 text-[14px] text-slate-500">Sin equipo</p>}
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Ticket</p>
          {wo.ticket ? (
            <Link href={`/admin/tickets/${wo.ticket.id}`} className="mt-1 inline-block text-[13px] font-bold text-brand hover:underline">{wo.ticket.number}</Link>
          ) : <p className="mt-1 text-[14px] text-slate-500">—</p>}
        </AdminPanel>
      </div>

      {wo.description && (
        <AdminPanel className="mt-5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Descripción</p>
          <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{wo.description}</p>
        </AdminPanel>
      )}

      {wo.items.length > 0 && (
        <AdminPanel className="mt-5 overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-3.5"><h3 className="font-display text-[15px] font-bold text-slate-950">Items y mano de obra</h3></div>
          <table className="w-full text-[13px]">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
              <tr>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-right">Cant.</th>
                <th className="px-4 py-2 text-right">Precio</th>
                <th className="px-4 py-2 text-left">Facturable</th>
              </tr>
            </thead>
            <tbody>
              {wo.items.map((it) => (
                <tr key={it.id} className="border-t border-slate-200">
                  <td className="px-4 py-2">{it.kind === "labor" ? "Mano de obra" : "Repuesto"}</td>
                  <td className="px-4 py-2">{it.description}</td>
                  <td className="px-4 py-2 text-right">{Number(it.quantity).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{Number(it.unitPrice).toLocaleString()}</td>
                  <td className="px-4 py-2">{it.billable ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      )}

      {wo.resolutionNotes && (
        <AdminPanel className="mt-5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Resolución</p>
          <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{wo.resolutionNotes}</p>
          {wo.durationMinutes && <p className="mt-2 text-[12px] text-slate-600">Duración: {wo.durationMinutes} min</p>}
        </AdminPanel>
      )}
    </div>
  );
}
