import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { company } from "@/constants";
import { getDynamicSuccessCaseById } from "@/lib/db-content";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { CaseDetailPanel } from "@/components/CaseDetailPanel";
import { whatsappLinks } from "@/lib/whatsapp";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = Number((await params).id);
  const item = Number.isInteger(id) ? await getDynamicSuccessCaseById(id) : null;
  if (!item) return {};
  return {
    title: `${item.title} | Bartez Tecnología`,
    description: item.description,
    alternates: { canonical: `/casos/${item.id}` },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `${company.url}/casos/${item.id}`,
      images: [{ url: item.coverImage }],
    },
  };
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const item = await getDynamicSuccessCaseById(id);
  if (!item) notFound();

  const paragraphs = item.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <InternalPageShell>
      <InternalHero
        eyebrow={item.clientName}
        title={item.title}
        intro={item.description}
        actions={[
          { label: "Consultar una solución similar", href: whatsappLinks.company, external: true, icon: MessageCircle },
          { label: "Volver a casos", href: "/casos", variant: "secondary", icon: ArrowLeft },
        ]}
      >
        <CaseDetailPanel item={item} />
      </InternalHero>

      <InternalSection tone="soft">
        <article className="mx-auto max-w-[820px] rounded-lg border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <Link href="/casos" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0046EA] hover:underline">
            <ArrowLeft size={15} /> Casos
          </Link>

          {item.metrics.length > 0 ? (
            <div className="mb-8 grid gap-3 border-b border-slate-200 pb-8 sm:grid-cols-3">
              {item.metrics.map((metric) => (
                <p key={metric} className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-center text-[13px] font-bold text-[#0046EA]">{metric}</p>
              ))}
            </div>
          ) : null}
          <div>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-[16.5px] leading-[1.8] text-slate-700 first:mt-0">{paragraph}</p>
            ))}
          </div>
        </article>
      </InternalSection>

      <InternalCta
        title="¿Tenés un proyecto parecido?"
        intro="Contanos tu contexto y lo convertimos en una propuesta de alcance realista — puntual o recurrente."
        actions={[
          { label: "Hablar por WhatsApp", href: whatsappLinks.company, external: true, icon: MessageCircle },
          { label: "Ver soluciones", href: "/soluciones/servidores", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
