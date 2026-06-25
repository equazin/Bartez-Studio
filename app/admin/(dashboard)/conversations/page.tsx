"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPanel,
  AdminSpinner,
} from "../../../../components/admin/AdminUI";

type Message = {
  id: string;
  waMessageId: string;
  direction: "inbound" | "outbound";
  type: string;
  body: string | null;
  category: string | null;
  metadata?: any;
  createdAt: string;
};

type Conversation = {
  id: string;
  waId: string;
  profileName: string | null;
  category: string | null;
  status: string;
  leadCreated: boolean;
  messages: Message[];
  updatedAt: string;
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  escalated: "Escalado",
  pending_lead_confirmation: "Pendiente",
  resolved: "Resuelto",
};

const statusColors: Record<string, string> = {
  active: "border-blue-300 bg-blue-50 text-blue-900",
  escalated: "border-amber-300 bg-amber-50 text-amber-900",
  pending_lead_confirmation: "border-purple-300 bg-purple-50 text-purple-900",
  resolved: "border-slate-300 bg-slate-50 text-slate-900",
};

const categoryLabels: Record<string, string> = {
  cotizacion: "Cotización",
  asesoramiento: "Asesoramiento",
  soporte: "Soporte",
  info_general: "Info General",
  revendedor: "Revendedor",
  seguimiento: "Seguimiento",
  spam: "Spam",
};

