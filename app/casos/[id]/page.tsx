import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "../../../components/Footer";
import { Navbar } from "../../../components/Navbar";
import { company } from "../../../constants";
import { getDynamicSuccessCaseById } from "../../../lib/db-content";

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
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white">
        <article>
          <header className="bg-[#06140d] pt-32 text-white md:pt-40 border-b border-white/5">
            <div className="mx-auto max-w-[980px] px-6 pb-16">
              <Link href="/#experiencia" className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-300 hover:text-white">
                <ArrowLeft size={16} /> Volver a experiencias
              </Link>
              <p className="mt-10 text-[12px] font-bold uppercase tracking-[0.14em] text-accent">{item.clientName}</p>
              <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(36px,6vw,68px)] font-bold leading-[1.02] tracking-[-0.045em] text-white">{item.title}</h1>
              <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-slate-400">{item.description}</p>
            </div>
          </header>

          <div className="mx-auto max-w-[980px] px-6 pb-20">
            <div className="relative -mt-7 aspect-[16/8] overflow-hidden rounded-3xl border border-white/10 bg-[#030c07]">
              <Image src={item.coverImage} alt={item.title} fill priority sizes="980px" className="object-cover opacity-85" />
            </div>
            {item.metrics.length > 0 ? (
              <div className="grid border-b border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
                {item.metrics.map((metric) => <p key={metric} className="py-2 text-[14px] font-bold text-accent">{metric}</p>)}
              </div>
            ) : null}
            <div className="mx-auto max-w-[720px] py-14">
              {paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-[17px] leading-[1.8] text-slate-300">{paragraph}</p>)}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
