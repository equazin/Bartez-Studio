import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getDynamicArticles } from "../../lib/db-content";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recursos para decisiones de tecnología | Bartez Tecnología",
  description:
    "Guías prácticas para evaluar infraestructura, equipos y continuidad tecnológica en empresas.",
  alternates: { canonical: "/recursos" },
};

export default async function Recursos() {
  const articles = await getDynamicArticles();
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white">
        <section className="bg-[#06140d] pt-32 text-white md:pt-40 border-b border-white/5">
          <div className="mx-auto max-w-[1200px] px-7 pb-16">
            <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-accent">Recursos</span>
            <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.06] tracking-[-0.02em] text-white">Criterio para mejores decisiones IT.</h1>
            <p className="mt-5 max-w-[55ch] text-[17px] text-slate-450">Contenido práctico para tomar mejores decisiones de tecnología en tu organización.</p>
          </div>
        </section>

        <section className="bg-[#030c07] py-20">
          <div className="mx-auto grid max-w-[1200px] gap-6 px-7 md:grid-cols-2">
            {articles.map((a) => (
              <Link key={a.slug} href={`/recursos/${a.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#082214] shadow-glow transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-[#0c2e1d] duration-350">
                <div className="relative h-52 overflow-hidden bg-[#030c07]">
                  <Image src={a.cover} alt={a.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover opacity-85 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3 text-[12px] text-slate-450">
                    <span>{new Date(a.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {a.readingTime}</span>
                  </div>
                  <h2 className="mt-3 font-display text-[20px] font-bold leading-snug text-white">{a.title}</h2>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-slate-400">{a.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-accent">Leer guía <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
