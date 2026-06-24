import type { Metadata } from "next";
import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company, contact } from "@/constants";
import { Map } from "@/components/Map";
import { ContactWhatsAppForm } from "@/components/ContactWhatsAppForm";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto - Bartez Tecnología",
  description:
    "Contacta a Bartez Tecnología por WhatsApp, email o teléfono. Estamos en Rosario, Santa Fe, con atención a todo el país. Respondemos en 24 hs hábiles.",
};

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: contact.phoneDisplay,
    sub: "Respuesta rapida en horario comercial",
    href: whatsappLinks.general,
    cta: "Escribir por WhatsApp",
  },
  {
    icon: Mail,
    title: "Email",
    value: contact.email,
    sub: "Para consultas formales y cotizaciones",
    href: `mailto:${contact.email}`,
    cta: "Enviar email",
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: contact.phoneDisplay,
    sub: contact.hours,
    href: `tel:${contact.phoneDisplay.replace(/\s/g, "")}`,
    cta: "Llamar ahora",
  },
];

export default function ContactoPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Contacto directo"
        title={
          <>
            Hablemos de lo que <span className="text-[#1236d8]">necesitás.</span>
          </>
        }
        intro="Estamos en Rosario, Santa Fe, atendiendo clientes en toda Argentina. Elegí el canal que prefieras y respondemos en 24 hs hábiles."
        actions={[
          { label: "Escribir por WhatsApp", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Enviar email", href: `mailto:${contact.email}`, variant: "secondary", icon: Mail },
        ]}
        metrics={[
          { value: "24 hs", label: "respuesta hábil" },
          { value: "9-18", label: "horario comercial" },
          { value: "ARG", label: "atención nacional" },
        ]}
      >
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_28px_70px_-46px_rgba(17,20,42,0.42)]">
          <p className="text-[13px] font-bold text-[#1236d8]">Rosario, Santa Fe</p>
          <h2 className="mt-2 font-display text-[26px] font-extrabold text-[#11142a]">Contacto comercial y soporte.</h2>
          <div className="mt-6 grid gap-4">
            <div className="flex gap-3 border-b border-slate-200 pb-4">
              <MapPin className="mt-0.5 size-5 flex-none text-[#1236d8]" strokeWidth={1.7} />
              <div>
                <p className="font-bold text-[#11142a]">{company.address}</p>
                <p className="text-[13px] text-slate-500">Rosario, Santa Fe, Argentina</p>
              </div>
            </div>
            <div className="flex gap-3 border-b border-slate-200 pb-4">
              <Clock3 className="mt-0.5 size-5 flex-none text-[#1236d8]" strokeWidth={1.7} />
              <div>
                <p className="font-bold text-[#11142a]">{contact.hours}</p>
                <p className="text-[13px] text-slate-500">Respondemos consultas comerciales y técnicas.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 size-5 flex-none text-[#1236d8]" strokeWidth={1.7} />
              <div>
                <p className="font-bold text-[#11142a]">{contact.phoneDisplay}</p>
                <p className="text-[13px] text-slate-500">WhatsApp y teléfono comercial.</p>
              </div>
            </div>
          </div>
        </div>
      </InternalHero>

      <InternalSection tone="soft" eyebrow="Canales disponibles" title="Elegí como querés avanzar.">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((ch) => (
            <article key={ch.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
              <ch.icon className="size-7 text-[#1236d8]" strokeWidth={1.7} />
              <h2 className="mt-5 font-display text-[19px] font-extrabold text-[#11142a]">{ch.title}</h2>
              <p className="mt-1 text-[14px] font-bold text-slate-700">{ch.value}</p>
              <p className="mt-1 text-[12.5px] text-slate-500">{ch.sub}</p>
              <a
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1236d8] hover:underline"
              >
                {ch.cta} <ArrowRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Consulta guíada"
        title="Mandaños el contexto y dejamos armado el mensaje."
        intro="El formulario abre WhatsApp con la consulta lista para revisar antes de enviarla."
      >
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-48px_rgba(17,20,42,0.42)] md:p-8">
            <h2 className="font-display text-[22px] font-extrabold text-[#11142a]">Prepara tu consulta</h2>
            <p className="mt-2 text-[13.5px] text-slate-600">Sin compromiso. Respondemos en 24 hs hábiles.</p>
            <ContactWhatsAppForm />
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <Map />
              <div className="border-t border-slate-200 bg-[#f7f9fc] px-5 py-3">
                <p className="text-[12px] font-semibold text-slate-600">{company.address}, Rosario, Santa Fe</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f7f9fc] p-6">
              <p className="text-[13px] font-bold text-[#1236d8]">Atencion nacional</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-slate-700">
                Aunque nuestra sede está en Rosario, coordinamos proyectos y entregas en toda la Argentina.
              </p>
              <a
                href={whatsappLinks.quote}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1236d8] hover:underline"
              >
                Solicitar presupuesto <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </InternalSection>
    </InternalPageShell>
  );
}
