import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Mail, MessageCircle } from "lucide-react";
import { InternalPageShell } from "@/components/InternalPage";
import { RmaCaseIdDisplay } from "@/components/RmaCaseIdDisplay";
import { company, contact } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Caso de RMA recibido - Bartez Tecnología",
  description: "Recibimos tu caso de RMA / garantía. Te respondemos en 48 hs hábiles.",
  alternates: { canonical: "/garantias-rma/gracias" },
  robots: { index: false, follow: false },
};

export default function GraciasRmaPage() {
  return (
    <InternalPageShell>
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-blue-50 text-[#0046EA]">
            <CheckCircle2 size={32} strokeWidth={1.7} />
          </div>

          <h1 className="mt-6 font-display text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#11142a]">
            Recibimos tu caso.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Guardamos toda la información que enviaste. Un miembro del equipo técnico va a responderte por email o WhatsApp en 48 hs hábiles con la evaluación inicial del caso y los próximos pasos.
          </p>

          <Suspense fallback={null}>
            <RmaCaseIdDisplay />
          </Suspense>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {[
              { icon: Clock, title: "48 hs", text: "Respuesta inicial hábil" },
              { icon: Mail, title: "Email + WhatsApp", text: "Los dos canales" },
              { icon: CheckCircle2, title: "Sin mezcla", text: "Flujo separado del comercial" },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
                <item.icon className="size-5 text-[#0046EA]" strokeWidth={1.8} />
                <p className="mt-3 text-[13px] font-bold text-[#11142a]">{item.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[13px] leading-relaxed text-slate-600">
              Si querés adelantar información (foto del equipo, log de error, más contexto), escribinos con el número de caso arriba:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLinks.rma}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-5 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#0EA371]"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={`mailto:${contact.email}?subject=Caso%20de%20RMA`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#0046EA] bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#0046EA] transition hover:bg-blue-50"
              >
                <Mail size={15} /> {contact.email}
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 transition hover:text-[#0046EA]"
            >
              Volver al inicio de {company.shortName} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </InternalPageShell>
  );
}
