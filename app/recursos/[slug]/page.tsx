import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye, MessageCircle } from "lucide-react";
import { articles, company } from "@/constants";
import { getDynamicArticleBySlug } from "@/lib/db-content";
import { safeJsonLd } from "@/lib/json-ld";
import { verifyToken, tokenFromCookieHeader } from "@/lib/auth-token";
import { cookies } from "next/headers";
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

async function isAdminPreview(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return false;
    const session = await verifyToken(token);
    return session !== null;
  } catch {
    return false;
  }
}

export default async function Articulo({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  const wantsPreview = query.preview === "1";
  const isPreview = wantsPreview && (await isAdminPreview());
  const article = await getDynamicArticleBySlug(slug, { preview: isPreview });
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {isPreview && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-bold text-black">
          <Eye size={16} /> Vista previa — Este artículo no está publicado
        </div>
      )}
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
            <Link href="/recursos" className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0046EA] hover:underline">
              <ArrowLeft size={15} /> Recursos
            </Link>
            <div>
              {article.body.map((block, index) =>
                block.h ? (
                  <h2 key={index} className="mt-9 font-display text-[24px] font-semibold text-[#11142a] first:mt-0">
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
          title="¿Querés evaluar este escenario?"
          intro="Contanos tu contexto y un especialista te ayuda a definir el alcance."
          actions={[
            { label: "Consultar por WhatsApp", href: buildWhatsAppUrl("quote", [`Articulo consultado: ${article.title}`]), external: true, icon: MessageCircle },
            { label: "Ver soluciones", href: "/soluciones/servidores", variant: "secondary", icon: ArrowLeft },
          ]}
        />
      </InternalPageShell>
    </>
  );
}
