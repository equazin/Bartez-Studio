import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { articles, company } from "../../../constants";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Assistant } from "../../../components/Assistant";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: `${a.title} | Bartez Tecnología`,
    description: a.metaDescription,
    alternates: { canonical: `/recursos/${a.slug}` },
    openGraph: { title: a.title, description: a.metaDescription, type: "article", url: `${company.url}/recursos/${a.slug}` },
  };
}

export default async function Articulo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.date,
    image: `${company.url}${a.cover}`,
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <article className="bg-white">
          <header className="bg-ink pt-32 text-white md:pt-40">
            <div className="mx-auto max-w-[760px] px-7 pb-14">
              <Link href="/recursos" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-accent">
                <ArrowLeft size={15} /> Recursos
              </Link>
              <h1 className="font-display text-[clamp(28px,4vw,46px)] font-bold leading-[1.1] tracking-[-0.02em]">{a.title}</h1>
              <div className="mt-5 flex items-center gap-3 text-[13px] text-slate-400">
                <span>{new Date(a.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {a.readingTime}</span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[760px] px-7">
            <div className="relative -mt-8 mb-10 aspect-[16/8] overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <Image src={a.cover} alt={a.title} fill sizes="760px" className="object-cover" priority />
            </div>

            <div className="prose-bartez pb-8">
              {a.body.map((b, i) =>
                b.h ? (
                  <h2 key={i} className="mt-9 font-display text-[22px] font-bold text-ink">{b.h}</h2>
                ) : (
                  <p key={i} className="mt-4 text-[16.5px] leading-[1.75] text-slate-700">{b.p}</p>
                )
              )}
            </div>

            <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center">
              <h3 className="font-display text-[20px] font-bold text-ink">¿Querés evaluar este escenario?</h3>
              <p className="mt-2 text-[15px] text-slate-600">Contanos tu contexto y un especialista te ayuda a definir el alcance.</p>
              <Link href="/#cotiza" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-bright hover:shadow-glow">
                Recibir asesoramiento <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <Assistant />
    </>
  );
}
