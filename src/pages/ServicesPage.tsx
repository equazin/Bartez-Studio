import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CTASection, SectionHeading, ServiceCard } from '../components/ui'
import { services } from '../data/site'

export function ServicesPage() {
  return (
    <>
      <section className="section-y">
        <div className="studio-shell">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">Servicios</p>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Diseño, ecommerce, branding y herramientas digitales con foco comercial.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Bartez Studio trabaja sobre los puntos donde una empresa gana o pierde confianza: cómo se presenta, cómo vende, cómo responde consultas y cómo organiza su operación digital.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard service={service} key={service.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-y border-white/10 bg-white/[0.025]">
        <div className="studio-shell grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Cómo elegir"
            title="Si no tenés claro por dónde empezar, partimos de diagnóstico."
            text="La solución correcta depende de qué está frenando el crecimiento: imagen, claridad comercial, conversión, operación o consistencia visual."
          />
          <div className="grid gap-4">
            {[
              'Si necesitás más confianza: web institucional o branding.',
              'Si necesitás vender online: ecommerce y experiencia de compra.',
              'Si ya recibís consultas pero perdés seguimiento: automatización y dashboards.',
              'Si vas a invertir en pauta: landing y piezas de campaña con mensaje específico.',
            ].map((item) => (
              <div className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.045] p-5" key={item}>
                <CheckCircle2 className="mt-1 shrink-0 text-studio-lime" size={22} />
                <p className="leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {services
        .filter((service) => service.slug !== currentSlug)
        .slice(0, 3)
        .map((service) => (
          <Link
            className="group rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30"
            to={`/servicios/${service.slug}`}
            key={service.slug}
          >
            <h3 className="font-semibold text-white">{service.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{service.benefit}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-studio-cyan">
              Ver servicio <ArrowRight className="transition group-hover:translate-x-1" size={16} />
            </span>
          </Link>
        ))}
    </div>
  )
}
