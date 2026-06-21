import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle, ArrowLeft, PackageCheck } from "lucide-react";
import { verticals, company, contact, partners } from "../../../constants";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { WhatsAppFloat } from "../../../components/WhatsAppFloat";
import { MobileCTA } from "../../../components/MobileCTA";
import { Process } from "../../../components/sections/Process";
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
  const related = v.related.map((s) => verticals.find((x) => x.slug === s)).filter(Boolean) as typeof verticals;

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
              <Image src={v.image} alt={v.navLabel} fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" aria-hidden />
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b border-slate-200 bg-white py-8">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-12 gap-y-5 px-7">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">Marcas oficiales:</span>
            {partners.brands.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.name} src={b.logo} alt={b.name} width={96} height={28} loading="lazy" className="h-6 w-auto opacity-60 transition-opacity hover:opacity-100" />
            ))}
          </div>
        </section>

        {/* Value / bullets */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-7">
            <h2 className="max-w-[20ch] font-display text-[clamp(24px,3.2vw,38px)] font-bold leading-tight text-ink">Por qué comprar {v.navLabel.toLowerCase()} en Bartez</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {v.bullets.map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><Check size={20} strokeWidth={2.5} /></span>
                  <h3 className="font-display text-[16px] font-bold text-ink">{b.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-[1200px] px-7">
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold text-ink">Productos destacados</h2>
            <p className="mt-2 text-[16px] text-slate-600">Algunos de los equipos que trabajamos en esta línea. Consultanos por el modelo que necesites.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {v.products.map((p, i) => (
                <article key={i} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
                  <div className="relative h-44 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50">
                    <Image src={p.image} alt={`${p.brand} ${p.model}`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur">{p.brand}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-[16px] font-semibold text-ink">{p.model}</h3>
                    {p.badge && (
                      <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${p.badge.includes("Stock") ? "bg-emerald/10 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        <PackageCheck size={13} /> {p.badge}
                      </span>
                    )}
                    <Link href="/#cotiza" className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[13px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white">
                      Cotizar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Qué incluye / capabilities */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-7">
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold text-ink">Qué incluye el servicio</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {v.capabilities.map((c) => (
                <div key={c.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-ink text-white"><Icon name={c.icon} className="h-5 w-5" /></span>
                  <h3 className="font-display text-[16px] font-bold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso */}
        <Process />

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

        {/* Verticales relacionadas */}
        {related.length > 0 && (
          <section className="bg-slate-50 py-20">
            <div className="mx-auto max-w-[1200px] px-7">
              <h2 className="mb-8 font-display text-[clamp(22px,2.6vw,30px)] font-bold text-ink">Otras soluciones</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/soluciones/${r.slug}`} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-brand/10 text-brand"><Icon name={r.icon} className="h-6 w-6" /></span>
                    <div className="flex-1">
                      <h3 className="font-display text-[17px] font-bold text-ink">{r.navLabel}</h3>
                      <p className="text-[13.5px] text-slate-500">Ver soluciones</p>
                    </div>
                    <ArrowRight size={18} className="text-brand transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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
