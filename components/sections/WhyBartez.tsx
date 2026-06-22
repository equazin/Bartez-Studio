import Image from "next/image";
import { ClipboardCheck, Headphones, Ruler } from "lucide-react";

const capabilities = [
  {
    icon: ClipboardCheck,
    title: "Relevamiento",
    description: "Entendemos tu entorno, objetivos y restricciones.",
  },
  {
    icon: Ruler,
    title: "Diseño y dimensionamiento",
    description: "Proponemos una arquitectura clara para tu operación.",
  },
  {
    icon: Headphones,
    title: "Implementación y soporte",
    description: "Desplegamos, integramos y acompañamos el día a día.",
  },
];

export function WhyBartez() {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-slate-50 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="relative min-h-[430px] overflow-hidden rounded-2xl lg:min-h-[580px]">
          <Image
            src="/photos/datacenter.jpg"
            alt="Equipo técnico trabajando sobre infraestructura de servidores"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-display text-[clamp(32px,4vw,50px)] font-bold leading-[1.04] tracking-[-0.04em] text-ink text-balance">
            Un equipo técnico detrás de cada solución.
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
            Combinamos experiencia, metodología y tecnología para diseñar e implementar soluciones IT adaptadas a tu negocio.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
            Te acompañamos desde el relevamiento inicial hasta el soporte continuo, con una conversación directa y objetivos claros.
          </p>

          <div className="mt-10 grid gap-7 border-t border-slate-200 pt-8 sm:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title}>
                <item.icon className="size-7 text-brand" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-[15px] font-semibold leading-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}