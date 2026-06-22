"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

const SESSION_KEY = "bartez_assistant_messages";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: UIMessage[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs));
  } catch {
    // sessionStorage lleno o bloqueado — ignorar silenciosamente
  }
}
import {
  ArrowUp,
  Check,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { contact } from "../constants";
import { track } from "./Analytics";
import {
  Conversation,
  ConversationContent,
} from "./ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";

const suggestions = [
  "Necesito renovar equipos",
  "Quiero mejorar mi red",
  "Necesito soporte IT",
];

const fieldClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export function Assistant() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const savedMessages = useMemo(() => loadMessages(), []);
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
    messages: savedMessages.length > 0 ? savedMessages : undefined,
  });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadState, setLeadState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [leadError, setLeadError] = useState("");
  const [lead, setLead] = useState({ empresa: "", nombre: "", email: "", telefono: "", consent: false, website: "" });
  const conversationStarted = useRef(false);
  const isBusy = status === "streaming" || status === "submitted";

  // Persistir mensajes en sessionStorage cada vez que cambian
  const persistMessages = useCallback(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    persistMessages();
  }, [persistMessages]);

  useEffect(() => {
    const openFromPage = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-open-assistant]")) {
        event.preventDefault();
        setOpen(true);
        track("ai_chat_opened", { source: "page" });
      }
    };
    document.addEventListener("click", openFromPage);
    return () => document.removeEventListener("click", openFromPage);
  }, []);

  function openAssistant() {
    setOpen(true);
    track("ai_chat_opened");
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || isBusy || clean.length > 1_200) return;
    if (!conversationStarted.current) {
      conversationStarted.current = true;
      track("ai_conversation_started");
    }
    clearError();
    setInput("");
    await sendMessage({ text: clean });
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  const transcript = useMemo(
    () =>
      messages
        .map((message) => {
          const text = message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join(" ");
          return text ? `${message.role === "user" ? "Visitante" : "Asistente"}: ${text}` : "";
        })
        .filter(Boolean)
        .join("\n")
        .slice(0, 3_000),
    [messages],
  );

  const whatsappText = transcript
    ? `Hola, quiero continuar una consulta iniciada en el asistente de Bartez:\n${transcript.slice(-900)}`
    : contact.whatsappMessage;
  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead.consent) {
      setLeadState("error");
      setLeadError("Necesitamos tu confirmación antes de enviar los datos.");
      return;
    }
    setLeadState("loading");
    setLeadError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: lead.empresa,
          nombre: lead.nombre,
          email: lead.email,
          telefono: lead.telefono,
          tipoConsulta: "asesoramiento",
          mensaje: transcript || "Consulta iniciada desde el Asistente Bartez.",
          resumenIA: transcript,
          canalPreferido: lead.telefono ? "whatsapp" : "email",
          origen: "ai-assistant",
          website: lead.website,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setLeadState("error");
        setLeadError(data?.error || "No pudimos enviar la consulta.");
        return;
      }
      setLeadState("success");
      track("ai_lead_confirmed");
    } catch {
      setLeadState("error");
      setLeadError("No pudimos conectarnos. Continuá por WhatsApp.");
    }
  }

  return (
    <div id="asistente" className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!open ? (
        <button
          type="button"
          onClick={openAssistant}
          className="flex items-center gap-3 rounded-full bg-ink px-4 py-3 text-left text-white shadow-[0_18px_45px_-18px_rgba(6,32,20,.75)] transition-transform hover:-translate-y-1"
          aria-label="Abrir Asistente Bartez"
        >
          <span className="grid size-10 place-items-center rounded-full bg-white">
            <Image src="/brand/bartez-isologo.png" alt="" width={50} height={50} className="size-9" />
          </span>
          <span className="hidden pr-2 sm:block">
            <span className="block text-[13px] font-semibold">¿Necesitás orientación?</span>
            <span className="block text-[11.5px] text-slate-300">Asistente Bartez</span>
          </span>
        </button>
      ) : (
        <section
          className="flex h-[min(650px,calc(100vh-2rem))] w-[min(390px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_80px_-28px_rgba(6,32,20,.55)]"
          aria-label="Asistente comercial Bartez"
        >
          <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
            <Image src="/brand/bartez-isologo.png" alt="" width={50} height={50} className="size-9" />
            <div>
              <h2 className="font-display text-[14px] font-semibold text-ink">Asistente Bartez</h2>
              <p className="text-[11px] text-emerald-700">Orientación comercial</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Cerrar asistente">
              <X size={18} />
            </button>
          </header>

          {showLeadForm ? (
            <div className="flex-1 overflow-y-auto p-5">
              <button type="button" onClick={() => setShowLeadForm(false)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand">
                <ArrowUp className="-rotate-90" size={14} /> Volver a la conversación
              </button>
              {leadState === "success" ? (
                <div className="mt-16 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={22} /></span>
                  <h3 className="mt-5 font-display text-[20px] font-semibold text-ink">Consulta enviada</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Un asesor recibirá el contexto de la conversación y te contactará.</p>
                </div>
              ) : (
                <form onSubmit={submitLead} className="mt-6">
                  <h3 className="font-display text-[20px] font-semibold text-ink">Enviar al equipo comercial</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">Revisá y confirmá tus datos. No enviamos nada sin tu autorización.</p>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={lead.website} onChange={(event) => setLead((current) => ({ ...current, website: event.target.value }))} className="hidden" aria-hidden />
                  <div className="mt-5 flex flex-col gap-3">
                    <input required value={lead.empresa} onChange={(event) => setLead((current) => ({ ...current, empresa: event.target.value }))} className={fieldClass} placeholder="Empresa" aria-label="Empresa" />
                    <input required value={lead.nombre} onChange={(event) => setLead((current) => ({ ...current, nombre: event.target.value }))} className={fieldClass} placeholder="Nombre" aria-label="Nombre" />
                    <input required type="email" value={lead.email} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} className={fieldClass} placeholder="Email corporativo" aria-label="Email corporativo" />
                    <input value={lead.telefono} onChange={(event) => setLead((current) => ({ ...current, telefono: event.target.value }))} className={fieldClass} placeholder="Teléfono (opcional)" aria-label="Teléfono (opcional)" />
                  </div>
                  <label className="mt-4 flex items-start gap-2.5 text-[11.5px] leading-relaxed text-slate-600">
                    <input type="checkbox" checked={lead.consent} onChange={(event) => setLead((current) => ({ ...current, consent: event.target.checked }))} className="mt-0.5 size-4 accent-brand" />
                    <span>Confirmo el envío de mis datos y del resumen de esta conversación a Bartez.</span>
                  </label>
                  {leadState === "error" && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-[11.5px] text-red-700">{leadError}</p>}
                  <button type="submit" disabled={leadState === "loading" || !lead.consent} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-[13px] font-semibold text-white hover:bg-brand disabled:opacity-50">
                    {leadState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />} Confirmar y enviar
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              <Conversation className="bg-white">
                <ConversationContent>
                  <Message from="assistant">
                    <MessageContent from="assistant">
                      <MessageResponse>
                        Hola, puedo orientarte sobre nuestras soluciones y ayudarte a preparar una consulta.
                      </MessageResponse>
                    </MessageContent>
                  </Message>

                  {messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      {message.parts.map((part, index) =>
                        part.type === "text" ? (
                          <MessageContent key={`${message.id}-${index}`} from={message.role}>
                            <MessageResponse isAnimating={status === "streaming" && message.role === "assistant"}>{part.text}</MessageResponse>
                          </MessageContent>
                        ) : null,
                      )}
                    </Message>
                  ))}

                  {isBusy && messages.at(-1)?.role !== "assistant" && (
                    <Message from="assistant">
                      <MessageContent from="assistant" className="flex items-center gap-2 text-slate-500">
                        <Sparkles size={14} className="animate-pulse text-brand" /> Pensando…
                      </MessageContent>
                    </Message>
                  )}

                  {error && (
                    <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] leading-relaxed text-amber-900">
                      El asistente no está disponible en este momento. Podés continuar por WhatsApp.
                    </div>
                  )}
                </ConversationContent>
              </Conversation>

              <div className="border-t border-slate-200 p-3.5">
                {messages.length === 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button key={suggestion} type="button" onClick={() => void send(suggestion)} className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-brand hover:text-brand">
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={submitMessage} className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void send(input);
                      }
                    }}
                    rows={1}
                    maxLength={1_200}
                    placeholder="Escribí tu consulta…"
                    className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-1.5 py-2 text-[13px] text-slate-900 outline-none"
                    aria-label="Consulta para el asistente"
                  />
                  <button type="submit" disabled={!input.trim() || isBusy} className="grid size-9 flex-none place-items-center rounded-lg bg-ink text-white transition-colors hover:bg-brand disabled:opacity-40" aria-label="Enviar mensaje">
                    {isBusy ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={17} />}
                  </button>
                </form>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <button type="button" onClick={() => setShowLeadForm(true)} disabled={messages.length === 0} className="text-[11px] font-semibold text-brand disabled:text-slate-300">
                    Enviar consulta al equipo
                  </button>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => track("ai_whatsapp_handoff")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
                <p className="mt-2 text-center text-[9.5px] text-slate-400">La IA puede equivocarse. Las condiciones comerciales se confirman con un asesor.</p>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