export default function AdminConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch all conversations
  const loadConversations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/conversations", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error al cargar conversaciones");
      setConversations(data.conversations);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Fetch a specific conversation details (including message history)
  const loadDetail = useCallback(async (id: string, isSilent = false) => {
    if (!isSilent) setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error al cargar detalle");
      setSelectedConv(data.conversation);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      if (!isSilent) setLoadingDetail(false);
    }
  }, []);

  // Load initially
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // SSE stream for live updates (replaces 7s polling)
  useEffect(() => {
    const source = new EventSource("/api/admin/conversations/stream");
    source.addEventListener("conversations", (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent<string>).data) as { conversations: Conversation[] };
        setConversations(payload.conversations);
      } catch {
        /* ignore parse errors */
      }
    });
    source.onerror = () => {
      // EventSource auto-reconnects; we just surface a soft error
      setError("Conexión en vivo interrumpida. Reintentando…");
    };
    return () => source.close();
  }, []);

  // Re-fetch detail when a new conversations payload arrives and we have one selected
  useEffect(() => {
    if (selectedId) loadDetail(selectedId, true);
  }, [conversations, selectedId, loadDetail]);

  // Fetch detail when selectedId changes
  useEffect(() => {
    if (selectedId) {
      loadDetail(selectedId);
    } else {
      setSelectedConv(null);
    }
  }, [selectedId, loadDetail]);

  const updateConvProp = async (id: string, key: "status" | "category", value: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error al actualizar");

      // Update local state
      await loadConversations(true);
      await loadDetail(id, true);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const sendManualReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !replyText.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/admin/conversations/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error al enviar mensaje");

      setReplyText("");
      // Reload conversation detail and list
      await loadConversations(true);
      await loadDetail(selectedId, true);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSendingReply(false);
    }
  };

  const stats = {
    total: conversations.length,
    active: conversations.filter((c) => c.status === "active").length,
    escalated: conversations.filter((c) => c.status === "escalated").length,
    resolved: conversations.filter((c) => c.status === "resolved").length,
  };

  const getPendingStatus = (c: Conversation): "new_message" | "escalated_bot" | null => {
    if (c.status === "pending_lead_confirmation") return "escalated_bot";
    if (c.status !== "escalated") return null;
    const lastMsg = c.messages?.[0];
    if (!lastMsg) return "escalated_bot"; // Escalated but no messages
    if (lastMsg.direction === "inbound") return "new_message";
    return lastMsg.waMessageId?.startsWith("bot_") ? "escalated_bot" : null;
  };

  const filtered = conversations.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      c.waId.includes(searchLower) ||
      (c.profileName || "").toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">
            Conversaciones de WhatsApp
          </h1>
          <p className="mt-1 text-[14px] font-medium text-slate-700">
            Supervisá y gestioná las consultas que atiende el Asistente con IA en tiempo real.
          </p>
        </div>
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => {
            loadConversations();
            if (selectedId) loadDetail(selectedId);
          }}
          disabled={loading || loadingDetail}
        >
          <RefreshCw className={loading || loadingDetail ? "animate-spin" : ""} />
          Actualizar
        </AdminButton>
      </div>

      {error && (
        <div className="mt-5">
          <AdminAlert tone="error">{error}</AdminAlert>
        </div>
      )}

      {/* Stats Bar */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
              <MessageSquare className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Chats</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">{stats.total}</h4>
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <RefreshCw className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Activos (Bot)</p>
              <h4 className="text-xl font-bold text-blue-900 mt-0.5">{stats.active}</h4>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Escalados</p>
              <h4 className="text-xl font-bold text-amber-900 mt-0.5">{stats.escalated}</h4>
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-green-50 text-green-700">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resueltos</p>
              <h4 className="text-xl font-bold text-green-900 mt-0.5">{stats.resolved}</h4>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-20 flex justify-center">
          <AdminSpinner />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ── Left Pane: Conversation List ── */}
          <div className="lg:col-span-4 xl:col-span-3.5">
            <AdminPanel className="flex flex-col h-[70vh] overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col gap-3">
                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar chat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 text-[13.5px] outline-none hover:border-slate-400 focus:border-brand focus:bg-white"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {["all", "active", "pending_lead_confirmation", "escalated", "resolved"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-colors ${
                        statusFilter === st
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {st === "all" ? "Todos" : statusLabels[st] || st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-[13.5px]">
                    No se encontraron conversaciones.
                  </div>
                ) : (
                  filtered.map((c) => {
                    const lastMsg = c.messages?.[0];
                    const active = selectedId === c.id;
                    const pendingStatus = getPendingStatus(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`w-full p-4 text-left transition-colors flex flex-col gap-1.5 border-l-4 ${
                          active
                            ? "bg-green-50/70 border-l-green-700"
                            : pendingStatus === "new_message"
                              ? "bg-rose-50/40 hover:bg-rose-50 border-l-rose-500"
                              : pendingStatus === "escalated_bot"
                                ? "bg-amber-50/30 hover:bg-amber-50 border-l-amber-500"
                                : "hover:bg-slate-50 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[14px] text-slate-950 truncate max-w-[150px]">
                            {c.profileName || c.waId}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                            {formatDate(c.updatedAt)}
                          </span>
                        </div>
                        <div className="text-[12px] text-slate-500 truncate">
                          {c.profileName ? c.waId : ""}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-bold ${
                              statusColors[c.status] || "border-slate-300 bg-slate-50"
                            }`}
                          >
                            {statusLabels[c.status] || c.status}
                          </span>
                          {pendingStatus === "new_message" && (
                            <span className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 text-rose-800 px-1.5 py-0.5 text-[10.5px] font-bold animate-pulse">
                              Nuevo Mensaje
                            </span>
                          )}
                          {pendingStatus === "escalated_bot" && (
                            <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 text-amber-800 px-1.5 py-0.5 text-[10.5px] font-bold">
                              Derivado
                            </span>
                          )}
                          {c.category && (
                            <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 text-green-800 px-1.5 py-0.5 text-[10.5px] font-bold">
                              {categoryLabels[c.category] || c.category}
                            </span>
                          )}
                          {c.leadCreated && (
                            <span className="inline-flex items-center gap-1 rounded border border-purple-200 bg-purple-50 text-purple-800 px-1.5 py-0.5 text-[10.5px] font-bold">
                              Lead creado
                            </span>
                          )}
                        </div>

                        {lastMsg && (
                          <p className="text-[12.5px] text-slate-700 truncate mt-1">
                            {lastMsg.direction === "outbound" ? "Bot: " : "Usuario: "}
                            {lastMsg.body}
                          </p>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </AdminPanel>
          </div>

          {/* ── Right Pane: Chat Detail ── */}
          <div className="lg:col-span-8 xl:col-span-8.5">
            {selectedConv ? (
              <AdminPanel className="flex flex-col h-[70vh] overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[16px]">
                      {selectedConv.profileName ? (
                        selectedConv.profileName.charAt(0).toUpperCase()
                      ) : (
                        <User className="size-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-[15px] text-slate-950">
                        {selectedConv.profileName || "WhatsApp Contact"}
                      </h2>
                      <p className="text-[12.5px] text-slate-600 font-medium">{selectedConv.waId}</p>
                    </div>
                  </div>

                  {/* Actions & Selectors */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status Select */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11.5px] font-bold text-slate-600 uppercase tracking-wider">
                        Estado:
                      </label>
                      <select
                        value={selectedConv.status}
                        onChange={(e) => updateConvProp(selectedConv.id, "status", e.target.value)}
                        disabled={updating}
                        className="h-8 rounded border border-slate-300 bg-white px-2 text-[12.5px] font-bold text-slate-900 outline-none focus:border-brand"
                      >
                        <option value="active">Activo</option>
                        <option value="escalated">Escalado</option>
                        <option value="pending_lead_confirmation">Pendiente</option>
                        <option value="resolved">Resuelto</option>
                      </select>
                    </div>

                    {/* Category Select */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11.5px] font-bold text-slate-600 uppercase tracking-wider">
                        Categoría:
                      </label>
                      <select
                        value={selectedConv.category || "info_general"}
                        onChange={(e) => updateConvProp(selectedConv.id, "category", e.target.value)}
                        disabled={updating}
                        className="h-8 rounded border border-slate-300 bg-white px-2 text-[12.5px] font-bold text-slate-900 outline-none focus:border-brand"
                      >
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Chat History Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
                  {selectedConv.messages.length === 0 ? (
                    <div className="m-auto text-center text-slate-500 text-[13.5px]">
                      No hay mensajes en esta conversación.
                    </div>
                  ) : (
                    selectedConv.messages.map((m) => {
                      const inbound = m.direction === "inbound";
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col max-w-[70%] gap-1 ${
                            inbound ? "self-start" : "self-end items-end"
                          }`}
                        >
                          <div
                            className={`rounded-xl px-4 py-2.5 text-[13.5px] font-medium leading-relaxed shadow-sm ${
                              inbound
                                ? "bg-white text-slate-950 border border-slate-200"
                                : "bg-brand text-white"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{m.body}</p>

                            {/* Interactive details */}
                            {m.type === "interactive_reply" && (
                              <span className="mt-1 block text-[10px] uppercase font-bold tracking-wider opacity-60">
                                🔘 Botón pulsado
                              </span>
                            )}

                            {/* Failed delivery warning */}
                            {!inbound && m.metadata?.failed && (
                              <span className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-rose-200 bg-rose-950/40 border border-rose-800/40 px-2 py-1 rounded-md">
                                <AlertCircle className="size-3.5 text-rose-400 flex-none" />
                                Falló el envío: {m.metadata?.error || "Error de entrega"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 px-1">
                            <span className="text-[10px] text-slate-500">
                              {formatDate(m.createdAt)}
                            </span>
                            {!inbound && m.category && (
                              <span className="text-[9.5px] bg-blue-100 text-blue-800 font-bold px-1 rounded">
                                {m.category}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Reply Input */}
                <form onSubmit={sendManualReply} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={sendingReply}
                    placeholder="Escribí un mensaje de WhatsApp..."
                    className="flex-1 h-9 rounded-lg border border-slate-300 px-3 text-[13px] text-slate-900 outline-none focus:border-brand"
                  />
                  <AdminButton
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="h-9 px-4"
                  >
                    {sendingReply ? "Enviando..." : "Enviar"}
                  </AdminButton>
                </form>

                {/* Lead Info Footer panel (if lead details are present) */}
                {selectedConv.status === "escalated" && (
                  <div className="p-4 border-t border-slate-200 bg-amber-50/50 flex items-start gap-3">
                    <Clock className="size-5 text-amber-800 flex-none mt-0.5" />
                    <div>
                      <h3 className="text-[13.5px] font-bold text-amber-950">
                        Consulta derivada a un Humano (Escalado)
                      </h3>
                      <p className="mt-1 text-[12.5px] text-slate-800">
                        El Asistente detectó que la consulta requiere atención comercial humana. El
                        lead fue enviado en paralelo a Monday.com e integraciones activas.
                      </p>
                      {selectedConv.leadCreated && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-bold text-purple-900">
                          <CheckCircle2 className="size-4 text-purple-800" />
                          Lead creado en Monday.com exitosamente
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </AdminPanel>
            ) : (
              <AdminPanel className="flex h-[70vh] justify-center items-center">
                <div className="text-center p-6 max-w-sm flex flex-col items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500">
                    <MessageSquare className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-[15px] text-slate-950">
                      Ninguna conversación seleccionada
                    </h3>
                    <p className="mt-1 text-[13px] text-slate-600">
                      Elegí un chat de la lista de la izquierda para ver el historial y gestionar su
                      estado.
                    </p>
                  </div>
                </div>
              </AdminPanel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
