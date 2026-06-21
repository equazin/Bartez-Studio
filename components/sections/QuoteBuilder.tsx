"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Minus, Plus, Loader2, MessageCircle, Trash2 } from "lucide-react";
import { quote, contact } from "../../constants";
import { Icon } from "../icons";
import { track } from "../Analytics";

type Sel = Record<string, { qty: number; variant?: string }>;

export function QuoteBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Sel>({});
  const [urgencia, setUrgencia] = useState(quote.urgencias[0]);
  const [form, setForm] = useState({ empresa: "", nombre: "", email: "", telefono: "", mensaje: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const selectedCats = useMemo(() => quote.categories.filter((c) => sel[c.id]), [sel]);
  const count = selectedCats.length;

  const toggle = (c: (typeof quote.categories)[number]) =>
    setSel((s) => {
      const next = { ...s };
      if (next[c.id]) delete next[c.id];
      else next[c.id] = { qty: 1, variant: "" };
      return next;
    });

  const setQty = (id: string, d: number) =>
    setSel((s) => ({ ...s, [id]: { ...s[id], qty: Math.max(1, (s[id]?.qty ?? 1) + d) } }));
  const setVariant = (id: string, v: string) => setSel((s) => ({ ...s, [id]: { ...s[id], variant: v } }));
  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const items = selectedCats.map((c) => ({ label: c.label, qty: sel[c.id].qty, variant: sel[c.id].variant }));
  const summaryText = items.map((it) => `${it.label}${it.variant ? ` (${it.variant})` : ""} x${it.qty}`).join("; ");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tipoConsulta: "cotizacion",
          origen: "quote-builder",
          items,
          urgencia,
          mensaje: [`Pedido: ${summaryText}`, `Urgencia: ${urgencia}`, form.mensaje].filter(Boolean).join("\n"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data?.error || "No pudimos enviar tu cotización. Probá de nuevo.");
        return;
      }
      track("generate_lead", { origen: "quote-builder", items: count });
      router.push("/gracias");
    } catch {
      setStatus("error");
      setError("Error de conexión. Probá por WhatsApp.");
    }
  }

  const waHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    `Hola, vengo de la web y quiero cotizar:\n${summaryText}\nUrgencia: ${urgencia}`
  )}`;

  const next = () => {
    if (step === 0) track("quote_start", { items: count });
    setStep((s) => Math.min(2, s + 1));
  };

  return (
    <section id="cotiza" className="scroll-mt-24 bg-slate-50 py-24">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="mb-10 max-w-[680px]">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
            <span className="font-mono text-slate-400">{quote.num}</span> {quote.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-[clamp(28px,3.8vw,46px)] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance">
            {quote.title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-600">{quote.desc}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Builder */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft md:p-9">
            {/* progress */}
            <div className="mb-8 flex items-center gap-2">
              {quote.steps.map((label, i) => (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <span className={`grid h-8 w-8 flex-none place-items-center rounded-full text-[13px] font-bold transition-colors ${i <= step ? "bg-brand text-white" : "bg-slate-100 text-slate-400"}`}>
                    {i < step ? <Check size={15} /> : i + 1}
                  </span>
                  <span className={`hidden text-[13px] font-medium sm:block ${i <= step ? "text-ink" : "text-slate-400"}`}>{label}</span>
                  {i < quote.steps.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-brand" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>

            {/* Step 0 — categorías */}
            {step === 0 && (
              <div>
                <h3 className="mb-4 font-display text-[18px] font-bold text-ink">¿Qué necesitás cotizar?</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {quote.categories.map((c) => {
                    const active = !!sel[c.id];
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle(c)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${active ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-slate-200 hover:border-brand/40"}`}
                      >
                        <span className={`grid h-10 w-10 flex-none place-items-center rounded-lg ${active ? "bg-brand text-white" : "bg-slate-100 text-brand"}`}>
                          <Icon name={c.icon} className="h-5 w-5" />
                        </span>
                        <span className="text-[14.5px] font-semibold text-ink">{c.label}</span>
                        <span className={`ml-auto grid h-5 w-5 place-items-center rounded-full border ${active ? "border-brand bg-brand text-white" : "border-slate-300"}`}>
                          {active && <Check size={13} strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1 — cantidades */}
            {step === 1 && (
              <div>
                <h3 className="mb-1 font-display text-[18px] font-bold text-ink">Cantidades y modelos</h3>
                <p className="mb-4 text-[13px] text-slate-500">Indicá cantidad y, si ya sabés el modelo, especificalo. Si no, lo definimos juntos.</p>
                <div className="space-y-3">
                  {selectedCats.map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-200 p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-slate-100 text-brand">
                          <Icon name={c.icon} className="h-5 w-5" />
                        </span>
                        <span className="text-[14.5px] font-semibold text-ink">{c.label}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <button type="button" onClick={() => setQty(c.id, -1)} aria-label="Menos" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-brand hover:text-brand">
                            <Minus size={15} />
                          </button>
                          <span className="w-8 text-center font-semibold text-ink">{sel[c.id].qty}</span>
                          <button type="button" onClick={() => setQty(c.id, 1)} aria-label="Más" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-brand hover:text-brand">
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2.5 sm:pl-12">
                        <input
                          list={`sug-${c.id}`}
                          value={sel[c.id].variant || ""}
                          onChange={(e) => setVariant(c.id, e.target.value)}
                          placeholder={quote.detailLabel}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13.5px] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                        />
                        {c.suggestions && (
                          <datalist id={`sug-${c.id}`}>
                            {c.suggestions.map((s) => (
                              <option key={s} value={s} />
                            ))}
                          </datalist>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <label className="mt-5 block">
                  <span className="text-[13px] font-semibold text-slate-600">¿Para cuándo lo necesitás?</span>
                  <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14.5px] focus:border-brand focus:outline-none">
                    {quote.urgencias.map((u) => (<option key={u}>{u}</option>))}
                  </select>
                </label>
              </div>
            )}

            {/* Step 2 — datos */}
            {step === 2 && (
              <form onSubmit={submit} noValidate>
                <h3 className="mb-4 font-display text-[18px] font-bold text-ink">¿A quién le enviamos la cotización?</h3>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => upd("website", e.target.value)} className="hidden" aria-hidden />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required placeholder="Empresa *" value={form.empresa} onChange={(e) => upd("empresa", e.target.value)} className="qb-input" />
                  <input required placeholder="Nombre *" value={form.nombre} onChange={(e) => upd("nombre", e.target.value)} className="qb-input" />
                  <input required type="email" placeholder="Email corporativo *" value={form.email} onChange={(e) => upd("email", e.target.value)} className="qb-input" />
                  <input placeholder="Teléfono" value={form.telefono} onChange={(e) => upd("telefono", e.target.value)} className="qb-input" />
                  <textarea rows={2} placeholder="Notas (opcional)" value={form.mensaje} onChange={(e) => upd("mensaje", e.target.value)} className="qb-input resize-none sm:col-span-2" />
                </div>
                {status === "error" && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-[13.5px] text-red-700">{error}</p>}
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <button type="submit" disabled={status === "loading"} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-brand-bright hover:shadow-glow disabled:opacity-70" data-track="quote_submit">
                    {status === "loading" ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : <>Enviar cotización <ArrowRight size={18} /></>}
                  </button>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-emerald px-6 py-3.5 text-[15px] font-semibold text-emerald transition-colors hover:bg-emerald hover:text-white" data-track="quote_whatsapp">
                    <MessageCircle size={18} /> Por WhatsApp
                  </a>
                </div>
              </form>
            )}

            {/* nav */}
            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className={`inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-500 hover:text-ink ${step === 0 ? "invisible" : ""}`}>
                <ArrowLeft size={16} /> Atrás
              </button>
              {step < 2 && (
                <button type="button" onClick={next} disabled={count === 0} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:bg-brand-bright disabled:opacity-50">
                  Continuar <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>

          {/* Resumen / carrito */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-soft lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[17px] font-bold text-ink">Tu cotización</h3>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[12px] font-semibold text-brand">{count} ítem{count === 1 ? "" : "s"}</span>
            </div>
            {count === 0 ? (
              <p className="mt-6 text-[14px] text-slate-500">Elegí al menos una categoría para empezar.</p>
            ) : (
              <ul className="mt-5 space-y-2.5">
                {selectedCats.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
                    <Icon name={c.icon} className="h-4 w-4 flex-none text-brand" />
                    <span className="text-[13.5px] font-medium text-ink">
                      {c.label}{sel[c.id].variant ? ` · ${sel[c.id].variant}` : ""}
                    </span>
                    <span className="ml-auto text-[13px] font-semibold text-slate-500">x{sel[c.id].qty}</span>
                    <button type="button" onClick={() => toggle(c)} aria-label="Quitar" className="text-slate-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-6 text-[12.5px] leading-relaxed text-slate-400">
              Sin compromiso. Te enviamos una propuesta formal con precios mayoristas en 24 hs hábiles.
            </p>
          </aside>
        </div>
      </div>

      <style>{`.qb-input{font-family:inherit;font-size:14.5px;width:100%;padding:11px 14px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;color:#0f172a;transition:.2s}
      .qb-input:focus{outline:none;border-color:#14532d;box-shadow:0 0 0 3px rgba(34,197,94,.18)}`}</style>
    </section>
  );
}
