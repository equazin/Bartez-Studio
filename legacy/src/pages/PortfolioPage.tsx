import { ArrowRight, BarChart3, Layers3, LineChart, SearchCheck, Sparkles } from 'lucide-react'
import { Button, CTASection, SectionHeading } from '../components/ui'
import { portfolio } from '../data/site'

const portfolioSignals = [
  ['Problema real', 'Partimos de fricción comercial, no de una estética aislada.', SearchCheck],
  ['Sistema visual', 'Ordenamos estructura, contenido, interfaz y consistencia.', Layers3],
  ['Resultado esperado', 'Cada caso termina en una mejora concreta para vender u operar.', LineChart],
] as const

export function PortfolioPage() {
  const [mainCase, ...secondaryCases] = portfolio

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 pt-12 sm:pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(53,231,255,.16),transparent_32%),radial-gradient(circle_at_76%_24%,rgba(139,92,246,.18),transparent_34%)]" />
        <div className="studio-shell relative pb-16 sm:pb-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-end">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Portfolio</p>
              <h1
                className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl"
                style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}
              >
                Casos de referencia para ver cómo pensamos diseño, negocio y tecnología.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Estos proyectos son placeholders estratégicos. Sirven para mostrar el tipo de problemas que resolvemos y cómo convertimos una necesidad comercial en un activo digital claro.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/contacto">
                  Quiero un caso así <ArrowRight size={18} />
                </Button>
                <Button to="/servicios" variant="secondary">
                  Ver servicios
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {portfolioSignals.map(([title, text, Icon]) => (
                <article className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl" key={title}>
                  <Icon className="text-studio-cyan" size={24} strokeWidth={1.8} />
                  <h2 className="mt-5 font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="studio-shell">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <CaseStudy item={mainCase} featured />
            <div className="grid gap-5">
              {secondaryCases.slice(0, 2).map((item) => (
                <CaseStudy item={item} key={item.title} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-y border-white/10 bg-white/[0.025]">
        <div className="studio-shell grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <SectionHeading
            eyebrow="Lectura de casos"
            title="No buscamos mostrar pantallas sueltas. Buscamos explicar decisiones."
            text="Cada proyecto se evalúa por tres capas: qué problema tenía el negocio, qué solución digital se construyó y qué resultado debería generar."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {secondaryCases.slice(2).map((item) => (
              <MiniCase item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}

function CaseStudy({ item, featured = false }: { item: (typeof portfolio)[number]; featured?: boolean }) {
  return (
    <article className="self-start overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101b]">
      <div className={`relative overflow-hidden bg-gradient-to-br ${item.accent} ${featured ? 'h-80' : 'h-52'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,.38),transparent_24%),linear-gradient(180deg,rgba(3,5,11,.04),rgba(3,5,11,.68))]" />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#050914]/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-xl">
          <Sparkles size={14} /> {item.category}
        </div>
        <div className="absolute inset-x-5 bottom-5 rounded-[1.15rem] border border-white/25 bg-[#050914]/60 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">Caso de referencia</p>
              <h2 className="mt-2 max-w-xl text-2xl font-bold text-white">{item.title}</h2>
            </div>
            <BarChart3 className="hidden shrink-0 text-white sm:block" size={34} />
          </div>
        </div>
      </div>

      <div className={`grid gap-4 p-5 sm:p-6 ${featured ? 'lg:grid-cols-3' : ''}`}>
        {[
          ['Problema', item.problem],
          ['Solución', item.solution],
          ['Resultado', item.result],
        ].map(([label, text]) => (
          <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.04] p-5" key={label}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-studio-cyan">{label}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function MiniCase({ item }: { item: (typeof portfolio)[number] }) {
  return (
    <article className="group rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30">
      <div className={`mb-5 h-2 rounded-full bg-gradient-to-r ${item.accent}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-studio-cyan">{item.category}</p>
      <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
      <p className="mt-4 text-sm leading-6 text-slate-400">{item.result}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-studio-cyan">
        Ver enfoque <ArrowRight className="transition group-hover:translate-x-1" size={16} />
      </span>
    </article>
  )
}
