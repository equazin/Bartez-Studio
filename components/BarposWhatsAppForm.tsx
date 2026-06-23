"use client";

import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const businessTypes = [
  "Minisúper / autoservicio",
  "Despensa / almacén",
  "Panadería",
  "Bar / gastronomía",
  "Mayorista / distribuidor",
  "Otro comercio",
];

const roles = [
  "Quiero equipar mi negocio",
  "Quiero revender BarPOS",
  "Tengo varias sucursales",
];

export function BarposWhatsAppForm() {
  const [role, setRole] = useState(roles[0]);
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [city, setCity] = useState("");
  const [quantity, setQuantity] = useState("1 punto de venta");
  const [needsImplementation, setNeedsImplementation] = useState("Sí, necesito instalación e implementación");
  const [notes, setNotes] = useState("");

  const whatsappHref = useMemo(
    () =>
      buildWhatsAppUrl("barpos", [
        `Perfil: ${role}`,
        `Rubro: ${businessType}`,
        city ? `Localidad/provincia: ${city}` : "Localidad/provincia: a confirmar",
        `Cantidad estimada: ${quantity}`,
        `Instalación: ${needsImplementation}`,
        notes ? `Comentario: ${notes}` : null,
        "Origen: landing BarPOS 4.0",
      ]),
    [businessType, city, needsImplementation, notes, quantity, role],
  );

  return (
    <form className="border border-white/10 bg-[#06140d] p-6 shadow-2xl shadow-black/20 md:p-7">
      <h2 className="font-display text-[24px] font-bold tracking-[-0.03em] text-white">Pedí una propuesta BarPOS</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">
        Completá estos datos y abrimos WhatsApp con la consulta lista para que ventas responda más rápido.
      </p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Tipo de consulta
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-lg border border-white/10 bg-[#030c07] px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-white outline-none focus:border-accent">
            {roles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Rubro
          <select value={businessType} onChange={(event) => setBusinessType(event.target.value)} className="rounded-lg border border-white/10 bg-[#030c07] px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-white outline-none focus:border-accent">
            {businessTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Localidad y provincia
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ej: Rosario, Santa Fe" className="rounded-lg border border-white/10 bg-[#030c07] px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-white outline-none placeholder:text-slate-600 focus:border-accent" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Cantidad
            <select value={quantity} onChange={(event) => setQuantity(event.target.value)} className="rounded-lg border border-white/10 bg-[#030c07] px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-white outline-none focus:border-accent">
              <option>1 punto de venta</option>
              <option>2 a 3 puntos de venta</option>
              <option>4 o más puntos de venta</option>
              <option>Red de distribuidores</option>
            </select>
          </label>

          <label className="grid gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Implementación
            <select value={needsImplementation} onChange={(event) => setNeedsImplementation(event.target.value)} className="rounded-lg border border-white/10 bg-[#030c07] px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-white outline-none focus:border-accent">
              <option>Sí, necesito instalación e implementación</option>
              <option>Solo quiero cotizar el equipamiento</option>
              <option>Quiero consultar condiciones para revender</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Comentario opcional
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Ej: necesito factura A, formas de pago, entrega en zona, integración con controladora fiscal..." className="resize-none rounded-lg border border-white/10 bg-[#030c07] px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-white outline-none placeholder:text-slate-600 focus:border-accent" />
        </label>
      </div>

      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-[14px] font-bold text-ink transition hover:scale-[1.01]">
        <MessageCircle size={18} /> Consultar BarPOS por WhatsApp
      </a>

      <p className="mt-4 text-[11.5px] leading-relaxed text-slate-500">
        No enviamos datos a una base externa desde este formulario: solamente prepara el mensaje para WhatsApp.
      </p>
    </form>
  );
}
