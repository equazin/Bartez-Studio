"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { whatsappLinks } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLinks.general}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_float_click"
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#70f2a4] bg-[#22dc6c] px-4 text-[13px] font-extrabold text-[#02170b] shadow-[0_12px_35px_rgba(0,0,0,0.45)] transition hover:scale-[1.03] hover:bg-[#4ade80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:bottom-6 sm:right-6 sm:px-5"
      aria-label="Hablar con Bartez por WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Hablar por WhatsApp</span>
    </a>
  );
}
