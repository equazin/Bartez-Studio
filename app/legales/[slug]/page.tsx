import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPages, company } from "../../../constants";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages.find((p) => p.slug === slug);
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
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <header className="bg-ink pt-32 text-white md:pt-40">
          <div className="mx-auto max-w-[760px] px-7 pb-12">
            <h1 className="font-display text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.02em]">{page.title}</h1>
            <p className="mt-3 text-[13px] text-slate-400">
              Última actualización:{" "}
              {new Date(page.updated).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-[760px] px-7 py-14">
          <p className="text-[17px] leading-relaxed text-slate-700">{page.intro}</p>
          <div className="mt-10 space-y-8">
            {page.sections.map((s) => (
              <section key={s.h}>
                <h2 className="font-display text-[19px] font-bold text-ink">{s.h}</h2>
                <p className="mt-2 text-[15.5px] leading-[1.7] text-slate-600">{s.p}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
