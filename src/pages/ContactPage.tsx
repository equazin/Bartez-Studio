import { ArrowRight, Clock3, Mail, MessageCircle, Route, ShieldCheck } from 'lucide-react'
import { ContactForm } from '../components/ContactForm'
import { Button } from '../components/ui'
import { contactConfig } from '../data/site'

const nextSteps = [
  ['01', 'Revisamos el contexto', 'Leemos tu mensaje, web actual, objetivo comercial y urgencia.'],
  ['02', 'Detectamos prioridad', 'Definimos si conviene empezar por web, marca, ecommerce, automatización o pauta.'],
  ['03', 'Enviamos propuesta', 'Te devolvemos alcance recomendado, etapas y próximos pasos concretos.'],
] as const

const contactHighlights = [
  ['Respuesta comercial', 'Consultas y diagnóstico inicial sin vueltas.', MessageCircle],
  ['Criterio de prioridad', 'No vendemos todo junto si el negocio necesita empezar por otra parte.', Route],
  ['Base para decidir', 'La propuesta queda ordenada para comparar alcance, tiempos y objetivos.', ShieldCheck],
] as const

export function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 pt-12 sm:pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(53,231,255,.16),transparent_30%),radial-gradient(circle_at_78%_30%,rgba(139,92,246,.18),transparent_32%)]" />
        <div className="studio-shell relative pb-16 sm:pb-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Contacto</p>
              <h1
                className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl"
                style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}
              >
                Contanos qué querés mejorar y armamos una propuesta clara.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                En una primera conversación ordenamos contexto, prioridad y alcance. La idea es que sepas qué conviene hacer ahora, qué puede esperar y qué impacto debería tener cada decisión.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`mailto:${contactConfig.email}`} variant="secondary">
                  <Mail size={18} /> {contactConfig.email}
                </Button>
                <Button href={`https://wa.me/${contactConfig.whatsappNumber}`}>
                  WhatsApp directo <ArrowRight size={18} />
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-300/20 bg-[#07101b]/80 p-5 shadow-[0_35px_110px_rgba(53,231,255,.1)] backdrop-blur-xl sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {contactHighlights.map(([title, text, Icon]) => (
                  <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={title}>
                    <Icon className="text-studio-cyan" size={22} strokeWidth={1.8} />
                    <h2 className="mt-5 text-sm font-semibold text-white">{title}</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-night-950/65 p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="text-studio-lime" size={20} />
                  <p className="font-semibold text-white">Respuesta orientada a decisión</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Ideal si estás por lanzar, rediseñar, invertir en campañas o automatizar consultas y necesitás ordenar el primer paso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="studio-shell grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Qué pasa después</p>
              <div className="mt-6 grid gap-4">
                {nextSteps.map(([number, title, text]) => (
                  <div className="grid grid-cols-[44px_1fr] gap-4" key={number}>
                    <span className="flex size-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-sm font-bold text-studio-cyan">
                      {number}
                    </span>
                    <div className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <h2 className="font-semibold text-white">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-7 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Solicitar propuesta</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">Prepará una consulta útil en menos de dos minutos.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                El formulario arma un mensaje ordenado para WhatsApp o email. No guarda datos en un servidor en esta primera versión.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
