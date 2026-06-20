import { solutions } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";
import { SectionHeading } from "../SectionHeading";
import { ArrowRight } from "lucide-react";

const gradients = [
  "from-[#16432c] to-[#0a2818]",
  "from-[#1b4d31] to-[#0c331f]",
  "from-[#123d27] to-[#08230f]",
  "from-[#1d5235] to-[#0a2818]",
  "from-[#14492e] to-[#0b2c1b]",
  "from-[#17472d] to-[#082110]",
];

export function Solutions() {
  return (
    <section id="soluciones" className="scroll-mt-20 bg-crema py-28">
      <div className="mx-auto max-w-[1200px] px-7">
        <SectionHeading
          num={solutions.num}
          eyebrow={solutions.eyebrow}
          title={solutions.title}
          desc={solutions.desc}
          className="mb-14"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.cards.map((c, i) => (
            <Reveal as="article" delay={(i % 3) * 0.07} key={c.id}>
              <a
                href="#contacto"
                className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl border border-verde/10 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-bronce/40 hover:shadow-card"
                aria-label={`${c.title} — ${c.cta}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${gradients[i % gradients.length]}`} aria-hidden />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(70% 60% at 75% 15%,rgba(184,149,106,.18),transparent 60%),linear-gradient(transparent 35%,rgba(6,20,12,.85))",
                  }}
                  aria-hidden
                />
                <span className="absolute left-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-xl border border-bronce/35 bg-white/10 text-verde-acento">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <div className="relative z-10 p-6 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bronce">{c.category}</div>
                  <h3 className="mt-2 font-serif text-[23px]">{c.title}</h3>
                  <p className="mt-1.5 text-[13.5px] text-white/70">{c.desc}</p>
                  <span className="mt-4 inline-flex translate-y-2 items-center gap-1.5 text-[14px] font-semibold text-verde-acento opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    {c.cta} <ArrowRight size={15} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
