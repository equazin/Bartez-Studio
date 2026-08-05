"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#0046EA] focus:ring-2 focus:ring-blue-100";

export function ResellerWhatsAppForm() {
  const [form, setForm] = useState({
    empresa: "",
    cuit: "",
    nombre: "",
    telefono: "",
    email: "",
    provincia: "",
    tipo: "Tienda de informática",
    volumen: "Estoy comenzando",
    mensaje: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const details = [
      "Origen: formulario de revendedores",
      `Empresa: ${form.empresa}`,
      form.cuit ? `CUIT: ${form.cuit}` : "",
      `Contacto: ${form.nombre}`,
      `Teléfono: ${form.telefono}`,
      form.email ? `Email: ${form.email}` : "",
      form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
      `Tipo de canal: ${form.tipo}`,
      `Volumen estimado: ${form.volumen}`,
      form.mensaje ? `Información adicional: ${form.mensaje}` : "",
    ];

    track("reseller_whatsapp_started", { channel_type: form.tipo, volume: form.volumen });
    window.open(buildWhatsAppUrl("reseller", details), "_blank", "noopener,noreferrer");
    window.setTimeout(() => setSubmitting(false), 1500);
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Formulario de consulta para revendedores">
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Empresa o razón social</span>
        <input required value={form.empresa} onChange={(event) => update("empresa", event.target.value)} className={inputClass} placeholder="Nombre de la empresa" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">CUIT (opcional)</span>
        <input value={form.cuit} onChange={(event) => update("cuit", event.target.value)} className={inputClass} placeholder="30-00000000-0" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Provincia y localidad</span>
        <input value={form.provincia} onChange={(event) => update("provincia", event.target.value)} className={inputClass} placeholder="Rosario, Santa Fe" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Nombre</span>
        <input required value={form.nombre} onChange={(event) => update("nombre", event.target.value)} className={inputClass} placeholder="Tu nombre" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Teléfono / WhatsApp</span>
        <input required value={form.telefono} onChange={(event) => update("telefono", event.target.value)} className={inputClass} placeholder="+54 9 ..." />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Email corporativo (opcional)</span>
        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="nombre@empresa.com" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Tipo de canal</span>
        <select value={form.tipo} onChange={(event) => update("tipo", event.target.value)} className={inputClass}>
          {[
            "Tienda de informática",
            "Integrador de sistemas",
            "Empresa de servicios IT",
            "Distribuidor regional",
            "Profesional independiente",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Volumen mensual estimado</span>
        <select value={form.volumen} onChange={(event) => update("volumen", event.target.value)} className={inputClass}>
          {["Estoy comenzando", "Hasta 10 unidades", "11 a 30 unidades", "Más de 30 unidades"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Contanos sobre tu negocio</span>
        <textarea value={form.mensaje} onChange={(event) => update("mensaje", event.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Categorías que trabajas, mercado principal o marcas de interes" />
      </label>
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="sm:col-span-2 mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-6 py-3.5 text-[14.5px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(255,122,24,0.9)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
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
      <p className="sm:col-span-2 text-center text-[11.5px] text-slate-600">Al continuar, WhatsApp abrirá el mensaje completo para que puedas revisarlo antes de enviarlo.</p>
    </form>
  );
}
