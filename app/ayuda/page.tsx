import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, MessageCircle, ShieldCheck } from "lucide-react";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { faq } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Centro de ayuda - Bartez Tecnología",
  description: "Preguntas frecuentes, garantías, RMA y canales de atención de Bartez.",
};

const helpLinks = [
  {
    href: "/garantias-rma",
    icon: ShieldCheck,
    title: "Garantías y RMA",
    description: "Pasos e información necesaria para iniciar una consulta.",
    action: "Ver guía",
  },
  {
    href: "/descargas",
    icon: HelpCircle,
    title: "Documentación y recursos",
    description: "Catálogos, brochure y materiales disponibles.",
    action: "Ver recursos",
  },
];

export default function AyudaPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Centro de ayuda"
        title={
          <>
            Respuestas para avanzar <span className="text-[#0046EA]">con claridad.</span>
          </>
        }
        intro="Información comercial y de soporte para avanzar con claridad. Si tu caso depende de un modelo u operación específica, escribinos por WhatsApp."
        image="/photos/engineer.jpg"
        imageAlt="Soporte Bartez"
        imagePriority
        mediaLabel="Ayuda comercial"
        mediaTitle="Canales directos para resolver dudas."
        mediaSubtitle="Garantías, descargas, consultas comerciales y orientación técnica."
        mediaItems={[
          { icon: ShieldCheck, title: "RMA", description: "Pasos para garantía." },
          { icon: HelpCircle, title: "FAQs", description: "Preguntas frecuentes." },
          { icon: MessageCircle, title: "WhatsApp", description: "Consulta directa." },
        ]}
        metrics={[
          { value: "24 hs", label: "respuesta hábil" },
          { value: "B2B", label: "soporte comercial" },
          { value: "ARG", label: "atención nacional" },
        ]}
        actions={[
          { label: "Hacer una consulta", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ver descargas", href: "/descargas", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Accesos rapidos" title="Elegí el camino más directo.">
        <div className="grid gap-5 md:grid-cols-2">
          {helpLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
              <item.icon className="size-7 text-[#0046EA]" strokeWidth={1.7} />
              <h2 className="mt-5 font-display text-[20px] font-extrabold text-[#11142a]">{item.title}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0046EA]">
                {item.action} <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </InternalSection>

      <InternalSection tone="white" eyebrow="Preguntas frecuentes" title="Lo que más nos consultan.">
        <div className="grid gap-5 lg:grid-cols-2">
          {faq.items.map((item) => (
            <article key={item.q} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-[16px] font-extrabold text-[#11142a]">{item.q}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{item.a}</p>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalCta
        title="Tu consulta no aparece acá?"
        intro="Escribinos por WhatsApp con el contexto y te respondemos por el canal más directo."
        actions={[
          { label: "Hacer otra consulta", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ir a contacto", href: "/contacto", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
