import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { company, legalPages } from "@/constants";
import {
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages.find((item) => item.slug === slug);
  if (!page) return {};
  return {
    title: `${page.title} | ${company.name}`,
    description: page.intro.slice(0, 155),
    alternates: { canonical: `/legales/${page.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = legalPages.find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Información legal"
        eyebrowIcon={FileText}
        title={page.title}
        intro={page.intro}
        metrics={[
          { value: "Legal", label: "documento público" },
          {
            value: new Date(page.updated).toLocaleDateString("es-AR", { day: "numeric", month: "short" }),
            label: "última actualización",
          },
          { value: "AR", label: "marco aplicable" },
        ]}
      />

      <InternalSection tone="soft">
        <article className="mx-auto max-w-[820px] rounded-lg border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="space-y-8">
            {page.sections.map((section) => (
              <section key={section.h}>
                <h2 className="font-display text-[20px] font-semibold text-[#11142a]">{section.h}</h2>
                <p className="mt-3 text-[15.5px] leading-[1.75] text-slate-600">{section.p}</p>
              </section>
            ))}
          </div>
        </article>
      </InternalSection>
    </InternalPageShell>
  );
}
