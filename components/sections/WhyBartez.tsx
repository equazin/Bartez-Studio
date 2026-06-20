import { whyBartez } from "../../constants";
import { Reveal } from "../motion";

export function WhyBartez() {
  return (
    <section id="nosotros" className="scroll-mt-20 bg-white py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-7 md:grid-cols-[1.1fr_.9fr]">
        <Reveal>
          <span className="font-serif text-[15px] text-bronce">
            {whyBartez.num} — {whyBartez.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-[clamp(32px,4vw,50px)] leading-[1.06] tracking-[-0.02em] text-verde-deep text-balance">
            {whyBartez.title}
          </h2>
          {whyBartez.body.map((p, i) => (
            <p key={i} className="mt-5 text-[16.5px] leading-relaxed text-[#4a5a50]">
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="grid gap-4">
          {whyBartez.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-verde/10 bg-crema p-7 transition-all hover:border-bronce/40"
            >
              <div className="font-serif text-[40px] leading-none text-verde">{s.value}</div>
              <div className="mt-2 text-[14px] uppercase tracking-[0.08em] text-[#6a7a70]">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
