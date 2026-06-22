import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { buildWhatsAppUrl, type WhatsAppIntent } from "@/lib/whatsapp";

type CommercialItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type CommercialLandingProps = {
  title: string;
  intro: string;
  items: CommercialItem[];
  proof: string[];
  ctaLabel?: string;
  intent?: WhatsAppIntent;
  whatsappDetails?: string[];
  note?: string;
  secondary?: { label: string; href: string };
};

export function CommercialLanding({
  title,
  intro,
  items,
  proof,
  ctaLabel = "Consultar por WhatsApp",
  intent = "quote",
  whatsappDetails = [],
  note,
  secondary,
}: CommercialLandingProps) {
  const whatsappHref = buildWhatsAppUrl(intent, whatsappDetails);

  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] pt-20 text-white">
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <h1 className="max-w-[900px] font-display text-[clamp(40px,6vw,72px)] font-bold leading-[0.98] tracking-[-0.052em] text-balance">{title}</h1>
            <p className="mt-7 max-w-[65ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-slate-400">{intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-bold text-ink transition hover:scale-[1.02]">
                <MessageCircle size={18} /> {ctaLabel}
              </a>
              {secondary ? <Link href={secondary.href} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:border-accent hover:text-accent">{secondary.label} <ArrowRight size={16} /></Link> : null}
            </div>
          </div>
        </section>

        <section className="bg-[#06140d] py-16 md:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-px border border-white/10 bg-white/10 px-0 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.title} className="bg-[#06140d] p-7 md:p-8">
                <item.icon className="text-accent" size={26} strokeWidth={1.6} />
                <h2 className="mt-5 font-display text-[18px] font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 py-16 md:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-[clamp(28px,4vw,46px)] font-bold leading-[1.04] tracking-[-0.04em]">Una propuesta definida con información real.</h2>
            <div className="border-t border-white/10">
              {proof.map((item) => (
                <div key={item} className="flex gap-3 border-b border-white/10 py-4 text-[14px] leading-relaxed text-slate-300">
                  <CheckCircle2 className="mt-0.5 flex-none text-accent" size={18} /> {item}
                </div>
              ))}
              {note ? <p className="mt-5 text-[12.5px] leading-relaxed text-slate-500">{note}</p> : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
