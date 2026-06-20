import { services } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";
import { SectionHeading } from "../SectionHeading";

export function Services() {
  return (
    <section id="servicios" className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-tech [background-size:48px_48px] opacity-50 [mask-image:radial-gradient(100%_100%_at_50%_0%,#000,transparent_75%)]" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-brand/20 blur-[110px]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1200px] px-7">
        <SectionHeading num={services.num} eyebrow={services.eyebrow} title={services.title} desc={services.desc} light className="mb-14" />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => (
            <Reveal as="article" delay={(i % 3) * 0.06} key={s.title} className="group bg-ink p-7 transition-colors hover:bg-navy">
              <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky transition-colors group-hover:border-accent/40 group-hover:text-accent">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display text-[18px] font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
