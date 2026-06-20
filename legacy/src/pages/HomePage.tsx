import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSearch,
  MessageSquareText,
  Quote,
  TrendingUp,
} from 'lucide-react'
import { HeroMockup } from '../components/HeroMockup'
import { Button, CTASection, SectionHeading, ServiceCard } from '../components/ui'
import { benefits, differentiators, faqs, plans, portfolio, processSteps, services } from '../data/site'

const trustLogos = ['NEXORA', 'Valora', 'kuvo', 'LUMINA', 'ORBITAL', 'INVEXO']

const diagnosticItems = [
  ['Auditoría visual', 'Detectamos qué está afectando confianza, claridad y percepción profesional.', FileSearch],
  ['Mapa de mejoras', 'Priorizamos cambios por impacto: imagen, conversión, contenido y operación.', CheckCircle2],
  ['Propuesta accionable', 'Te indicamos qué conviene hacer primero y qué puede esperar.', MessageSquareText],
  ['Respuesta rápida', 'Ideal para decidir antes de invertir en pauta, rediseño o ecommerce.', Clock3],
] as const

const proposalItems = [
  ['Diagnóstico de situación', 'Qué está frenando confianza, claridad o conversión hoy.', FileSearch],
  ['Prioridades de implementación', 'Qué conviene resolver primero para no gastar de más.', ClipboardCheck],
  ['Alcance recomendado', 'Una propuesta ordenada por etapas, entregables y próximos pasos.', BadgeCheck],
] as const

const trustQuotes = [
  {
    quote: 'Necesitábamos una web que explicara mejor la empresa y filtrara consultas. El enfoque fue claro desde el diagnóstico.',
    author: 'Dirección comercial',
    company: 'Empresa industrial B2B',
  },
  {
    quote: 'El valor estuvo en ordenar marca, contenido y recorrido comercial antes de diseñar pantallas.',
    author: 'Fundador',
    company: 'Marca de servicios profesionales',
  },
  {
    quote: 'Pasamos de piezas sueltas a un sistema visual que el equipo puede sostener en campañas y presentaciones.',
    author: 'Marketing',
    company: 'Negocio en crecimiento',
  },
] as const

