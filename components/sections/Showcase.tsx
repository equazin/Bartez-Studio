import Image from "next/image";
import { showcase } from "../../constants";
import { Reveal } from "../motion";

export function Showcase() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <Image
        src={showcase.image}
        alt={showcase.imageAlt}
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1200px] px-7">
        <Reveal className="max-w-[620px]">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">{showcase.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(28px,3.8vw,46px)] font-bold leading-[1.08] tracking-[-0.02em] text-balance">
            {showcase.title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-300">{showcase.desc}</p>
        </Reveal>

        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {showcase.kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.08} className="border-l border-white/15 pl-4">
              <div className="font-display text-[30px] font-bold text-gradient">{k.value}</div>
              <div className="mt-1 text-[13px] leading-tight text-slate-400">{k.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
