import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white pt-24 md:pt-28">
      <div className="mx-auto grid min-h-[650px] max-w-[1320px] items-center gap-10 px-6 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-0">
        <div className="relative z-10 pb-8 md:pb-0">
          <h1 className="max-w-[720px] font-display text-[clamp(46px,6vw,82px)] font-bold leading-[0.98] tracking-[-0.055em] text-ink text-balance">
            Tecnología que mueve empresas.
          </h1>
          <p className="mt-7 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-slate-600">
            Infraestructura, equipamiento y servicios IT con asesoramiento técnico para que tu operación siga avanzando.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#cotiza"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              data-track="hero_guided_consultation"
            >
              Contanos qué necesitás <ArrowRight size={17} />
            </a>
            <a
              href="#asistente"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[14.5px] font-semibold text-ink transition-colors hover:text-brand"
              data-open-assistant="true"
              data-track="hero_ai_assistant"
            >
              Hablar con un especialista <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl md:min-h-[650px] md:rounded-none">
          <Image
            src="/photos/engineer.jpg"
            alt="Especialista de infraestructura trabajando en un datacenter"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-white to-transparent md:block"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}