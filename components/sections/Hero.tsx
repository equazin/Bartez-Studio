import Image from "next/image";
import { ArrowRight, Award, Globe } from "lucide-react";

const trustBadges = [
  { icon: Award, label: "Desde 2008", sub: "Trayectoria comprobada" },
  { icon: Globe, label: "Cobertura nacional", sub: "Todo Argentina" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#030c07] pt-24 md:pt-28">
      <div className="mx-auto grid min-h-[650px] max-w-[1320px] items-center gap-10 px-6 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-0">
        <div className="relative z-10 pb-8 md:pb-0">
          {/* Eyebrow badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[12px] font-semibold tracking-wide text-accent">Distribuidora IT · Más de 30 años de experiencia</span>
          </div>

          <h1 className="max-w-[720px] font-display text-[clamp(46px,6vw,82px)] font-bold leading-[0.98] tracking-[-0.055em] text-white text-balance">
            Tecnología que mueve empresas.
          </h1>
          <p className="mt-7 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-slate-400">
            Comercializamos y distribuimos tecnología de primera línea para empresas, organismos públicos, canales gamer y hogares en todo el país. Asesoramiento personalizado desde Rosario con cobertura nacional.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#cotiza"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#10b981] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              data-track="hero_guided_consultation"
            >
              Contanos qué necesitás <ArrowRight size={17} />
            </a>
            <a
              href="#asistente"
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/5 px-5 py-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-white/10"
              data-open-assistant="true"
              data-track="hero_ai_assistant"
            >
              Hablar con un especialista <ArrowRight size={16} />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2">
                <badge.icon className="size-4 flex-none text-accent" strokeWidth={1.8} />
                <div>
                  <span className="block text-[12.5px] font-semibold text-white">{badge.label}</span>
                  <span className="block text-[11px] text-slate-400">{badge.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl md:min-h-[650px] md:rounded-none">
          <Image
            src="/photos/engineer.jpg"
            alt="Especialista de infraestructura trabajando en un datacenter"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover object-center opacity-85"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-[#030c07] to-transparent md:block"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}