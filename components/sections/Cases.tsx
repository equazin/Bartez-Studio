import { cases } from "../../constants";
import { Reveal } from "../motion";
import { SectionHeading } from "../SectionHeading";

export function Cases() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-7">
        <SectionHeading eyebrow={cases.eyebrow} title={cases.title} desc={cases.desc} className="mb-14" />
        <div className="grid gap-5 md:grid-cols-3">
          {cases.items.map((c, i) => (
            <Reveal as="article" delay={i * 0.08} key={c.sector} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink font-display text-[15px] font-bold text-white">{c.initials}</span>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-[12px] font-semibold text-brand">{c.sector}</span>
              </div>
              <div className="mt-6 font-display text-[44px] font-bold leading-none text-brand">{c.metric}</div>
              <div className="mt-1 text-[13px] uppercase tracking-[0.08em] text-slate-500">{c.metricLabel}</div>
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-slate-600">{c.result}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