export function HomePage() {
  return (
    <>
      <section className="relative -mt-[76px] overflow-hidden border-b border-white/10 pt-[90px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_52%,rgba(73,124,255,.24),transparent_34%),radial-gradient(circle_at_52%_75%,rgba(139,92,246,.22),transparent_26%),linear-gradient(180deg,#03050b_0%,#050914_58%,#07101d_100%)]" />
        <div className="absolute inset-y-20 right-0 hidden w-[42%] opacity-55 [background-image:linear-gradient(115deg,rgba(53,231,255,.14)_1px,transparent_1px),linear-gradient(35deg,rgba(139,92,246,.16)_1px,transparent_1px)] [background-size:94px_94px] lg:block" />

        <div className="studio-shell relative">
          <div className="grid min-h-[560px] gap-12 pt-10 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:pt-10 xl:min-h-[585px]">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <h1
                className="max-w-[800px] text-[2.65rem] font-bold leading-[1.08] tracking-[-0.045em] text-white sm:text-6xl xl:w-[760px] xl:max-w-none xl:text-[3.35rem]"
                style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}
              >
                <span className="hidden xl:block">
                  Diseño, tecnología y
                  <br />
                  estrategia digital para empresas
                  <br />
                  que quieren verse mejor y
                  <br />
                  <span className="bg-gradient-to-r from-studio-cyan via-studio-blue to-studio-violet bg-clip-text text-transparent">
                    vender mejor.
                  </span>
                </span>
                <span className="xl:hidden">
                  Diseño, tecnología y estrategia digital para empresas que quieren verse mejor y{' '}
                  <span className="bg-gradient-to-r from-studio-cyan via-studio-blue to-studio-violet bg-clip-text text-transparent">
                    vender mejor.
                  </span>
                </span>
              </h1>
              <p className="mt-8 max-w-[650px] text-lg leading-8 text-slate-300 xl:text-xl">
                Creamos experiencias digitales, marcas memorables y sistemas que convierten. De la idea a los resultados, con estrategia y tecnología.
              </p>
              <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                <Button className="h-[64px] w-full rounded-[8px] px-9 text-base sm:w-auto" to="/contacto">
                  Solicitar propuesta <ArrowRight size={22} />
                </Button>
                <Button className="h-[64px] w-full rounded-[8px] px-10 text-base sm:w-auto" to="/servicios" variant="secondary">
                  Ver servicios <ArrowRight size={22} />
                </Button>
              </div>
            </motion.div>
            <HeroMockup />
          </div>

          <div className="grid gap-8 border-t border-white/10 py-7 lg:grid-cols-[220px_1fr] lg:items-center">
            <p className="text-sm leading-5 text-slate-400">
              Empresas que confían
              <br />
              en nuestro trabajo
            </p>
            <div className="grid grid-cols-2 gap-6 text-center text-lg font-semibold tracking-[0.22em] text-slate-500 sm:grid-cols-3 lg:grid-cols-6">
              {trustLogos.map((logo) => (
                <span className="opacity-75" key={logo}>
                  {logo}
                </span>
              ))}
            </div>
          </div>

          <HeroServicesPreview />
        </div>

        <a
          className="absolute bottom-6 right-8 hidden size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-studio-cyan xl:flex"
          href="#servicios-detalle"
          aria-label="Ver más"
        >
          <ArrowDown size={22} />
        </a>
      </section>

      <section id="servicios-detalle" className="section-y border-y border-white/10 bg-white/[0.018]">
        <div className="studio-shell">
          <SectionHeading
            eyebrow="Servicios"
            title="Soluciones visuales, comerciales y tecnológicas para que tu presencia digital tenga dirección."
            text="Cada servicio puede funcionar de forma independiente o integrarse en una solución completa: marca, sitio, ecommerce, campaña y herramientas internas."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard service={service} key={service.slug} />
            ))}
          </div>
        </div>
      </section>

      <DiagnosticOffer />

      <OutcomeSection />

      <TrustAndProposalSection />

      <ProcessSection />

      <FeaturedCasesSection />

      <section className="section-y border-y border-white/10 bg-white/[0.025]">
        <div className="studio-shell">
          <SectionHeading align="center" eyebrow="Diferenciales" title="Un estudio propio para conectar estética, negocio y tecnología." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item) => {
              const Icon = item.icon
              return (
                <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-6" key={item.title}>
                  <Icon className="text-studio-violet" size={24} />
                  <h3 className="mt-5 font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <PlansSection />

      <CTASection />

      <section id="faq" className="section-y pt-0">
        <div className="studio-shell">
          <SectionHeading align="center" eyebrow="FAQ" title="Preguntas frecuentes antes de pedir una propuesta." />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqs.map((faq) => (
              <details className="rounded-3xl border border-white/10 bg-white/[0.045] p-5" key={faq.question}>
                <summary className="cursor-pointer text-lg font-semibold text-white">{faq.question}</summary>
                <p className="mt-4 leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function OutcomeSection() {
  return (
    <section className="section-y">
      <div className="studio-shell">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07101b] p-6 shadow-[0_30px_120px_rgba(0,0,0,.32)] sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(53,231,255,.18),transparent_34%),radial-gradient(circle_at_84%_72%,rgba(139,92,246,.2),transparent_36%)]" />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-studio-cyan">Impacto esperado</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">De presencia digital a sistema comercial</h3>
                </div>
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                  Activo
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ['Confianza', '+ clara'],
                  ['Consultas', '+ orden'],
                  ['Campañas', '+ base'],
                ].map(([label, value]) => (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={label}>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
                    <p className="mt-3 text-2xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-[#050a14]/85 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="font-semibold text-white">Recorrido de conversión</p>
                  <p className="text-sm text-studio-cyan">visita → consulta</p>
                </div>
                <div className="grid gap-4">
                  {[
                    ['Mensaje claro', 'El usuario entiende qué hacés y por qué debería confiar.'],
                    ['Prueba visual', 'La marca se percibe sólida antes de hablar con ventas.'],
                    ['CTA directo', 'El camino hacia WhatsApp o propuesta queda visible.'],
                  ].map(([title, text], index) => (
                    <div className="grid gap-3 sm:grid-cols-[120px_1fr]" key={title}>
                      <span className="text-sm font-semibold text-slate-300">0{index + 1}. {title}</span>
                      <span className="h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.span
                          initial={{ width: 0 }}
                          whileInView={{ width: `${72 + index * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: index * 0.12 }}
                          className="block h-full rounded-full bg-gradient-to-r from-studio-cyan to-studio-violet"
                        />
                      </span>
                      <p className="text-sm leading-6 text-slate-400 sm:col-start-2">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Beneficios"
              title="No vendemos solo diseño. Diseñamos activos que ayudan a vender, ordenar y escalar."
              text="La experiencia visual, el contenido y la tecnología se trabajan juntos para que cada punto de contacto tenga una función concreta."
            />
            <div className="mt-8 grid gap-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <article className="group rounded-[1.15rem] border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-300/35 hover:bg-white/[0.055]" key={benefit.title}>
                    <div className="flex gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-studio-cyan transition group-hover:bg-cyan-300/10">
                        <Icon size={21} />
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">{benefit.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{benefit.text}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustAndProposalSection() {
  return (
    <section id="proceso" className="section-y border-y border-white/10 bg-[#050914]">
      <div className="studio-shell">
        <div className="grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Confianza"
              title="Antes de pedirte que inviertas, te mostramos qué vamos a mejorar y por qué."
              text="La propuesta no es una lista genérica de pantallas. Parte de un diagnóstico comercial, visual y técnico para decidir con criterio."
            />
            <div className="mt-8 grid gap-4">
              {proposalItems.map(([title, text, Icon]) => (
                <article className="rounded-[1.15rem] border border-white/10 bg-white/[0.04] p-5" key={title}>
                  <div className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-studio-cyan">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['48 hs', 'para orientar próximos pasos'],
                ['3 etapas', 'diagnóstico, propuesta, ejecución'],
                ['1 foco', 'mejorar imagen y conversión'],
              ].map(([metric, label]) => (
                <div className="rounded-[1.2rem] border border-cyan-300/15 bg-cyan-300/[0.055] p-5" key={metric}>
                  <p className="text-3xl font-bold text-white">{metric}</p>
                  <p className="mt-2 text-sm leading-6 text-cyan-100/75">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {trustQuotes.map((item) => (
                <article className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5" key={item.company}>
                  <Quote className="absolute right-5 top-5 text-white/10" size={38} />
                  <p className="relative min-h-32 text-sm leading-7 text-slate-300">“{item.quote}”</p>
                  <div className="relative mt-5 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">{item.author}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.company}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const firstSteps = processSteps.slice(0, 3)
  const executionSteps = processSteps.slice(3)

  return (
    <section className="section-y border-y border-white/10 bg-[#050914]">
      <div className="studio-shell">
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Proceso"
              title="Un método simple para avanzar con claridad, sin improvisar decisiones críticas."
              text="El proceso separa decisión, diseño y ejecución. Así cada etapa tiene un objetivo concreto y evita sumar contenido, pantallas o integraciones sin criterio."
            />
            <div className="mt-8 rounded-[1.35rem] border border-cyan-300/20 bg-cyan-300/[0.055] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-studio-cyan">Punto de control</p>
              <p className="mt-3 text-lg font-semibold leading-7 text-white">Antes de desarrollar, validamos mensaje, recorrido y CTA principal.</p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-white/10 bg-[#07101b] p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Definición</p>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {firstSteps.map(([number, title, text]) => (
                  <article className="rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-5" key={number}>
                    <p className="text-sm font-bold text-studio-cyan">{number}</p>
                    <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Producción y mejora</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {executionSteps.map(([number, title, text], index) => (
                  <article className="grid gap-4 rounded-[1.25rem] border border-white/10 bg-[#07101b] p-5 sm:grid-cols-[56px_1fr]" key={number}>
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-sm font-bold text-studio-cyan">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                      <span className="mt-4 block h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.span
                          initial={{ width: 0 }}
                          whileInView={{ width: `${68 + index * 8}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="block h-full rounded-full bg-gradient-to-r from-studio-cyan to-studio-violet"
                        />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedCasesSection() {
  const featured = portfolio.slice(0, 3)

  return (
    <section className="section-y">
      <div className="studio-shell">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <SectionHeading
            eyebrow="Casos"
            title="Problemas concretos, soluciones digitales y resultados esperados."
            text="Mostramos casos de referencia para que se entienda cómo pensamos cada proyecto: no desde la estética aislada, sino desde el impacto comercial."
          />
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['Imagen', 'confianza'],
                ['UX', 'claridad'],
                ['CTA', 'consulta'],
              ].map(([label, value]) => (
                <div className="rounded-2xl bg-[#07101b] p-4" key={label}>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                  <p className="mt-2 font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <CaseFeature item={featured[0]} large />
          <div className="grid gap-5">
            {featured.slice(1).map((item) => (
              <CaseFeature item={item} key={item.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CaseFeature({ item, large = false }: { item: (typeof portfolio)[number]; large?: boolean }) {
  return (
    <article className="group self-start overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101b]">
      <div className={`relative overflow-hidden bg-gradient-to-br ${item.accent} ${large ? 'h-72' : 'h-44'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.34),transparent_22%),linear-gradient(180deg,rgba(5,7,13,.05),rgba(5,7,13,.55))]" />
        <div className="absolute inset-x-6 bottom-6 rounded-[1rem] border border-white/30 bg-[#050914]/55 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{item.category}</p>
              <p className="mt-2 text-lg font-bold text-white">{item.title}</p>
            </div>
            <TrendingUp className="shrink-0 text-white" size={28} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-6">
        {[
          ['Problema', item.problem],
          ['Solución', item.solution],
          ['Resultado', item.result],
        ].map(([label, text]) => (
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.035] p-4" key={label}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-studio-cyan">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function PlansSection() {
  return (
    <section className="section-y">
      <div className="studio-shell">
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <SectionHeading
            eyebrow="Planes"
            title="Tres formas de empezar según el momento de tu negocio."
            text="No son paquetes cerrados de plantilla. Son puntos de partida para definir alcance, prioridad y velocidad de implementación."
          />
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {['Presencia', 'Crecimiento', 'Sistema'].map((item) => (
                <span className="rounded-2xl bg-[#07101b] px-4 py-3 text-center text-sm font-semibold text-slate-200" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <article
                className={`relative overflow-hidden rounded-[2rem] border p-6 ${
                  plan.featured ? 'border-cyan-200/40 bg-[#07101b] shadow-[0_35px_120px_rgba(53,231,255,.12)]' : 'border-white/10 bg-white/[0.045]'
                }`}
                key={plan.name}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${plan.featured ? 'from-studio-cyan via-studio-blue to-studio-violet' : 'from-white/10 to-white/0'}`} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-studio-cyan">Plan</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{plan.description}</p>
                  </div>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-studio-cyan">
                    <Icon size={23} strokeWidth={1.8} />
                  </span>
                </div>

                <div className="mt-7 rounded-[1.15rem] border border-white/10 bg-night-950/65 p-4">
                  <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Inversión</p>
                  <p className="mt-2 text-3xl font-bold text-white">{plan.price}</p>
                </div>

                <ul className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <li className="flex gap-3 text-sm leading-6 text-slate-200" key={feature}>
                      <CheckCircle2 className="mt-0.5 shrink-0 text-studio-lime" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="mt-8 w-full rounded-[10px]" to="/contacto" variant={plan.featured ? 'primary' : 'secondary'}>
                  Solicitar propuesta <ArrowRight size={18} />
                </Button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function DiagnosticOffer() {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
      <div className="studio-shell">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07101b] shadow-[0_30px_110px_rgba(0,0,0,.28)] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative p-7 sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(53,231,255,.14),transparent_34%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,.16),transparent_38%)]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-studio-cyan">Oferta inicial</p>
              <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-5xl" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                Pedí un diagnóstico digital antes de rediseñar, pautar o automatizar.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Revisamos tu presencia actual, detectamos fricciones visuales y comerciales, y te devolvemos prioridades claras para avanzar sin invertir a ciegas.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-[8px] px-8" to="/contacto">
                  Pedir diagnóstico <ArrowRight size={18} />
                </Button>
                <Button className="rounded-[8px] px-8" to="/servicios/consultoria-digital" variant="secondary">
                  Ver consultoría
                </Button>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-[#050a14] p-5 sm:p-8 lg:border-l lg:border-t-0">
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(53,231,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative grid gap-4">
              {diagnosticItems.map(([title, text, Icon]) => (
                <article className="rounded-[1.1rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl" key={String(title)}>
                  <div className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/15 to-violet-400/15 text-studio-cyan">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroServicesPreview() {
  return (
    <div className="mb-0 rounded-t-[18px] border border-b-0 border-white/10 bg-[#07101b]/90 p-6 shadow-[0_-20px_90px_rgba(53,231,255,.07)] backdrop-blur-2xl lg:p-7">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-studio-cyan">Qué hacemos</p>
          <h2 className="mt-6 max-w-[270px] text-2xl font-semibold leading-tight tracking-[-0.02em] text-white lg:text-3xl">
            Soluciones digitales pensadas para crecer tu negocio
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <article className="min-h-[178px] rounded-[10px] border border-white/10 bg-[#0b1422]/85 p-5 transition hover:-translate-y-1 hover:border-violet-300/45" key={service.slug}>
                <Icon className="text-studio-violet" size={32} strokeWidth={1.75} />
                <h3 className="mt-9 text-base font-semibold text-white">{service.shortTitle === 'Web' ? 'Diseño Web' : service.shortTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{service.benefit}</p>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
