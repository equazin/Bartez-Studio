import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import clsx from 'clsx'
import type { PortfolioItem, Service } from '../data/site'

type ButtonProps = {
  children: ReactNode
  to?: string
  href?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export function Button({ children, to, href, type = 'button', variant = 'primary', className }: ButtonProps) {
  const classes = clsx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-studio-cyan',
    {
      'bg-gradient-to-r from-studio-cyan via-studio-blue to-studio-violet text-white shadow-[0_18px_60px_rgba(73,124,255,.28)] hover:-translate-y-0.5':
        variant === 'primary',
      'border border-cyan-300/35 bg-night-950/45 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,.18)] hover:-translate-y-0.5 hover:border-violet-300/60 hover:bg-white/[0.06]':
        variant === 'secondary',
      'text-slate-200 hover:text-white': variant === 'ghost',
    },
    className,
  )

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={classes} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button className={classes} type={type}>
      {children}
    </button>
  )
}

export function SectionHeading({
  title,
  eyebrow,
  text,
  align = 'left',
}: {
  title: string
  eyebrow?: string
  text?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={clsx('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">{eyebrow}</p> : null}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {text ? <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">{text}</p> : null}
    </div>
  )
}

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const Icon = service.icon
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="studio-card group flex h-full flex-col rounded-[2rem] p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-studio-cyan">
          <Icon size={24} strokeWidth={1.8} />
        </div>
        <ArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-studio-cyan" size={20} />
      </div>
      <h3 className="text-xl font-semibold text-white">{service.title}</h3>
      <p className="mt-3 flex-1 leading-7 text-slate-300">{service.summary}</p>
      {!compact ? <p className="mt-5 text-sm font-medium text-cyan-100">{service.benefit}</p> : null}
      <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-studio-cyan" to={`/servicios/${service.slug}`}>
        Ver detalle <ArrowRight size={16} />
      </Link>
    </motion.article>
  )
}

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="studio-card overflow-hidden rounded-[2rem]">
      <div className={clsx('h-44 bg-gradient-to-br p-5', item.accent)}>
        <div className="h-full rounded-3xl border border-white/30 bg-night-950/35 p-4 shadow-2xl backdrop-blur-md">
          <div className="h-3 w-24 rounded-full bg-white/70" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="col-span-2 h-20 rounded-2xl bg-white/22" />
            <div className="h-20 rounded-2xl bg-white/[0.14]" />
          </div>
          <div className="mt-3 h-3 w-2/3 rounded-full bg-white/35" />
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-studio-cyan">{item.category}</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
        <dl className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
          <div>
            <dt className="font-semibold text-white">Problema</dt>
            <dd>{item.problem}</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Solución</dt>
            <dd>{item.solution}</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Resultado esperado</dt>
            <dd>{item.result}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export function PlanCard({
  plan,
}: {
  plan: {
    name: string
    description: string
    price: string
    featured?: boolean
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
    features: string[]
  }
}) {
  const Icon = plan.icon
  return (
    <article
      className={clsx(
        'relative flex h-full flex-col rounded-[2rem] border p-6',
        plan.featured
          ? 'border-cyan-200/40 bg-cyan-300/[0.09] shadow-glow'
          : 'border-white/10 bg-white/[0.045] backdrop-blur-xl',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
          <p className="mt-2 leading-7 text-slate-300">{plan.description}</p>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-studio-cyan">
          <Icon size={23} strokeWidth={1.8} />
        </div>
      </div>
      <p className="mt-7 text-3xl font-bold text-white">{plan.price}</p>
      <ul className="mt-7 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-200" key={feature}>
            <Check className="mt-0.5 shrink-0 text-studio-lime" size={18} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="mt-8 w-full" to="/contacto" variant={plan.featured ? 'primary' : 'secondary'}>
        Solicitar propuesta
      </Button>
    </article>
  )
}

export function CTASection() {
  return (
    <section className="section-y">
      <div className="studio-shell">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-[#07101b] p-8 shadow-[0_35px_130px_rgba(53,231,255,.12)] backdrop-blur-xl sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(53,231,255,.22),transparent_30%),radial-gradient(circle_at_84%_42%,rgba(139,92,246,.26),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.04),transparent_42%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Tu web no debería ser solo una vidriera. Debería trabajar para tu negocio.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Pedí un diagnóstico inicial y te devolvemos una propuesta clara: prioridades, alcance recomendado y próximos pasos para mejorar imagen, conversión y operación.
              </p>
              <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
                {['Sin vueltas', 'Enfoque comercial', 'Próximos pasos claros'].map((item) => (
                  <span className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-slate-200" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-[#050914]/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-studio-cyan">Siguiente paso</p>
              <p className="mt-4 text-2xl font-bold text-white">Diagnóstico + propuesta</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Ideal si querés rediseñar, lanzar una landing, mejorar ecommerce o automatizar consultas.
              </p>
              <Button className="mt-6 w-full rounded-[10px]" to="/contacto">
                Pedir diagnóstico <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
