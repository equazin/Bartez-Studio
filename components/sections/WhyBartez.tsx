import Image from "next/image";
import { whyBartez, whyImage } from "../../constants";
import { Reveal } from "../motion";
import { CheckCircle2 } from "lucide-react";

export function WhyBartez() {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-7 md:grid-cols-[1.05fr_.95fr]">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
            <span className="font-mono text-slate-400">{whyBartez.num}</span> {whyBartez.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance">
            {whyBartez.title}
          </h2>
          {whyBartez.body.map((p, i) => (
            <p key={i} className="mt-5 text-[16.5px] leading-relaxed text-slate-600">{p}</p>
          ))}
          <ul className="mt-7 space-y-2.5">
            {["Stock real verificable", "Asesoramiento de ingeniería", "Factura A y cuenta corriente"].map((li) => (
              <li key={li} className="flex items-center gap-2.5 text-[15px] font-medium text-slate-700">
                <CheckCircle2 className="h-5 w-5 flex-none text-emerald" /> {li}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <Image
              src={whyImage.src}
              alt={whyImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden />
          </div>

          {/* stat flotante */}
          <div className="absolute -left-4 bottom-8 hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:block">
            <div className="font-display text-[34px] font-bold leading-none text-brand">{whyBartez.stats[0].value}</div>
            <div className="mt-1 text-[13px] text-slate-500">{whyBartez.stats[0].label}</div>
          </div>
          <div className="absolute -right-3 top-8 hidden rounded-2xl border border-white/10 bg-ink/90 px-4 py-3 text-white backdrop-blur sm:block">
            <div className="font-display text-[16px] font-bold">Atención B2B</div>
            <div className="text-[12px] text-slate-300">dedicada y directa</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
