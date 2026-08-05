"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const topics = ["Cotización de equipos", "Programa de revendedores", "Garantía / RMA", "Educación", "Sector público", "Servicios IT", "Otro"];
const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#0046EA] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";

export function ContactWhatsAppForm() {
  const [form, setForm] = useState({ nombre: "", empresa: "", provincia: "", tema: "Cotización de equipos", mensaje: "" });
  const [submitting, setSubmitting] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    track("contact_whatsapp_started", { topic: form.tema });
    window.open(
      buildWhatsAppUrl(form.tema === "Programa de revendedores" ? "reseller" : form.tema === "Garantía / RMA" ? "rma" : "general", [
        "Origen: pagina de contacto",
        `Tema: ${form.tema}`,
        `Nombre: ${form.nombre}`,
        form.empresa ? `Empresa: ${form.empresa}` : "",
        form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
        `Consulta: ${form.mensaje}`,
      ]),
      "_blank",
      "noopener,noreferrer"
    );
    window.setTimeout(() => setSubmitting(false), 1500);
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Preparar consulta por WhatsApp">
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Nombre</span>
        <input required value={form.nombre} onChange={(event) => update("nombre", event.target.value)} className={inputClass} placeholder="Tu nombre" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Empresa</span>
        <input value={form.empresa} onChange={(event) => update("empresa", event.target.value)} className={inputClass} placeholder="Nombre de la empresa" />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Provincia y localidad</span>
        <input value={form.provincia} onChange={(event) => update("provincia", event.target.value)} className={inputClass} placeholder="Rosario, Santa Fe" />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Sobre qué querés consultar?</span>
        <select value={form.tema} onChange={(event) => update("tema", event.target.value)} className={inputClass}>
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Mensaje</span>
        <textarea required value={form.mensaje} onChange={(event) => update("mensaje", event.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Necesidad, cantidades, plazo o contexto" />
      </label>
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="sm:col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-6 py-3.5 text-[14.5px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(255,122,24,0.9)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Abriendo WhatsApp...
          </>
        ) : (
          <>
            <MessageCircle size={18} /> Continuar por WhatsApp
          </>
        )}
      </button>
      <p className="sm:col-span-2 text-center text-[11.5px] leading-relaxed text-slate-600">Podrás revisar el mensaje completo antes de enviarlo.</p>
    </form>
  );
}
