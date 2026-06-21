import Link from "next/link";
import { solutions } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";
import { SectionHeading } from "../SectionHeading";
import { ArrowRight } from "lucide-react";

export function Solutions() {
  return (
    <section id="soluciones" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-7">
        <SectionHeading num={solutions.num} eyebrow={solutions.eyebrow} title={solutions.title} desc={solutions.desc} className="mb-14" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.cards.map((c, i) => (
            <Reveal as="article" delay={(i % 3) * 0.07} key={c.id}>
              <Link
                href={c.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-card"
                aria-label={`${c.title} — ${c.cta}`}
              >
                {/* acento superior */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 brand-gradient transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-green-700">{c.category}</span>
                </div>
                <h3 className="font-display text-[20px] font-bold text-ink">{c.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-slate-600">{c.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">
                  {c.cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
