import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, MessageCircle } from "lucide-react";
import { contact, company } from "../../constants";
import { ConversionTracker } from "./tracker";

export const metadata: Metadata = {
  title: "¡Gracias! Recibimos tu consulta — Bartez Tecnología",
  description: "Tu consulta fue recibida. Un asesor comercial revisará el contexto y se pondrá en contacto.",
  robots: { index: false, follow: false },
};

export default function Gracias() {
  const wa = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;
  return (
    <main id="main-content" className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#070a16_0%,#11142a_100%)] px-7 text-white">
      <ConversionTracker />
      <div className="max-w-[520px] text-center">
        <span className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-full bg-[#1236d8]/15 text-[#0ea5ff]">
          <CheckCircle2 size={36} />
        </span>
        <h1 className="font-display text-[clamp(32px,5vw,50px)] font-bold leading-tight tracking-[-0.02em]">¡Gracias! Recibimos tu consulta.</h1>
        <p className="mt-5 text-[17px] text-slate-300">
          Un asesor comercial de {company.name} va a revisar el contexto y se pondrá en contacto por el canal que elegiste.
          Te enviamos una confirmación a tu email.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[15px] font-semibold transition-colors hover:border-[#0ea5ff] hover:text-[#0ea5ff]">
            <ArrowLeft size={18} /> Volver al inicio
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-105">
            <MessageCircle size={18} /> Escribir por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
