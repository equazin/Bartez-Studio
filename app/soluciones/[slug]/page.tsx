import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle, ArrowLeft } from "lucide-react";
import { verticals, company, contact } from "../../../constants";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { WhatsAppFloat } from "../../../components/WhatsAppFloat";
import { MobileCTA } from "../../../components/MobileCTA";
import { Icon } from "../../../components/icons";

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const v = verticals.find((x) => x.slug === params.slug);
  if (!v) return {};
  const url = `${company.url}/soluciones/${v.slug}`;
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    keywords: v.keywords,
    alternates: { canonical: `/soluciones/${v.slug}` },
    openGraph: { title: v.metaTitle, description: v.metaDescription, url, type: "website" },
  };
}

export default function VerticalPage({ params }: { params: { slug: string } }) {
  const v = verticals.find((x) => x.slug === params.slug);
  if (!v) notFound();

  const wa = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Hola, quiero cotizar ${v.navLabel}.`)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink pt-32 text-white md:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-grid-tech [background-size:48px_48px] opacity-50 [mask-image:radial-gradient(100%_80%_at_50%_0%,#000,transparent_75%)]" aria-hidden />
          <div className="pointer-events-none absolute -right-20 top-10 h-[380px] w-[380px] rounded-full bg-brand/25 blur-[100px]" aria-hidden />
          <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-7 pb-20 md:grid-cols-[1.05fr_.95fr]">
            <div>
              <Link href="/#soluciones" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-accent">
                <ArrowLeft size={15} /> Soluciones
              </Link>
              <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">
                <Icon name={v.icon} className="h-4 w-4" /> {v.eyebrow}
              </span>
              <h1 className="mt-4 font-display text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.06] tracking-[-0.02em] text-balance">{v.h1}</h1>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-slate-300">{v.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/#cotiza" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-bright hover:shadow-glow">
                  Pedí tu cotización <ArrowRight size={18} />
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-semibold transition-colors hover:border-accent hover:text-accent">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10">
              <Image src={v.image} alt={v.navLabel} fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" aria-hidden />
            </div>
          </div>
        </section>

        {/* Bullets */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-7">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {v.bullets.map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Check size={20} strokeWidth={2.5} />
                  </span>
                  <h3 className="font-display text-[16px] font-bold text-ink">{b.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modelos + marcas */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-[1200px] px-7">
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold text-ink">Marcas y modelos que trabajamos</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {v.models.map((m) => (
                <div key={m} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-brand/10 text-brand"><Icon name={v.icon} className="h-5 w-5" /></span>
                  <span className="text-[15px] font-semibold text-ink">{m}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-400">Marcas oficiales:</span>
              {v.brands.map((b) => (
                <span key={b} className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-slate-600 ring-1 ring-slate-200">{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[820px] px-7">
            <h2 className="mb-8 font-display text-[clamp(24px,3vw,34px)] font-bold text-ink">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {v.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-display text-[16.5px] font-semibold text-ink">{f.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-ink py-16 text-white">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-7 text-center">
            <h2 className="font-display text-[clamp(26px,3.4vw,40px)] font-bold tracking-[-0.02em]">¿Listo para cotizar {v.navLabel.toLowerCase()}?</h2>
            <p className="max-w-[46ch] text-slate-300">Cotización formal en 24 hs hábiles, precios mayoristas y Factura A.</p>
            <Link href="/#cotiza" className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-[16px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-bright hover:shadow-glow">
              Pedí tu cotización <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileCTA />
    </>
  );
}
