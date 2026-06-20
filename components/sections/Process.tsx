import { process as proc } from "../../constants";
import { Reveal } from "../motion";
import { SectionHeading } from "../SectionHeading";

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-20 bg-crema py-28">
      <div className="mx-auto max-w-[1200px] px-7">
        <SectionHeading num={proc.num} eyebrow={proc.eyebrow} title={proc.title} className="mb-16" />
        <div className="relative grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-bronce/40 via-bronce/20 to-transparent md:block" aria-hidden />
          {proc.steps.map((s, i) => (
            <Reveal as="div" delay={i * 0.1} key={s.n} className="relative">
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-bronce/40 bg-crema font-serif text-[18px] text-verde">
                {s.n}
              </div>
              <h3 className="mt-5 text-[18px] font-semibold text-verde-deep">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#4a5a50]">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
