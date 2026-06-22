import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle 
} from "lucide-react";
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

export default async function VerticalPage({ 
  params
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
      
      <main className="font-sans antialiased overflow-x-hidden bg-[#030c07] text-white">
        
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-[1200px] px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 mb-6 border border-accent/20">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-accent">Soluciones Corporativas B2B</span>
              </div>
              <h1 className="font-display text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
                {vertical.h1}
              </h1>
              <p className="mt-6 max-w-[50ch] text-[16.5px] leading-relaxed text-slate-400">
                {vertical.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link href="/#cotiza" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-bold text-ink transition hover:scale-[1.02]">
                  Recibir asesoramiento <ArrowRight size={16} />
                </Link>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10">
                  <MessageCircle size={16} /> Contactar por WhatsApp
                </a>
              </div>
            </div>
            <div className="relative min-h-[380px] lg:min-h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-glow bg-[#0A2215]">
              <Image src={vertical.image} alt={vertical.navLabel} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover opacity-90" />
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="border-y border-white/10 bg-[#06140d] py-6">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6">
            {brands.slice(0, 6).map((brand) => (
              <Image key={brand.name} src={brand.logo} alt={brand.name} width={96} height={28} className="h-5 w-auto brightness-0 invert opacity-40 transition hover:opacity-85" />
            ))}
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-20 md:py-28 bg-[#030c07]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="text-center mb-16">
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent">Diseño y Calidad</span>
              <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,44px)] font-bold tracking-[-0.03em]">Una solución pensada para tu contexto</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vertical.bullets.map((bullet) => (
                <div key={bullet.title} className="bg-[#081f12] border border-white/5 rounded-3xl p-8 hover:border-accent/30 transition duration-300">
                  <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="mt-6 font-display text-[17px] font-bold text-white">{bullet.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{bullet.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20 md:py-28 bg-[#06140d] border-t border-white/5">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[650px] mb-12">
              <h2 className="font-display text-[clamp(28px,3.6vw,42px)] font-bold tracking-[-0.035em]">Cómo podemos acompañarte</h2>
              <p className="mt-3 text-[15px] text-slate-400">El alcance final se define después de entender tu entorno, prioridades y restricciones.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vertical.capabilities.map((c) => (
                <div key={c.title} className="bg-[#030c07] border border-white/5 p-6 rounded-2xl">
                  <Icon name={c.icon} className="size-6 text-accent" />
                  <h3 className="mt-4 font-display text-[15.5px] font-bold text-white">{c.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <div className="bg-[#030c07] border-y border-white/5">
          <Process />
        </div>

        {/* FAQ */}
        <section className="py-20 md:py-24 bg-[#030c07]">
          <div className="mx-auto max-w-[1200px] px-6 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent">Dudas frecuentes</span>
              <h2 className="mt-3 font-display text-[clamp(26px,3.5vw,38px)] font-bold tracking-[-0.03em] text-white">Preguntas frecuentes</h2>
            </div>
            <div className="divide-y divide-white/10">
              {vertical.faqs.map((item) => (
                <div key={item.q} className="py-6 first:pt-0 last:pb-0">
                  <h3 className="font-display text-[16px] font-bold text-white">{item.q}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="bg-[#030c07] py-20 text-white border-t border-white/5">
            <div className="mx-auto max-w-[1200px] px-6">
              <h2 className="font-display text-[26px] font-bold tracking-[-0.03em] text-white">Otras áreas en las que podemos ayudarte</h2>
              <div className="mt-8 border-t border-white/10">
                {related.map((item) => (
                  <Link key={item.slug} href={`/soluciones/${item.slug}`} className="group flex items-center gap-4 border-b border-white/10 py-5 text-white transition-colors hover:text-accent">
                    <Icon name={item.icon} className="size-5" />
                    <span className="font-display text-[15.5px] font-semibold">{item.navLabel}</span>
                    <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="bg-[#06140d] py-20 text-white border-t border-white/5">
          <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.04em]">Hablemos de lo que necesita tu empresa.</h2>
            <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-slate-350">Un especialista puede ayudarte a definir el alcance antes de preparar una propuesta. Respondemos en <strong>24 hs hábiles</strong> (Lun–Vie 9 a 18 hs).</p>
            <Link href="/#cotiza" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-bold text-ink transition hover:scale-[1.02]">
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