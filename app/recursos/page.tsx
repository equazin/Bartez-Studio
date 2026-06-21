import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { articles, company } from "../../constants";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { WhatsAppFloat } from "../../components/WhatsAppFloat";
import { MobileCTA } from "../../components/MobileCTA";

export const metadata: Metadata = {
  title: "Recursos y guías de compra IT | Bartez Tecnología",
  description:
    "Guías prácticas para comprar tecnología en tu empresa: cómo elegir servidores, renovar notebooks corporativas y más. Por Bartez Tecnología.",
  alternates: { canonical: "/recursos" },
};

export default function Recursos() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-ink pt-32 text-white md:pt-40">
          <div className="mx-auto max-w-[1200px] px-7 pb-16">
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">Recursos</span>
            <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.06] tracking-[-0.02em]">Guías de compra IT para empresas.</h1>
            <p className="mt-5 max-w-[55ch] text-[17px] text-slate-300">Contenido práctico para tomar mejores decisiones de tecnología en tu organización.</p>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-[1200px] gap-6 px-7 md:grid-cols-2">
            {articles.map((a) => (
              <Link key={a.slug} href={`/recursos/${a.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <Image src={a.cover} alt={a.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3 text-[12px] text-slate-500">
                    <span>{new Date(a.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {a.readingTime}</span>
                  </div>
                  <h2 className="mt-3 font-display text-[20px] font-bold leading-snug text-ink">{a.title}</h2>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-slate-600">{a.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">Leer guía <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileCTA />
    </>
  );
}
