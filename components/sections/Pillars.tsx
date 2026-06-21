import { pillars } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";

export function Pillars() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-[1200px] px-7">
        <h2 className="sr-only">{pillars.title}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.items.map((p, i) => (
            <Reveal
              as="article"
              delay={i * 0.08}
              key={p.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-card"
            >
              <span className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon name={p.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display text-[19px] font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
