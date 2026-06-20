import { pillars } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";

export function Pillars() {
  return (
    <section className="bg-crema py-24">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.items.map((p, i) => (
            <Reveal as="article" delay={i * 0.08} key={p.title} className="rounded-3xl border border-verde/10 bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
              <span className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-verde/5 text-verde">
                <Icon name={p.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-[22px] text-verde-deep">{p.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#4a5a50]">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
