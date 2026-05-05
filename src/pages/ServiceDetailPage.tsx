import type { ComponentType } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileCheck2, Layers3, LineChart, Target } from 'lucide-react'
import { Button, CTASection, SectionHeading } from '../components/ui'
import { services } from '../data/site'
import { RelatedServices } from './ServicesPage'

const decisionSteps = [
  ['Contexto', 'Qué necesita vender, explicar u ordenar el negocio.'],
  ['Criterio', 'Qué debe comunicar la experiencia para generar confianza.'],
  ['Sistema', 'Qué entregables permiten sostener la solución después del lanzamiento.'],
] as const

export function ServiceDetailPage() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)

  if (!service) {
    return <Navigate to="/servicios" replace />
  }

  const Icon = service.icon

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 pt-12 sm:pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(53,231,255,.16),transparent_32%),radial-gradient(circle_at_72%_16%,rgba(139,92,246,.18),transparent_34%)]" />
        <div className="studio-shell relative pb-16 sm:pb-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Servicio</p>
              <h1
                className="text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl"
                style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}
              >
                {service.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{service.summary}</p>
              <div className="mt-6 rounded-[1.35rem] border border-cyan-200/20 bg-cyan-300/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-studio-cyan">Beneficio central</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-cyan-50">{service.benefit}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/contacto">
                  Solicitar propuesta <ArrowRight size={18} />
                </Button>
                <Button to="/portfolio" variant="secondary">
                  Ver ejemplos
                </Button>
              </div>
            </div>

            <ServiceSignalPanel serviceTitle={service.title} fit={service.fit} highlights={service.highlights} Icon={Icon} />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="studio-shell grid gap-10 lg:grid-cols-[.86fr_1.14fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Enfoque"
              title="Antes de diseñar pantallas, definimos qué tiene que resolver este servicio."
              text="La solución no se mide por cantidad de secciones, sino por claridad comercial, confianza visual y capacidad de generar acción."
            />
          </div>
          <div className="grid gap-4">
            {decisionSteps.map(([title, text], index) => (
              <article className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 sm:grid-cols-[64px_1fr]" key={title}>
                <span className="flex size-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-sm font-bold text-studio-cyan">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-white">{title}</h2>
                  <p className="mt-2 leading-7 text-slate-300">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-y border-white/10 bg-white/[0.025]">
        <div className="studio-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <SectionHeading title="Qué incluye" text="Entregables pensados para que el proyecto no quede en una pieza aislada, sino en una base clara para vender y operar." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <article className="rounded-[1.35rem] border border-white/10 bg-[#07101b] p-5" key={item}>
                  <FileCheck2 className="text-studio-lime" size={22} />
                  <p className="mt-5 font-semibold leading-7 text-white">{item}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-cyan-300/20 bg-[#07101b] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Resultados esperados</p>
            <div className="mt-6 grid gap-4">
              {service.outcomes.map((item) => (
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={item}>
                  <CheckCircle2 className="mt-1 shrink-0 text-studio-lime" size={20} />
                  <p className="font-semibold leading-7 text-white">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-night-950/65 p-5">
              <p className="text-sm leading-6 text-slate-400">
                Si el alcance todavía no está claro, partimos con diagnóstico para ordenar prioridades antes de presupuestar una implementación completa.
              </p>
              <Button className="mt-5 w-full rounded-[10px]" to="/contacto">
                Pedir diagnóstico <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="studio-shell">
          <SectionHeading eyebrow="También puede interesarte" title="Servicios relacionados para construir una solución completa." />
          <div className="mt-10">
            <RelatedServices currentSlug={service.slug} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

function ServiceSignalPanel({
  serviceTitle,
  fit,
  highlights,
  Icon,
}: {
  serviceTitle: string
  fit: string
  highlights: string[]
  Icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}) {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-cyan-300/20 bg-[#07101b] p-5 shadow-[0_35px_130px_rgba(53,231,255,.1)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(53,231,255,.2),transparent_30%),radial-gradient(circle_at_88%_74%,rgba(139,92,246,.22),transparent_32%)]" />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-studio-cyan">
              <Icon size={28} strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Solución recomendada</p>
              <h2 className="text-xl font-bold text-white">{serviceTitle}</h2>
            </div>
          </div>
          <span className="hidden rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-semibold text-lime-100 sm:inline-flex">
            En evaluación
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Claridad', Target],
            ['Sistema', Layers3],
            ['Conversión', LineChart],
          ].map(([label, SignalIcon]) => (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={label as string}>
              <SignalIcon className="text-studio-cyan" size={20} />
              <p className="mt-4 text-sm font-semibold text-white">{label as string}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-night-950/65 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Ideal para</p>
          <p className="mt-3 leading-7 text-slate-200">{fit}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <span className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-slate-200" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
