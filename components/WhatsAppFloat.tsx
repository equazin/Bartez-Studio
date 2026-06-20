"use client";

import { MessageCircle } from "lucide-react";
import { contact } from "../constants";

export function WhatsAppFloat() {
  const href = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp con un asesor comercial"
      className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-emerald text-white shadow-[0_14px_30px_-8px_rgba(16,185,129,.6)] transition-all hover:scale-110"
    >
      <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
    </a>
  );
}
