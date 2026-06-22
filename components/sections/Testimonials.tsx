"use client";

import { useState } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Necesitábamos renovar 30 equipos para toda la administración antes de fin de año. Bartez nos propuso una solución por etapas que se ajustó al presupuesto y los equipos llegaron configurados y listos para usar. Nos ahorraron semanas de trabajo interno.",
    author: "Gerente de Administración",
    company: "Empresa distribuidora de alimentos",
    location: "Rosario, Santa Fe",
    channel: "Corporativo",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Revendo tecnología hace más de 8 años y Bartez es uno de los proveedores más serios con los que trabajo. Precios competitivos, respuesta rápida y siempre con Factura A. Fundamental para mi negocio.",
    author: "Propietario",
    company: "Tienda de informática",
    location: "Santa Fe Capital",
    channel: "Revendedor",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Instalaron toda la red de nuestra planta: cableado, switches Cisco y WiFi en cada sector. El trabajo fue prolijo, respetaron los tiempos acordados y nos dieron soporte después de la entrega. Sin dudas volvería a contratarlos.",
    author: "IT Manager",
    company: "Empresa de logística",
    location: "Gran Rosario",
    channel: "Corporativo",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "Armé mi setup gamer con ellos: PC a medida, monitor, periféricos. El asesoramiento fue excelente, me ayudaron a optimizar el presupuesto sin sacrificar performance. Y la atención posventa es muy buena.",
    author: "Streamer / Content Creator",
    company: "Canal independiente",
    location: "Rosario",
    channel: "Gamer",
    rating: 5,
  },
];

const channelColors: Record<string, string> = {
  Corporativo: "bg-accent/15 text-accent",
  Revendedor: "bg-violet-400/10 text-violet-300",
  Gamer: "bg-orange-400/10 text-orange-300",
};

export function Testimonials() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  return (
    <section className="bg-[#06140d] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.15em] text-slate-450">
              Lo que dicen nuestros clientes
            </p>
            <h2 className="mt-2 font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              Empresas, revendedores y gamers confían en Bartez.
            </h2>
          </div>
          {/* Selector de testimonios */}
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver testimonio ${i + 1}`}
                className={`size-2.5 rounded-full transition-all ${
                  i === active ? "bg-accent w-7" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonio activo */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#030c07] border border-white/5 p-8 text-white md:p-10 shadow-glow">
            <Quote className="absolute right-8 top-8 size-16 text-white/5" />
            <div className="flex gap-1 mb-6">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="font-display text-[clamp(17px,1.8vw,21px)] font-medium leading-[1.5] text-slate-200">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="grid size-11 place-items-center rounded-full bg-accent/15 font-display text-[17px] font-bold text-accent">
                {current.author[0]}
              </div>
              <div>
                <p className="font-semibold text-white text-[14px]">{current.author}</p>
                <p className="text-[12.5px] text-slate-400">{current.company} · {current.location}</p>
              </div>
              <span className={`ml-auto rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${channelColors[current.channel]}`}>
                {current.channel}
              </span>
            </div>
          </div>

          {/* Miniaturas laterales */}
          <div className="flex flex-col gap-3">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  i === active
                    ? "border-accent bg-[#082214] shadow-glow"
                    : "border-white/5 bg-[#030c07]/60 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[13px] font-semibold text-white line-clamp-1">{t.author}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${channelColors[t.channel]}`}>
                    {t.channel}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400 line-clamp-2">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
