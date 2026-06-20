"use client";

import { MessageCircle, FileText } from "lucide-react";
import { contact, nav } from "../constants";

export function MobileCTA() {
  const wa = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <a
        href={nav.cta.href}
        data-track="mobile_cotizar"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-[14.5px] font-semibold text-white"
      >
        <FileText size={17} /> Cotizar
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp comercial"
        data-track="mobile_whatsapp"
        className="flex items-center justify-center gap-2 rounded-xl bg-emerald px-5 py-3 text-[14.5px] font-semibold text-white"
      >
        <MessageCircle size={18} fill="currentColor" strokeWidth={0} /> WhatsApp
      </a>
    </div>
  );
}
