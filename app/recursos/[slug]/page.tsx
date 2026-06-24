import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { articles, company } from "@/constants";
import { getDynamicArticleBySlug } from "@/lib/db-content";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getDynamicArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Bartez Tecnología`,
    description: article.metaDescription,
    alternates: { canonical: `/recursos/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      url: `${company.url}/recursos/${article.slug}`,
    },
  };
}

export default async function Articulo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getDynamicArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    image: `${company.url}${article.cover}`,
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InternalPageShell>
        <InternalHero
          eyebrow="Recurso Bartez"
          title={article.title}
          intro={article.metaDescription}
          image={article.cover}
          imageAlt={article.title}
          imagePriority
          mediaLabel="Guía"
          mediaTitle="Lectura para ordenar decisiones IT."
          mediaSubtitle="Usa esta guía como base y despues validamos el alcance real por WhatsApp."
          mediaItems={[
            { icon: Clock, title: article.readingTime, description: "Tiempo estimado de lectura." },
            { title: "Publicado", description: new Date(article.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) },
            { icon: MessageCircle, title: "Consulta", description: "Convertimos criterio en propuesta." },
          ]}
          metrics={[
            { value: "Guía", label: "recurso" },
            { value: article.readingTime, label: "lectura" },
            { value: "B2B", label: "enfoque" },
          ]}
          actions={[
            { label: "Consultar por WhatsApp", href: buildWhatsAppUrl("quote", [`Articulo consultado: ${article.title}`]), external: true, icon: MessageCircle },
            { label: "Volver a recursos", href: "/recursos", variant: "secondary", icon: ArrowLeft },
          ]}
        />

        <InternalSection tone="soft">
          <article className="mx-auto max-w-[820px] rounded-lg border border-slate-200 bg-white p-7 shadow-sm md:p-10">
            <Link href="/recursos" className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1236d8] hover:underline">
              <ArrowLeft size={15} /> Recursos
            </Link>
            <div>
              {article.body.map((block, index) =>
                block.h ? (
                  <h2 key={index} className="mt-9 font-display text-[24px] font-extrabold text-[#11142a] first:mt-0">
                    {block.h}
                  </h2>
                ) : (
                  <p key={index} className="mt-4 text-[16.5px] leading-[1.75] text-slate-700">
                    {block.p}
                  </p>
                )
              )}
            </div>
          </article>
        </InternalSection>

        <InternalCta
          title="Querés evaluar este escenario?"
          intro="Contaños tu contexto y un especialista te ayuda a definir el alcance."
          actions={[
            { label: "Consultar por WhatsApp", href: buildWhatsAppUrl("quote", [`Articulo consultado: ${article.title}`]), external: true, icon: MessageCircle },
            { label: "Ver soluciones", href: "/soluciones/servidores", variant: "secondary", icon: ArrowLeft },
          ]}
        />
      </InternalPageShell>
    </>
  );
}
