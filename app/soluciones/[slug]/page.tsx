import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardList, FileText, MessageCircle, MessagesSquare, Rocket } from "lucide-react";
import { company, verticals } from "@/constants";
import { getDynamicPartners } from "@/lib/db-content";
import { safeJsonLd } from "@/lib/json-ld";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { Icon } from "@/components/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const processSteps = [
  { icon: MessagesSquare, title: "Contaños el desafio", description: "Nos compartis qué necesitás resolver y cuales son tus prioridades." },
  { icon: ClipboardList, title: "Evaluamos la necesidad", description: "Analizamos el entorno y relevamos los requerimientos clave." },
  { icon: FileText, title: "Presentamos la propuesta", description: "Diseñamos una solución y una propuesta de trabajo clara." },
  { icon: Rocket, title: "Implementamos y acompañamos", description: "Coordinamos la puesta en marcha y el seguimiento." },
];

export function generateStaticParams() {
  return verticals.map((vertical) => ({ slug: vertical.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vertical = verticals.find((item) => item.slug === slug);
  if (!vertical) return {};
  const url = `${company.url}/soluciones/${vertical.slug}`;
  return {
    title: vertical.metaTitle,
    description: vertical.metaDescription,
    keywords: vertical.keywords,
    alternates: { canonical: `/soluciones/${vertical.slug}` },
    openGraph: { title: vertical.metaTitle, description: vertical.metaDescription, url, type: "website" },
  };
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = verticals.find((item) => item.slug === slug);
  if (!vertical) notFound();

  const brands = await getDynamicPartners();
  const related = vertical.related
    .map((relatedSlug) => verticals.find((item) => item.slug === relatedSlug))
    .filter(Boolean) as typeof verticals;

  const whatsappHref = buildWhatsAppUrl("quote", [`Solución de interes: ${vertical.navLabel}`, "Origen: pagina de solución"]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vertical.faqs.map((item) => ({
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
      { "@type": "ListItem", position: 2, name: "Soluciones", item: `${company.url}/#soluciones` },
      { "@type": "ListItem", position: 3, name: vertical.navLabel, item: `${company.url}/soluciones/${vertical.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <InternalPageShell>
        <InternalHero
          eyebrow={vertical.eyebrow}
          title={vertical.h1}
          intro={vertical.intro}
          image={vertical.image}
          imageAlt={vertical.navLabel}
          imagePriority
          mediaLabel="Soluciones B2B"
          mediaTitle="Alcance definido para tu contexto."
          mediaSubtitle="Partimos de usuarios, sedes, criticidad y presupuesto antes de cerrar la recomendacion."
          mediaItems={vertical.bullets.slice(0, 3).map((bullet) => ({
            title: bullet.title,
            description: bullet.desc,
          }))}
          metrics={[
            { value: "24 hs", label: "respuesta inicial" },
            { value: "B2B", label: "condiciones comerciales" },
            { value: "ARG", label: "cobertura nacional" },
          ]}
          actions={[
            { label: "Cotizar por WhatsApp", href: whatsappHref, external: true, icon: MessageCircle },
            { label: "Ya tengo modelos y cantidades", href: "/rfq", variant: "secondary", icon: ArrowRight },
          ]}
        />

        <section className="border-b border-slate-200 bg-[#f7f9fc] py-6">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6">
            {brands.slice(0, 8).map((brand) => (
              <Image key={brand.name} src={brand.logo} alt={brand.name} width={110} height={34} className="max-h-7 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" />
            ))}
          </div>
        </section>

        <InternalSection
          tone="white"
          eyebrow="Diseño y calidad"
          title="Una solución pensada para tu contexto."
          intro="La misma categoría puede resolverse de formas distintas. Por eso ordenamos alcance, prioridad y restricciones antes de recomendar."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vertical.bullets.map((bullet) => (
              <article key={bullet.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
                <CheckCircle2 className="size-6 text-[#1236d8]" strokeWidth={1.8} />
                <h3 className="mt-5 font-display text-[17px] font-extrabold text-[#11142a]">{bullet.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{bullet.desc}</p>
              </article>
            ))}
          </div>
        </InternalSection>

        <InternalSection
          tone="soft"
          eyebrow="Alcance"
          title="Como podemos acompañarte."
          intro="El alcance final se define despues de entender tu entorno, prioridades y restricciones."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vertical.capabilities.map((capability) => (
              <article key={capability.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <Icon name={capability.icon} className="size-6 text-[#1236d8]" />
                <h3 className="mt-4 font-display text-[16px] font-extrabold text-[#11142a]">{capability.title}</h3>
                <p className="mt-2 text-[12.8px] leading-relaxed text-slate-600">{capability.desc}</p>
              </article>
            ))}
          </div>
        </InternalSection>

        <InternalSection tone="white" eyebrow="Proceso" title="De la consulta a la implementacion.">
          <ol className="grid gap-5 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-display text-[13px] font-extrabold text-[#1236d8]">
                  {index + 1}
                </span>
                <step.icon className="mt-6 size-6 text-[#1236d8]" strokeWidth={1.7} />
                <h3 className="mt-4 font-display text-[16px] font-extrabold text-[#11142a]">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </InternalSection>

        <InternalSection tone="soft" eyebrow="Dudas frecuentes" title="Preguntas frecuentes.">
          <div className="grid gap-5 lg:grid-cols-2">
            {vertical.faqs.map((item) => (
              <article key={item.q} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-display text-[16px] font-extrabold text-[#11142a]">{item.q}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>
        </InternalSection>

        {related.length > 0 ? (
          <InternalSection tone="white" eyebrow="Relacionados" title="Otras areas en las que podemos ayudarte.">
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/soluciones/${item.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200"
                >
                  <span className="grid size-11 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#1236d8]">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <span className="font-display text-[16px] font-extrabold text-[#11142a]">{item.navLabel}</span>
                  <ArrowRight className="ml-auto size-4 text-[#1236d8] transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </InternalSection>
        ) : null}

        <InternalCta
          title="Hablemos de lo que necesita tu empresa."
          intro="Un especialista puede ayudarte a definir el alcance antes de preparar una propuesta. Respondemos en 24 hs hábiles."
          actions={[
            { label: "Contaños tu desafio por WhatsApp", href: whatsappHref, external: true, icon: MessageCircle },
            { label: "Ver marcas", href: "/marcas", variant: "secondary", icon: ArrowRight },
          ]}
        />
      </InternalPageShell>
    </>
  );
}
