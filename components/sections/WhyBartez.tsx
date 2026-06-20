import { whyBartez } from "../../constants";
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

        <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
          {whyBartez.stats.map((s, i) => (
            <div key={s.label} className={`rounded-2xl border border-slate-200 p-7 transition-all hover:border-brand/40 hover:shadow-card ${i === 0 ? "bg-ink text-white sm:col-span-2" : "bg-slate-50"}`}>
              <div className={`font-display text-[40px] font-bold leading-none ${i === 0 ? "text-gradient" : "text-brand"}`}>{s.value}</div>
              <div className={`mt-2 text-[14px] uppercase tracking-[0.08em] ${i === 0 ? "text-slate-300" : "text-slate-500"}`}>{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
