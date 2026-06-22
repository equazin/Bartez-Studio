import { MessageCircle } from "lucide-react";
import { whatsappLinks } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLinks.general}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_float_click"
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-[#16a34a] px-4 text-[13px] font-bold text-white shadow-2xl transition-transform hover:scale-[1.03] sm:bottom-6 sm:right-6 sm:px-5"
      aria-label="Hablar con Bartez por WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Hablar por WhatsApp</span>
    </a>
  );
}
