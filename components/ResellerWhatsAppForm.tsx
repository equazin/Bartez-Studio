"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#06140d] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-slate-600 focus:border-accent focus:ring-2 focus:ring-accent/15";

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

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Formulario de consulta para revendedores">
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Empresa o razón social</span>
        <input required value={form.empresa} onChange={(event) => update("empresa", event.target.value)} className={inputClass} placeholder="Nombre de la empresa" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">CUIT (opcional)</span>
        <input value={form.cuit} onChange={(event) => update("cuit", event.target.value)} className={inputClass} placeholder="30-00000000-0" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Provincia y localidad</span>
        <input value={form.provincia} onChange={(event) => update("provincia", event.target.value)} className={inputClass} placeholder="Rosario, Santa Fe" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Nombre</span>
        <input required value={form.nombre} onChange={(event) => update("nombre", event.target.value)} className={inputClass} placeholder="Tu nombre" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Teléfono / WhatsApp</span>
        <input required value={form.telefono} onChange={(event) => update("telefono", event.target.value)} className={inputClass} placeholder="+54 9 ..." />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Email corporativo (opcional)</span>
        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="nombre@empresa.com" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Tipo de canal</span>
        <select value={form.tipo} onChange={(event) => update("tipo", event.target.value)} className={inputClass}>
          {[
            "Tienda de informática",
            "Integrador de sistemas",
            "Empresa de servicios IT",
            "Distribuidor regional",
            "Profesional independiente",
          ].map((option) => <option key={option} className="bg-[#06140d]">{option}</option>)}
        </select>
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Volumen mensual estimado</span>
        <select value={form.volumen} onChange={(event) => update("volumen", event.target.value)} className={inputClass}>
          {["Estoy comenzando", "Hasta 10 unidades", "11 a 30 unidades", "Más de 30 unidades"].map((option) => <option key={option} className="bg-[#06140d]">{option}</option>)}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Contanos sobre tu negocio</span>
        <textarea value={form.mensaje} onChange={(event) => update("mensaje", event.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Categorías que trabajás, mercado principal o marcas de interés" />
      </label>
      <button type="submit" className="sm:col-span-2 mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.01]">
        <MessageCircle size={18} /> Continuar por WhatsApp
      </button>
      <p className="sm:col-span-2 text-center text-[11.5px] text-slate-500">Al continuar, WhatsApp abrirá el mensaje completo para que puedas revisarlo antes de enviarlo.</p>
    </form>
  );
}
