"use client";

import { Bot, ChevronRight, Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type Message = { role: "user" | "assistant"; content: string; id: string };

const QUICK_PROMPTS = [
  "Resumen del negocio hoy",
  "¿Qué actividades vencen esta semana?",
  "¿Cuántos leads nuevos este mes?",
  "Pedidos pendientes de entregar",
  "Alertas de stock bajo",
];

let idCounter = 0;
function uid() { return `msg-${++idCounter}`; }

function useCopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed, id: uid() };
    const assistantMsg: Message = { role: "assistant", content: "", id: uid() };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const payload = {
        messages: [...messages, userMsg].map((m) => ({
          role: m.role,
          parts: [{ type: "text", text: m.content }],
          id: m.id,
        })),
      };

      const res = await fetch("/api/admin/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Error en la respuesta");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("0:")) continue;
          try {
            const jsonStr = line.slice(2);
            const parsed = JSON.parse(jsonStr) as string;
            accumulated += parsed;
            setMessages((prev) =>
              prev.map((m) => m.id === assistantMsg.id ? { ...m, content: accumulated } : m)
            );
          } catch { /* skip non-text lines */ }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "Lo siento, hubo un error al procesar tu consulta. Intentá de nuevo." }
            : m,
        )
      );
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  return { messages, input, setInput, send, loading, stop };
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </div>
  );
}

export function Copilot() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, send, loading, stop } = useCopilot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-semibold transition-colors",
          open ? "bg-brand/20 text-sky-300" : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
        )}
      >
        <Sparkles className="size-3.5" strokeWidth={1.8} />
        <span className="hidden sm:inline">Copiloto</span>
      </button>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />}

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 flex h-[calc(100dvh-48px)] w-full flex-col border-l border-white/[0.08] bg-[#0d1120] shadow-2xl transition-transform duration-300 sm:w-[400px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-7 place-items-center rounded-lg bg-brand/20">
              <Bot className="size-4 text-sky-300" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">Copiloto Bartez</p>
              <p className="text-[10.5px] text-slate-500">Datos reales del sistema</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!hasMessages ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div>
                <Sparkles className="mx-auto mb-3 size-9 text-brand/40" strokeWidth={1.5} />
                <p className="text-[14px] font-bold text-slate-300">¿En qué te ayudo?</p>
                <p className="mt-1 text-[12px] text-slate-600">Consultá datos del negocio en lenguaje natural.</p>
              </div>
              <div className="flex w-full flex-col gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => void send(p)}
                    disabled={loading}
                    className="flex w-full items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-left text-[12.5px] font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                  >
                    <ChevronRight className="size-3.5 flex-none text-slate-500" strokeWidth={2} />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[92%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      msg.role === "user" ? "bg-brand/25 text-white" : "bg-white/[0.05] text-slate-200",
                    )}
                  >
                    {msg.content ? (
                      <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br/>"),
                        }}
                      />
                    ) : msg.role === "assistant" && loading ? (
                      <TypingDots />
                    ) : null}
                  </div>
                  {msg.role === "assistant" && (
                    <p className="mt-0.5 px-1 text-[10.5px] text-slate-600">Copiloto</p>
                  )}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex items-start">
                  <div className="rounded-xl bg-white/[0.05] px-3.5 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.08] p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 focus-within:border-brand/40">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKey}
              placeholder="Preguntame sobre leads, ventas, stock…"
              className="flex-1 resize-none bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
            />
            {loading ? (
              <button onClick={stop} className="mb-0.5 flex size-7 flex-none items-center justify-center rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25">
                <X className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={() => void send(input)}
                disabled={!input.trim()}
                className="mb-0.5 flex size-7 flex-none items-center justify-center rounded-lg bg-brand/20 text-sky-300 hover:bg-brand/30 disabled:opacity-40"
              >
                <Send className="size-3.5" />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[10.5px] text-slate-600">Enter para enviar · Shift+Enter para salto de línea</p>
        </div>
      </div>
    </>
  );
}
