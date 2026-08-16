import type { Metadata } from "next";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company } from "@/constants";
import { allFaqs, faqCategories } from "@/lib/faqs-hub";
import { safeJsonLd } from "@/lib/json-ld";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Preguntas frecuentes B2B IT | Bartez Tecnología",
  description:
    "Todas las dudas frecuentes sobre proceso de compra, proyectos corporativos, sector público, garantías, workstations por software y canal de revendedores en un solo lugar.",
  alternates: { canonical: "/preguntas-frecuentes" },
  openGraph: {
    title: "Preguntas frecuentes B2B IT | Bartez Tecnología",
    description:
      "Compra corporativa, licitaciones, workstations profesionales, RMA, servicios llave en mano y canal — respuestas rápidas por categoría.",
    url: `${company.url}/preguntas-frecuentes`,
    type: "website",
  },
};

export default function PreguntasFrecuentesPage() {
  const faqs = allFaqs();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: company.url },
      { "@type": "ListItem", position: 2, name: "Preguntas frecuentes", item: `${company.url}/preguntas-frecuentes` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <InternalPageShell>
        <InternalHero
          eyebrow="Preguntas frecuentes"
          title={
            <>
              Todas las dudas <span className="text-[#0046EA]">B2B IT</span> en un solo lugar.
            </>
          }
          intro={`${faqs.length} preguntas frecuentes sobre proceso de compra, proyectos corporativos, sector público, workstations por software, garantías/RMA y canal de revendedores. Agrupadas por categoría para navegar rápido.`}
          image="/photos/office.jpg"
          imageAlt="Consultas B2B IT respondidas"
          imagePriority
          mediaLabel="FAQ Hub"
          mediaTitle="Respuestas concretas, sin promesas infladas."
          mediaSubtitle="Si no encontrás la respuesta, escribinos por WhatsApp y respondemos en 24 hs hábiles."
          mediaItems={faqCategories.slice(0, 3).map((cat) => ({
            title: cat.title,
            description: `${cat.faqs.length} preguntas`,
          }))}
          metrics={[
            { value: `${faqs.length}`, label: "preguntas respondidas" },
            { value: `${faqCategories.length}`, label: "categorías" },
            { value: "24 hs", label: "respuesta hábil" },
          ]}
          actions={[
            { label: "Escribinos por WhatsApp", href: whatsappLinks.general, external: true, icon: MessageCircle },
            { label: "Ir a contacto", href: "/contacto", variant: "secondary", icon: ArrowRight },
          ]}
        />

        <InternalSection
          tone="soft"
          eyebrow="Índice"
          title="Categorías."
          intro="Saltá directo a la sección que te interese. Todas las respuestas incluyen link a la página específica cuando aplica."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {faqCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200"
              >
                <span className="grid size-8 flex-none place-items-center rounded-md bg-blue-50 text-[11px] font-bold text-[#0046EA]">
                  {cat.faqs.length}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[14.5px] font-semibold leading-tight text-[#11142a]">
                    {cat.title}
                  </p>
                  {cat.intro ? (
                    <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                      {cat.intro}
                    </p>
                  ) : null}
                </div>
                <ChevronDown className="size-4 flex-none text-slate-400 transition-transform group-hover:translate-y-0.5 group-hover:text-[#0046EA]" />
              </a>
            ))}
          </div>
        </InternalSection>

        {faqCategories.map((cat) => (
          <InternalSection
            key={cat.id}
            tone="white"
            eyebrow={cat.title}
            title={cat.title}
            intro={cat.intro}
          >
            <div id={cat.id} className="scroll-mt-24 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
              {cat.faqs.map((faq, idx) => (
                <details
                  key={`${cat.id}-${idx}`}
                  className="group px-6 py-4 open:bg-blue-50/40"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <h3 className="font-display text-[15.5px] font-semibold text-[#11142a]">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className="mt-1 size-4 flex-none text-[#0046EA] transition-transform group-open:rotate-180"
                      strokeWidth={2}
                    />
                  </summary>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-700">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </InternalSection>
        ))}

        <InternalCta
          title="¿No encontraste la respuesta que buscabas?"
          intro="Escribinos por WhatsApp con la consulta específica. Un asesor comercial o técnico responde en 24 hs hábiles."
          actions={[
            { label: "Hablar por WhatsApp", href: whatsappLinks.general, external: true, icon: MessageCircle },
            { label: "Ir a contacto", href: "/contacto", variant: "secondary", icon: ArrowRight },
          ]}
        />
      </InternalPageShell>
    </>
  );
}
