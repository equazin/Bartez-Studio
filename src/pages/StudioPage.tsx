import { ArrowRight, Blocks, Compass, Cpu, Gem, GitBranch, Layers3, MessageSquareText, PenTool, Rocket } from 'lucide-react'
import { Button, CTASection, SectionHeading } from '../components/ui'

const focusAreas = [
  ['Diseño premium', 'Jerarquía, estética y consistencia visual para que la marca se perciba mejor.', Gem],
  ['Estrategia digital', 'Mensajes, secciones y CTAs pensados para generar consultas reales.', Compass],
  ['Tecnología aplicada', 'Implementaciones rápidas, mantenibles y preparadas para evolucionar.', Cpu],
  ['Sistemas escalables', 'Componentes y contenidos que pueden crecer sin rediseñar desde cero.', Blocks],
] as const

const methodSteps = [
  ['Diagnóstico', 'Entendemos negocio, oferta, audiencia, objeciones y puntos de fricción.'],
  ['Dirección', 'Definimos arquitectura, narrativa, sistema visual y recorrido de conversión.'],
  ['Producción', 'Diseñamos, desarrollamos y dejamos una base preparada para publicar y escalar.'],
] as const

const studioPrinciples = [
  ['Menos piezas sueltas', 'Construimos sistemas visuales y digitales que se puedan sostener.', Layers3],
  ['Más criterio comercial', 'Cada bloque debe explicar, generar confianza o acercar una consulta.', MessageSquareText],
  ['Diseño publicable', 'Buscamos una primera versión sólida, no una maqueta que no llega a producción.', Rocket],
  ['Arquitectura frontend', 'Componentes claros, responsive y preparados para crecer con nuevas páginas.', GitBranch],
] as const

export function StudioPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 pt-12 sm:pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(53,231,255,.16),transparent_32%),radial-gradient(circle_at_76%_24%,rgba(139,92,246,.18),transparent_34%)]" />
        <div className="studio-shell relative pb-16 sm:pb-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Nosotros</p>
              <h1
                className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl"
                style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}
              >
                Una división creativa/digital para transformar imagen, ventas y operación.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Bartez Studio funciona como una unidad propia dentro del ecosistema Bartez: más enfocada en identidad, experiencia, conversión y producto digital.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/contacto">
                  Hablar del proyecto <ArrowRight size={18} />
                </Button>
                <Button to="/portfolio" variant="secondary">
                  Ver enfoque
                </Button>
              </div>
            </div>

            <StudioConsole />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="studio-shell">
          <SectionHeading
            align="center"
            eyebrow="Enfoque"
            title="Combinamos criterio de diseño, visión comercial y arquitectura frontend."
            text="La estética importa, pero no alcanza. El trabajo debe ordenar mensajes, generar confianza, facilitar consultas y dejar una base técnica mantenible."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {focusAreas.map(([title, text, Icon]) => (
              <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-cyan-300/30" key={title}>
                <Icon className="text-studio-cyan" size={26} strokeWidth={1.8} />
                <h2 className="mt-5 font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-y border-white/10 bg-white/[0.025]">
        <div className="studio-shell grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
          <SectionHeading
            eyebrow="Método"
            title="Trabajamos con etapas visibles para reducir incertidumbre."
            text="Preferimos avanzar con decisiones justificadas, entregables concretos y una primera versión publicable. Cada etapa debe acercar el proyecto a un resultado comercial."
          />
          <div className="grid gap-4">
            {methodSteps.map(([title, text], index) => (
              <article className="grid gap-5 rounded-[1.5rem] border border-white/10 bg-[#07101b] p-5 sm:grid-cols-[76px_1fr]" key={title}>
                <span className="flex size-16 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-xl font-bold text-studio-cyan">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                  <p className="mt-2 leading-7 text-slate-300">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="studio-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#07101b] p-6 shadow-[0_35px_130px_rgba(53,231,255,.1)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(53,231,255,.18),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(139,92,246,.22),transparent_34%)]" />
            <div className="relative rounded-[1.25rem] border border-white/10 bg-night-950/70 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <PenTool className="text-studio-cyan" size={22} />
                  <p className="font-semibold text-white">Bartez Studio OS</p>
                </div>
                <span className="rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1.5 text-xs font-semibold text-lime-100">Activo</span>
              </div>
              <div className="mt-5 grid gap-3">
                {['Diagnóstico comercial', 'Sistema visual', 'Frontend escalable', 'Conversión y medición'].map((item, index) => (
                  <div className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-4" key={item}>
                    <p className="text-sm font-semibold text-slate-300">0{index + 1}. {item}</p>
                    <span className="h-3 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-studio-cyan to-studio-violet"
                        style={{ width: `${76 + index * 6}%` }}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Principios" title="Diseñamos para que el negocio se vea mejor y funcione mejor." />
            <div className="mt-8 grid gap-4">
              {studioPrinciples.map(([title, text, Icon]) => (
                <article className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5" key={title}>
                  <div className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-studio-cyan">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h2 className="font-semibold text-white">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}

function StudioConsole() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-cyan-300/20 bg-[#07101b] p-5 shadow-[0_35px_130px_rgba(53,231,255,.1)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(53,231,255,.2),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(139,92,246,.22),transparent_32%)]" />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Studio model</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Diseño + tecnología + ventas</h2>
          </div>
          <span className="hidden rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 sm:inline-flex">
            Premium digital
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Imagen', 'confianza'],
            ['UX', 'claridad'],
            ['Tech', 'escala'],
          ].map(([label, value]) => (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={label}>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className="mt-3 text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-night-950/65 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-studio-cyan">Rol dentro de Bartez</p>
          <p className="mt-3 leading-7 text-slate-200">
            Una unidad creativa y digital con identidad propia, conectada al criterio tecnológico de Bartez pero enfocada en marca, experiencia y conversión.
          </p>
        </div>
      </div>
    </div>
  )
}
