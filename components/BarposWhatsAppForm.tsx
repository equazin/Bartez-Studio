"use client";

import { MessageCircle } from "lucide-react";
import type { MouseEvent } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const businessTypes = [
  "Minisuper / autoservicio",
  "Despensa / almacen",
  "Panaderia",
  "Bar / gastronomia",
  "Mayorista / distribuidor",
  "Otro comercio",
];

const roles = [
  "Quiero equipar mi negocio",
  "Quiero revender BarPOS",
  "Tengo varias sucursales",
];

const quantities = [
  "1 punto de venta",
  "2 a 3 puntos de venta",
  "4 o mas puntos de venta",
  "Red de distribuidores",
];

const implementationOptions = [
  "Si, necesito instalacion e implementacion",
  "Solo quiero cotizar el equipamiento",
  "Quiero consultar condiciones para revender",
];

function buildFormHref(form: HTMLFormElement) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const email = String(data.get("email") || "").trim();
  const role = String(data.get("role") || roles[0]);
  const businessType = String(data.get("businessType") || businessTypes[0]);
  const city = String(data.get("city") || "").trim();
  const quantity = String(data.get("quantity") || quantities[0]);
  const needsImplementation = String(data.get("needsImplementation") || implementationOptions[0]);
  const notes = String(data.get("notes") || "").trim();

  return buildWhatsAppUrl("barpos", [
    name ? `Nombre: ${name}` : null,
    phone ? `Telefono / WhatsApp: ${phone}` : null,
    email ? `Email: ${email}` : null,
    `Perfil: ${role}`,
    `Rubro: ${businessType}`,
    city ? `Localidad/provincia: ${city}` : "Localidad/provincia: a confirmar",
    `Cantidad estimada: ${quantity}`,
    `Instalacion: ${needsImplementation}`,
    notes ? `Comentario: ${notes}` : null,
    "Origen: landing BarPOS 4.0",
  ]);
}

export function BarposWhatsAppForm() {
  const fallbackHref = buildWhatsAppUrl("barpos", [
    `Perfil: ${roles[0]}`,
    `Rubro: ${businessTypes[0]}`,
    "Localidad/provincia: a confirmar",
    `Cantidad estimada: ${quantities[0]}`,
    `Instalacion: ${implementationOptions[0]}`,
    "Origen: landing BarPOS 4.0",
  ]);

  const updateHrefFromForm = (event: MouseEvent<HTMLAnchorElement>) => {
    const form = event.currentTarget.closest("form");
    if (form instanceof HTMLFormElement) {
      event.currentTarget.href = buildFormHref(form);
    }
  };

  return (
    <form>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Nombre y apellido
          <input name="name" placeholder="Nombre y apellido" className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100" />
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Telefono / WhatsApp
          <input name="phone" placeholder="Telefono / WhatsApp" className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100" />
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Email
          <input name="email" type="email" placeholder="Email" className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100" />
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Localidad y provincia
          <input name="city" placeholder="Localidad y provincia" className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100" />
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Tipo de consulta
          <select name="role" defaultValue={roles[0]} className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100">
            {roles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Cantidad estimada
          <select name="quantity" defaultValue={quantities[0]} className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100">
            {quantities.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Rubro
          <select name="businessType" defaultValue={businessTypes[0]} className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100">
            {businessTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
          Implementacion
          <select name="needsImplementation" defaultValue={implementationOptions[0]} className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100">
            {implementationOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500 sm:col-span-2">
          Comentanos tu necesidad (opcional)
          <textarea name="notes" rows={4} placeholder="Ej: necesito factura A, formas de pago, entrega en zona, integracion con controladora fiscal..." className="w-full min-w-0 resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#1236d8] focus:ring-4 focus:ring-blue-100" />
        </label>
      </div>

      <a href={fallbackHref} onPointerDown={updateHrefFromForm} onClick={updateHrefFromForm} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7718,#ff8f1f,#ffb000)] px-5 py-3.5 text-[14px] font-extrabold text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] transition hover:-translate-y-0.5">
        <MessageCircle size={18} /> Enviar consulta por WhatsApp
      </a>

      <p className="mt-4 text-[11.5px] leading-relaxed text-slate-500">
        Te vamos a redirigir a WhatsApp con tu consulta lista para que podamos responderte mas rapido.
      </p>
    </form>
  );
}
