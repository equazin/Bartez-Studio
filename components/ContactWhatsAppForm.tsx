"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { track } from "@/components/Analytics";

const topics = ["Cotización de equipos", "Programa de revendedores", "Garantía / RMA", "Educación", "Sector público", "Servicios IT", "Otro"];
const inputClass = "w-full rounded-xl border border-white/10 bg-[#06140d] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-slate-600 focus:border-accent focus:ring-2 focus:ring-accent/15";

export function ContactWhatsAppForm() {
  const [form, setForm] = useState({ nombre: "", empresa: "", provincia: "", tema: "Cotización de equipos", mensaje: "" });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track("contact_whatsapp_started", { topic: form.tema });
    window.open(buildWhatsAppUrl(form.tema === "Programa de revendedores" ? "reseller" : form.tema === "Garantía / RMA" ? "rma" : "general", [
      "Origen: página de contacto",
      `Tema: ${form.tema}`,
      `Nombre: ${form.nombre}`,
      form.empresa ? `Empresa: ${form.empresa}` : "",
      form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
      `Consulta: ${form.mensaje}`,
    ]), "_blank", "noopener,noreferrer");
  }

  return <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Preparar consulta por WhatsApp">
    <label><span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Nombre</span><input required value={form.nombre} onChange={(event) => update("nombre", event.target.value)} className={inputClass} placeholder="Tu nombre" /></label>
    <label><span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Empresa</span><input value={form.empresa} onChange={(event) => update("empresa", event.target.value)} className={inputClass} placeholder="Nombre de la empresa" /></label>
    <label className="sm:col-span-2"><span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Provincia y localidad</span><input value={form.provincia} onChange={(event) => update("provincia", event.target.value)} className={inputClass} placeholder="Rosario, Santa Fe" /></label>
    <label className="sm:col-span-2"><span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">¿Sobre qué querés consultar?</span><select value={form.tema} onChange={(event) => update("tema", event.target.value)} className={inputClass}>{topics.map((topic) => <option key={topic} className="bg-[#06140d]">{topic}</option>)}</select></label>
    <label className="sm:col-span-2"><span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Mensaje</span><textarea required value={form.mensaje} onChange={(event) => update("mensaje", event.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Necesidad, cantidades, plazo o contexto" /></label>
    <button type="submit" className="sm:col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.01]"><MessageCircle size={18} /> Continuar por WhatsApp</button>
    <p className="sm:col-span-2 text-center text-[11.5px] leading-relaxed text-slate-500">Podrás revisar el mensaje completo antes de enviarlo.</p>
  </form>;
}
