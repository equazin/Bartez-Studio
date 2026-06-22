import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { verticals, company, contact } from "../../../constants";
import { getDynamicPartners } from "../../../lib/db-content";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Assistant } from "../../../components/Assistant";
import { Process } from "../../../components/sections/Process";
import { Icon } from "../../../components/icons";

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

export default async function VerticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vertical = verticals.find((item) => item.slug === slug);
  if (!vertical) notFound();
  const brands = await getDynamicPartners();
  const related = vertical.related
    .map((relatedSlug) => verticals.find((item) => item.slug === relatedSlug))
    .filter(Boolean) as typeof verticals;
  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Hola, necesito asesoramiento sobre ${vertical.navLabel}.`)}`;
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />
      <main>
        <section className="bg-white pt-28 md:pt-32">
          <div className="mx-auto grid min-h-[620px] max-w-[1200px] items-center gap-12 px-6 py-14 lg:grid-cols-[.92fr_1.08fr]">
            <div>
              <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <Link href="/" className="hover:text-brand transition-colors">Inicio</Link>
                <span aria-hidden>›</span>
                <Link href="/#soluciones" className="hover:text-brand transition-colors">Soluciones</Link>
                <span aria-hidden>›</span>
                <span className="font-semibold text-ink" aria-current="page">{vertical.navLabel}</span>
              </nav>
              <h1 className="mt-8 font-display text-[clamp(40px,5.2vw,68px)] font-bold leading-[1] tracking-[-0.05em] text-ink text-balance">
                {vertical.h1}
              </h1>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-slate-600">{vertical.intro}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/#cotiza" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-brand">
                  Recibir asesoramiento <ArrowRight size={17} />
                </Link>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
                  <MessageCircle size={17} /> Hablar por WhatsApp
                </a>
              </div>
            </div>
            <div className="relative min-h-[430px] overflow-hidden rounded-2xl lg:min-h-[560px]">
              <Image src={vertical.image} alt={vertical.navLabel} fill priority sizes="(max-width:1024px) 100vw, 52vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/70 py-7" aria-label="Marcas con las que trabajamos">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6">
            {brands.slice(0, 6).map((brand) => (
              <Image key={brand.name} src={brand.logo} alt={brand.name} width={96} height={28} className="h-5 w-auto grayscale opacity-55" />
            ))}
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[.8fr_1.2fr]">
            <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
              Una solución pensada para tu contexto.
            </h2>
            <div className="border-t border-slate-200">
              {vertical.bullets.map((bullet) => (
                <div key={bullet.title} className="grid gap-3 border-b border-slate-200 py-6 sm:grid-cols-[28px_1fr_1.2fr]">
                  <CheckCircle2 className="mt-0.5 size-5 text-brand" />
                  <h3 className="font-display text-[16px] font-semibold text-ink">{bullet.title}</h3>
                  <p className="text-[14px] leading-relaxed text-slate-600">{bullet.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[680px]">
              <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold tracking-[-0.035em] text-ink">Cómo podemos acompañarte</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-600">El alcance final se define después de entender tu entorno, prioridades y restricciones.</p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
              {vertical.capabilities.map((capability) => (
                <div key={capability.title} className="bg-white p-7">
                  <Icon name={capability.icon} className="size-7 text-brand" />
                  <h3 className="mt-5 font-display text-[16px] font-semibold text-ink">{capability.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{capability.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Process />

        <section className="bg-slate-50 py-20 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[.72fr_1.28fr]">
            <h2 className="font-display text-[clamp(28px,3.6vw,42px)] font-bold tracking-[-0.03em] text-ink">Preguntas frecuentes</h2>
            <div className="border-t border-slate-200">
              {vertical.faqs.map((item) => (
                <div key={item.q} className="border-b border-slate-200 py-6">
                  <h3 className="font-display text-[16px] font-semibold text-ink">{item.q}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-white py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <h2 className="font-display text-[28px] font-bold tracking-[-0.03em] text-ink">Otras áreas en las que podemos ayudarte</h2>
              <div className="mt-8 border-t border-slate-200">
                {related.map((item) => (
                  <Link key={item.slug} href={`/soluciones/${item.slug}`} className="group flex items-center gap-4 border-b border-slate-200 py-5 text-ink transition-colors hover:text-brand">
                    <Icon name={item.icon} className="size-5" />
                    <span className="font-display text-[16px] font-semibold">{item.navLabel}</span>
                    <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-ink py-16 text-white">
          <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold tracking-[-0.04em]">Hablemos de lo que necesita tu empresa.</h2>
            <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-slate-300">Un especialista puede ayudarte a definir el alcance antes de preparar una propuesta. Respondemos en <strong>24 hs hábiles</strong> (Lun–Vie 9 a 18 hs).</p>
            <Link href="/#cotiza" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-emerald-50">
              Contános tu desafío <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <Assistant />
    </>
  );
}