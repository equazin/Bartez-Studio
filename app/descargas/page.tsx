import Link from "next/link";
import { ArrowRight, Download, FileText, MessageCircle, ShieldCheck } from "lucide-react";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { whatsappLinks } from "@/lib/whatsapp";

const resources = [
  {
    title: "Catálogo general B2B",
    category: "Catalogo",
    description: "Marcas y familias de productos que trabajamos para empresas, organismos y revendedores.",
    href: "/catalogo.pdf",
    icon: FileText,
    action: "Descargar catálogo",
  },
  {
    title: "Brochure institucional Bartez",
    category: "Empresa",
    description: "Presentación de capacidades, segmentos atendidos y formas de trabajo.",
    href: "/brochure.pdf",
    icon: FileText,
    action: "Descargar brochure",
  },
];

export default function Descargas() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Centro de descargas"
        title={
          <>
            Material comercial y <span className="text-[#0046EA]">documentación útil.</span>
          </>
        }
        intro="Accede a catálogos, brochure y recursos de ayuda. Las condiciones, disponibilidad y garantías se confirman para cada cotización."
        image="/photos/products/storage.jpg"
        imageAlt="Documentación comercial Bartez"
        imagePriority
        mediaLabel="Recursos B2B"
        mediaTitle="Descargas para avanzar con contexto."
        mediaSubtitle="Si necesitás una ficha o modelo puntual, escribinos y te ayudamos a encontrar la documentación."
        mediaItems={[
          { icon: FileText, title: "Catálogos", description: "Familias, marcas y soluciones." },
          { icon: ShieldCheck, title: "Soporte", description: "Garantías y RMA." },
          { icon: Download, title: "Materiales", description: "Brochure institucional." },
        ]}
        metrics={[
          { value: "PDF", label: "material descargable" },
          { value: "B2B", label: "recursos comerciales" },
          { value: "24 hs", label: "ayuda por WhatsApp" },
        ]}
        actions={[
          { label: "Consultar por WhatsApp", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Ver catálogo web", href: "/catalogo", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Archivos" title="Descargas disponibles.">
        <div className="grid gap-5">
          {resources.map((resource) => (
            <article key={resource.href} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[48px_1fr_auto] sm:items-center">
              <span className="grid size-12 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0046EA]">
                <resource.icon size={21} />
              </span>
              <div>
                <p className="text-[12px] font-bold text-[#0046EA]">{resource.category}</p>
                <h2 className="mt-1 font-display text-[19px] font-semibold text-[#11142a]">{resource.title}</h2>
                <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">{resource.description}</p>
              </div>
              <a href={resource.href} download className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(255,122,24,0.9)]">
                <Download size={15} /> {resource.action}
              </a>
            </article>
          ))}

          <article className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[48px_1fr_auto] sm:items-center">
            <span className="grid size-12 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0046EA]">
              <ShieldCheck size={21} />
            </span>
            <div>
              <p className="text-[12px] font-bold text-[#0046EA]">Soporte</p>
              <h2 className="mt-1 font-display text-[19px] font-semibold text-[#11142a]">Garantías y RMA</h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">Pasos, información necesaria y canal de inicio para cada consulta.</p>
            </div>
            <Link href="/garantias-rma" className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[13px] font-bold text-[#0046EA] hover:border-[#0046EA] hover:bg-blue-50">
              Ver guía <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </InternalSection>

      <InternalCta
        title="¿Necesitás una ficha o modelo específico?"
        intro="Indicá marca, familia, cantidad y uso previsto. El equipo comercial te ayuda a encontrar documentación y preparar cotización."
        actions={[
          { label: "Consultar por WhatsApp", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Ver marcas", href: "/marcas", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
