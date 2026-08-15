import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  HardDrive,
  MemoryStick,
  MessageCircle,
  Monitor,
  Zap,
} from "lucide-react";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company } from "@/constants";
import { safeJsonLd } from "@/lib/json-ld";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  getWorkstationSoftware,
  workstationsSoftware,
} from "@/lib/workstations-software";

export function generateStaticParams() {
  return workstationsSoftware.map((item) => ({ software: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ software: string }>;
}): Promise<Metadata> {
  const { software } = await params;
  const entry = getWorkstationSoftware(software);
  if (!entry) return {};
  const url = `${company.url}/soluciones/workstations-alta-gama/${entry.slug}`;
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    keywords: entry.keywords,
    alternates: {
      canonical: `/soluciones/workstations-alta-gama/${entry.slug}`,
    },
    openGraph: {
      title: entry.metaTitle,
      description: entry.metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function WorkstationSoftwarePage({
  params,
}: {
  params: Promise<{ software: string }>;
}) {
  const { software } = await params;
  const entry = getWorkstationSoftware(software);
  if (!entry) notFound();

  const url = `${company.url}/soluciones/workstations-alta-gama/${entry.slug}`;
  const whatsappHref = buildWhatsAppUrl("quote", [
    `Workstation para ${entry.softwareName}`,
    "Origen: pagina de software especifico",
  ]);
  const rfqHref = `/rfq?origen=proyecto`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Workstation configurada para ${entry.softwareName}`,
    serviceType: entry.useCase,
    description: entry.metaDescription,
    url,
    areaServed: { "@type": "Country", name: "Argentina" },
    provider: {
      "@type": "Organization",
      name: company.name,
      url: company.url,
    },
    isRelatedTo: {
      "@type": "SoftwareApplication",
      name: entry.softwareName,
      applicationCategory: entry.useCase,
      operatingSystem: "Windows 11 Pro",
      publisher: { "@type": "Organization", name: entry.vendor },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: company.url },
      { "@type": "ListItem", position: 2, name: "Soluciones", item: `${company.url}/#soluciones` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Workstations alta gama",
        item: `${company.url}/soluciones/workstations-alta-gama`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: entry.softwareName,
        item: url,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />

      <InternalPageShell>
        <InternalHero
          eyebrow={`Workstation para ${entry.softwareName}`}
          title={entry.h1}
          intro={entry.intro}
          image="/photos/products/desktop.jpg"
          imageAlt={`Workstation configurada para ${entry.softwareName}`}
          imagePriority
          mediaLabel={entry.useCase}
          mediaTitle="Configuración a medida (CTO/BTO)."
          mediaSubtitle="Configuraciones orientativas — el sizing final se define en la propuesta según tu tipo de proyecto y volumen de datos."
          mediaItems={[
            { icon: Cpu, title: "CPU", description: entry.recommendedConfig.cpu },
            { icon: MemoryStick, title: "RAM", description: entry.recommendedConfig.ram },
            { icon: Zap, title: "GPU", description: entry.recommendedConfig.gpu },
          ]}
          metrics={[
            { value: "CTO", label: "configuración a medida" },
            { value: "3 marcas", label: "Dell / HP / Lenovo comparadas" },
            { value: "24 hs", label: "respuesta inicial" },
          ]}
          actions={[
            { label: `Cotizar workstation para ${entry.softwareName}`, href: whatsappHref, external: true, icon: MessageCircle },
            { label: "Enviar RFQ del proyecto", href: rfqHref, variant: "secondary", icon: ArrowRight },
          ]}
        />

        <InternalSection
          tone="soft"
          eyebrow="Configuración sugerida"
          title="Base recomendada, ajustable al proyecto."
          intro="Punto de partida técnico. El sizing exacto se define con vos según el volumen de datos, presupuesto y plazo de entrega."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Cpu, label: "Procesador", value: entry.recommendedConfig.cpu },
              { icon: MemoryStick, label: "Memoria", value: entry.recommendedConfig.ram },
              { icon: Zap, label: "GPU", value: entry.recommendedConfig.gpu },
              { icon: HardDrive, label: "Almacenamiento", value: entry.recommendedConfig.storage },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <item.icon className="size-6 text-[#0046EA]" strokeWidth={1.8} />
                <h3 className="mt-3 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  {item.label}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-700">
                  {item.value}
                </p>
              </article>
            ))}
          </div>
          {entry.recommendedConfig.display ? (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-5 py-4 text-[13px] leading-relaxed text-slate-700">
              <Monitor className="size-5 flex-none text-[#0046EA]" strokeWidth={1.8} />
              <div>
                <span className="font-bold">Display sugerido:</span> {entry.recommendedConfig.display}
              </div>
            </div>
          ) : null}
        </InternalSection>

        <InternalSection
          tone="white"
          eyebrow="Por qué esta configuración"
          title={`Criterios técnicos para ${entry.softwareName}.`}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entry.bullets.map((bullet) => (
              <article
                key={bullet.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200"
              >
                <CheckCircle2 className="size-6 text-[#0046EA]" strokeWidth={1.8} />
                <h3 className="mt-5 font-display text-[17px] font-semibold text-[#11142a]">
                  {bullet.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                  {bullet.desc}
                </p>
              </article>
            ))}
          </div>
        </InternalSection>

        <InternalSection
          tone="soft"
          eyebrow="Comparativa multi-marca"
          title="Dell Precision, HP Z y Lenovo ThinkStation en configuraciones equivalentes."
          intro="Cotizamos las tres marcas líderes en configuraciones comparables para que puedas decidir por precio, plazo o preferencia técnica — no por default del proveedor."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entry.compareModels.map((model) => (
              <article
                key={`${model.brand}-${model.model}`}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0046EA]">
                  {model.brand}
                </p>
                <h3 className="mt-2 font-display text-[19px] font-semibold text-[#11142a]">
                  {model.model}
                </h3>
                {model.note ? (
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                    {model.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </InternalSection>

        <InternalSection tone="white" eyebrow="Preguntas frecuentes" title={`Dudas comunes sobre ${entry.softwareName}.`}>
          <div className="grid gap-5 lg:grid-cols-2">
            {entry.faqs.map((item) => (
              <article
                key={item.q}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-[16px] font-semibold text-[#11142a]">
                  {item.q}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </InternalSection>

        <InternalSection
          tone="soft"
          eyebrow="Más configuraciones por software"
          title="Otras estaciones que también configuramos."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workstationsSoftware
              .filter((item) => item.slug !== entry.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/soluciones/workstations-alta-gama/${item.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200"
                >
                  <span className="grid size-10 flex-none place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0046EA]">
                    <item.icon size={19} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[14.5px] font-semibold text-[#11142a]">
                      {item.softwareName}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-tight text-slate-500">
                      {item.useCase}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-[#0046EA] transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
          </div>
        </InternalSection>

        <InternalCta
          title={`¿Necesitás cotizar una estación para ${entry.softwareName}?`}
          intro="Contanos el tipo de proyecto (tamaño de datasets, complejidad, plazo esperado) y armamos una propuesta con Dell, HP y Lenovo comparadas. Respondemos en 24 hs hábiles."
          actions={[
            { label: "Cotizar por WhatsApp", href: whatsappHref, external: true, icon: MessageCircle },
            { label: "Volver a workstations alta gama", href: "/soluciones/workstations-alta-gama", variant: "secondary", icon: ArrowRight },
          ]}
        />
      </InternalPageShell>
    </>
  );
}
