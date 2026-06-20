import { process as proc } from "../../constants";
import { Reveal } from "../motion";
import { SectionHeading } from "../SectionHeading";

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-24 bg-slate-50 py-24">
      <div className="mx-auto max-w-[1200px] px-7">
        <SectionHeading num={proc.num} eyebrow={proc.eyebrow} title={proc.title} className="mb-16" />
        <div className="relative grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-brand/50 via-accent/30 to-transparent md:block" aria-hidden />
          {proc.steps.map((s, i) => (
            <Reveal as="div" delay={i * 0.1} key={s.n} className="relative">
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-brand font-display text-[18px] font-bold text-white shadow-glow">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-[18px] font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
