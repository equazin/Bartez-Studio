"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { contact } from "../constants";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Aparece el botón flotante después de 3s
    const buttonTimer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    // Auto-abre el tooltip después de 5s
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => {
      clearTimeout(buttonTimer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  if (!visible) return null;

  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
      {/* Tooltip comercial */}
      {showTooltip && (
        <div className="relative flex max-w-[280px] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-card animate-fade-up text-slate-800">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            aria-label="Cerrar ayuda"
          >
            <X size={15} />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Asistencia Comercial
          </span>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
            ¿Necesitás asesoramiento inmediato? Chateá con un asesor técnico ahora.
          </p>
          <span className="mt-2 text-[11px] text-slate-400">
            {contact.hours}
          </span>
        </div>
      )}

      {/* Botón WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_float_click"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-white shadow-glow transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat por WhatsApp con un asesor"
      >
        {/* Anillo de pulso animado */}
        <span className="absolute -inset-1.5 animate-ping rounded-full bg-emerald/30 opacity-75 duration-1000" />
        <MessageCircle size={26} className="relative z-10" />
      </a>
    </div>
  );
}
