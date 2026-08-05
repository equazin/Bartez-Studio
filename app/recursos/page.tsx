import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, FileText, MessageCircle } from "lucide-react";
import {
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { getDynamicArticles } from "@/lib/db-content";
import { whatsappLinks } from "@/lib/whatsapp";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recursos para decisiones de tecnología | Bartez Tecnología",
  description: "Guías prácticas para evaluar infraestructura, equipos y continuidad tecnológica en empresas.",
  alternates: { canonical: "/recursos" },
};

export default async function Recursos() {
  const articles = await getDynamicArticles();

  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Recursos"
        title={
          <>
            Criterio para mejores <span className="text-[#0046EA]">decisiones IT.</span>
          </>
        }
        intro="Contenido práctico para tomar mejores decisiones de tecnología en tu organización: infraestructura, equipos, continuidad y compras B2B."
        image="/photos/products/server.jpg"
        imageAlt="Recursos de tecnología Bartez"
        imagePriority
        mediaLabel="Guías"
        mediaTitle="Lecturas para comprar y dimensionar mejor."
        mediaSubtitle="Publicamos contenido orientado a decisión técnica y comercial, sin ruido."
        mediaItems={[
          { icon: FileText, title: "Guías", description: "Criterios para elegir." },
          { icon: Clock, title: "Lectura", description: "Material breve y aplicable." },
          { icon: MessageCircle, title: "Consulta", description: "Pasamos de guía a propuesta." },
        ]}
        metrics={[
          { value: `${articles.length}`, label: "recursos publicados" },
          { value: "IT", label: "criterio técnico" },
          { value: "B2B", label: "enfoque comercial" },
        ]}
        actions={[
          { label: "Consultar por WhatsApp", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Ver catálogo", href: "/catalogo", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Biblioteca" title="Guías y articulos.">
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/recursos/${article.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <Image src={article.cover} alt={article.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
                  <span>{new Date(article.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {article.readingTime}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-[21px] font-extrabold leading-snug text-[#11142a]">{article.title}</h2>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-600">{article.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0046EA]">
                  Leer guía <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </InternalSection>
    </InternalPageShell>
  );
}
