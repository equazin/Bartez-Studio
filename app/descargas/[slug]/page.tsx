import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { company } from "@/constants";
import { downloadGuides, getDownloadGuide, type DownloadBlock } from "@/lib/downloads";
import { safeJsonLd } from "@/lib/json-ld";
import { whatsappLinks } from "@/lib/whatsapp";
import { PrintButton } from "@/components/PrintButton";

export function generateStaticParams() {
  return downloadGuides.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getDownloadGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: { canonical: `/descargas/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `${company.url}/descargas/${guide.slug}`,
      type: "article",
    },
  };
}

function renderBlock(block: DownloadBlock, index: number) {
  if (block.type === "paragraph") {
    return (
      <p
        key={index}
        className="text-[14px] leading-relaxed text-slate-700 print:text-[11.5pt]"
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <ul
        key={index}
        className="ml-5 list-disc space-y-1.5 text-[14px] leading-relaxed text-slate-700 marker:text-[#0046EA] print:text-[11pt]"
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "note") {
    return (
      <p
        key={index}
        className="rounded-md border-l-4 border-[#0046EA] bg-blue-50 px-4 py-3 text-[13.5px] leading-relaxed text-slate-700 print:bg-white print:text-[10.5pt]"
      >
        <strong className="font-bold text-[#0046EA]">Nota: </strong>
        {block.text}
      </p>
    );
  }
  // table
  return (
    <div key={index} className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px] print:text-[10pt]">
        <thead>
          <tr className="border-b-2 border-[#0046EA] bg-blue-50 print:bg-slate-100">
            {block.headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left font-bold text-[#11142a]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-slate-200 last:border-b-0"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 align-top text-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption ? (
        <p className="mt-1.5 text-[11.5px] italic text-slate-500 print:text-[9pt]">
          {block.caption}
        </p>
      ) : null}
    </div>
  );
}

export default async function DownloadGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getDownloadGuide(slug);
  if (!guide) notFound();

  const url = `${company.url}/descargas/${guide.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.metaDescription,
    author: { "@type": "Organization", name: company.name, url: company.url },
    publisher: {
      "@type": "Organization",
      name: company.name,
      url: company.url,
    },
    inLanguage: "es-AR",
    url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: company.url },
      { "@type": "ListItem", position: 2, name: "Descargas", item: `${company.url}/descargas` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  const Icon = guide.icon;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-white text-ink">
        <div className="mx-auto max-w-[820px] px-6 py-10 print:px-0 print:py-6">
          <div className="mb-8 flex items-center justify-between print:hidden">
            <Link
              href="/descargas"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 transition hover:text-[#0046EA]"
            >
              <ArrowLeft size={14} /> Volver a Descargas
            </Link>
            <PrintButton />
          </div>

          <header className="mb-8 border-b border-slate-200 pb-8 print:mb-6 print:pb-4">
            <div className="mb-4 flex items-center gap-3 print:mb-3">
              <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0046EA] print:hidden">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0046EA]">
                {guide.category}
              </span>
            </div>
            <h1 className="font-display text-[clamp(26px,3.5vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[#11142a] print:text-[22pt]">
              {guide.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 print:text-[11pt]">
              {guide.subtitle}
            </p>
            <p className="mt-4 text-[12px] text-slate-500 print:text-[9pt]">
              {company.name} · {company.url.replace(/^https?:\/\//, "")} · Documento orientativo, sujeto a cotización formal.
            </p>
          </header>

          <article className="space-y-8 print:space-y-5">
            {guide.sections.map((section) => (
              <section key={section.heading} className="print:break-inside-avoid">
                <h2 className="mb-4 font-display text-[20px] font-semibold text-[#11142a] print:mb-3 print:text-[14pt]">
                  {section.heading}
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {section.blocks.map(renderBlock)}
                </div>
              </section>
            ))}
          </article>

          <footer className="mt-12 rounded-lg border border-slate-200 bg-[#f7f9fc] p-6 print:mt-8 print:bg-white">
            <p className="text-[13px] font-semibold text-[#11142a]">
              ¿Necesitás cotización o asesoramiento?
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600 print:text-[10pt]">
              Escribinos por WhatsApp o enviá tu RFQ en bartez.com.ar/rfq — respondemos en 24 hs hábiles con propuesta formal y factura A.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 print:hidden">
              <a
                href={whatsappLinks.quote}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0046EA] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-brand-bright"
              >
                <MessageCircle size={15} /> Consultar por WhatsApp
              </a>
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 rounded-lg border border-[#0046EA] bg-white px-4 py-2 text-[13px] font-bold text-[#0046EA] transition hover:bg-blue-50"
              >
                Enviar RFQ
              </Link>
            </div>
          </footer>
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  );
}
