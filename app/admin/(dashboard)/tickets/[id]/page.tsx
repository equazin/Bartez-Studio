"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, Lock, MessageCircle, Send, XCircle } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
} from "../../../../../components/admin/AdminUI";

interface Message {
  id: string;
  body: string;
  authorType: string;
  authorName: string | null;
  internal: boolean;
  createdAt: string;
}

interface TicketDetail {
  id: string;
  number: string;
  subject: string;
  description: string | null;
  type: string;
  priority: string;
  status: string;
  channel: string;
  createdAt: string;
  firstResponseAt: string | null;
  solvedAt: string | null;
  closedAt: string | null;
  dueAt: string | null;
  resolutionNotes: string | null;
  account: { id: string; name: string; email: string | null; phone: string | null } | null;
  assignedTo: { id: string; name: string; email: string } | null;
  serialNumber: { id: string; serial: string; product: { id: string; name: string; sku: string | null } } | null;
  messages: Message[];
  workOrders: Array<{ id: string; number: string; status: string }>;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  new: { label: "Nuevo", color: "border-blue-200 bg-blue-50 text-blue-900" },
  open: { label: "En progreso", color: "border-amber-200 bg-amber-50 text-amber-900" },
  pending: { label: "Pendiente", color: "border-purple-200 bg-purple-50 text-purple-900" },
  solved: { label: "Resuelto", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  closed: { label: "Cerrado", color: "border-slate-200 bg-slate-50 text-slate-700" },
};

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${params.id}`);
      const json = await res.json();
      setTicket(json.data);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  async function sendMessage() {
    if (!reply.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tickets/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply, internal }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setReply("");
      setInternal(false);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSending(false);
    }
  }

  async function changeStatus(status: string, resolutionNotes?: string) {
    setTransitioning(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tickets/${params.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolutionNotes }),
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
  if (!ticket) return <p className="py-20 text-center text-slate-600">Ticket no encontrado.</p>;

  const status = STATUS_META[ticket.status] || STATUS_META.new;
  const overdue = ticket.dueAt && new Date(ticket.dueAt) < new Date() && ticket.status !== "solved" && ticket.status !== "closed";

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/tickets" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a tickets
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{ticket.subject}</h1>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.color}`}>{status.label}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate-600">
            <span className="font-mono font-bold">{ticket.number}</span>
            {ticket.account && ` · ${ticket.account.name}`}
            {ticket.dueAt && (
              <span className={overdue ? " font-bold text-red-700" : ""}>
                {" "}· vence {new Date(ticket.dueAt).toLocaleDateString("es-AR")}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ticket.status === "new" && <AdminButton onClick={() => void changeStatus("open")} disabled={transitioning}><MessageCircle />Abrir</AdminButton>}
          {(ticket.status === "open" || ticket.status === "pending") && (
            <AdminButton onClick={() => void changeStatus("solved")} disabled={transitioning}><CheckCircle2 />Marcar resuelto</AdminButton>
          )}
          {ticket.status === "solved" && (
            <AdminButton onClick={() => void changeStatus("closed")} disabled={transitioning}><Lock />Cerrar</AdminButton>
          )}
          {ticket.status !== "closed" && (
            <AdminButton variant="secondary" onClick={() => void changeStatus("pending")} disabled={transitioning}><XCircle />Pendiente cliente</AdminButton>
          )}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Asignado a</p>
          <p className="mt-1 text-[14px] font-bold text-slate-950">{ticket.assignedTo?.name || "—"}</p>
          {ticket.assignedTo?.email && <p className="text-[11.5px] text-slate-600">{ticket.assignedTo.email}</p>}
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Equipo</p>
          {ticket.serialNumber ? (
            <>
              <p className="mt-1 text-[14px] font-bold text-slate-950">{ticket.serialNumber.product.name}</p>
              <p className="text-[11.5px] text-slate-600">SN {ticket.serialNumber.serial}</p>
            </>
          ) : <p className="mt-1 text-[14px] text-slate-500">Sin equipo</p>}
        </AdminPanel>
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Tiempos</p>
          <p className="mt-1 text-[12px] text-slate-700">Creado: {new Date(ticket.createdAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
          {ticket.firstResponseAt && <p className="text-[12px] text-slate-700">1er resp: {new Date(ticket.firstResponseAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
          {ticket.solvedAt && <p className="text-[12px] text-slate-700">Resuelto: {new Date(ticket.solvedAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
        </AdminPanel>
      </div>

      {ticket.description && (
        <AdminPanel className="mt-5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Descripción</p>
          <p className="mt-2 whitespace-pre-wrap text-[13px] text-slate-700">{ticket.description}</p>
        </AdminPanel>
      )}

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="border-b border-slate-300 px-5 py-3.5"><h3 className="font-display text-[15px] font-bold text-slate-950">Conversación</h3></div>
        {ticket.messages.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin mensajes todavía.</p>
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {ticket.messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] rounded-lg p-3 ${m.internal ? "self-end bg-amber-50 border border-amber-200" : m.authorType === "user" ? "self-end bg-brand/10 border border-brand/30" : "self-start bg-slate-100 border border-slate-200"}`}>
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                  <span>{m.authorName || m.authorType}</span>
                  {m.internal && <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[9.5px] text-amber-900">Interno</span>}
                  <span>·</span>
                  <span>{new Date(m.createdAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-[13px] text-slate-950">{m.body}</p>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-slate-300 p-4">
          <AdminTextarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Escribir respuesta…" rows={3} />
          <div className="mt-2 flex items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-[12.5px] font-bold text-slate-700">
              <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
              Nota interna
            </label>
            <AdminButton onClick={() => void sendMessage()} disabled={sending || !reply.trim()}><Send />{sending ? "Enviando…" : "Enviar"}</AdminButton>
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}
