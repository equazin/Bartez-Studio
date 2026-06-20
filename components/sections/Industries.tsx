import Image from "next/image";
import { Check } from "lucide-react";
import { industries } from "../../constants";
import { Reveal } from "../motion";

export function Industries() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-7 md:grid-cols-2">
        <Reveal className="relative order-2 md:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <Image
              src={industries.image}
              alt={industries.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/30 to-transparent" aria-hidden />
          </div>
        </Reveal>

        <div className="order-1 md:order-2">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
            <span className="font-mono text-slate-400">{industries.num}</span> {industries.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink text-balance">
            {industries.title}
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-slate-600">{industries.desc}</p>

          <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {industries.items.map((it, i) => (
              <Reveal as="li" key={it} delay={i * 0.04} className="flex items-center gap-2.5 text-[15px] font-medium text-slate-700">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand/10 text-brand">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                {it}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
