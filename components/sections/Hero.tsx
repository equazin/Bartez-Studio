"use client";

import { Server, Laptop, Network, Cloud, Cctv, HardDrive, ShieldCheck, Clock } from "lucide-react";
import { hero } from "../../constants";
import { Button } from "../ui/Button";

const nodes = [
  { icon: Laptop, label: "Notebooks", x: 8, y: 8 },
  { icon: Network, label: "Redes", x: 80, y: 8 },
  { icon: Cloud, label: "Cloud", x: 82, y: 68 },
  { icon: Cctv, label: "CCTV", x: 54, y: 90 },
  { icon: HardDrive, label: "Storage", x: 8, y: 68 },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink text-white"
    >
      {/* fondo tech */}
      <div className="pointer-events-none absolute inset-0 bg-grid-tech [background-size:48px_48px] [mask-image:radial-gradient(120%_100%_at_50%_0%,#000_40%,transparent_80%)]" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand/25 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-accent/20 blur-[100px]" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-7 pb-20 pt-32 md:grid-cols-[1.05fr_.95fr] md:pt-40">
        <div>
          {/* Entrada por CSS (no gated por JS) para no demorar el LCP */}
          <span
            className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[12.5px] font-medium text-sky"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulseline" />
            {hero.eyebrow}
          </span>

          <h1
            className="mt-6 animate-fade-up font-display text-[clamp(38px,5vw,64px)] font-bold leading-[1.04] tracking-[-0.02em] text-balance"
            style={{ animationDelay: "60ms" }}
          >
            El partner <span className="text-gradient">tecnológico</span> de tu empresa.
          </h1>

          <p
            className="mt-6 max-w-[52ch] animate-fade-up text-[clamp(15px,1.3vw,18px)] leading-relaxed text-slate-300"
            style={{ animationDelay: "120ms" }}
          >
            {hero.subtitle}
          </p>

          <div
            className="mt-8 flex animate-fade-up flex-wrap gap-3.5"
            style={{ animationDelay: "180ms" }}
          >
            <Button href={hero.ctaPrimary.href} variant="primary" arrow>
              {hero.ctaPrimary.label}
            </Button>
            <Button href={hero.ctaSecondary.href} variant="ghost-light">
              {hero.ctaSecondary.label}
            </Button>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-[26px] font-bold text-white">{s.value}</div>
                <div className="text-[12px] leading-tight text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual: topología de infraestructura */}
        <div className="relative">
          <div className="relative aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-navy/80 to-ink p-4 shadow-card">
            <div className="absolute inset-4 rounded-2xl bg-grid-tech [background-size:28px_28px] opacity-40" aria-hidden />

            {/* líneas SVG centro→satélites */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {nodes.map((n, i) => (
                <line key={i} x1="50" y1="50" x2={n.x + 8} y2={n.y + 8} stroke="url(#lg)" strokeWidth="0.5" className="animate-pulseline" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4ADE80" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#22C55E" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* nodo central */}
            <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl border border-accent/40 bg-brand/20 px-5 py-4 backdrop-blur-sm">
              <Server className="h-7 w-7 text-sky" strokeWidth={1.6} />
              <span className="text-[12px] font-semibold">Datacenter</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> online
              </span>
            </div>

            {/* nodos satélite */}
            {nodes.map((n) => (
              <div
                key={n.label}
                className="absolute z-10 flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-sm"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <n.icon className="h-[18px] w-[18px] text-sky" strokeWidth={1.6} />
                <span className="text-[10.5px] text-slate-200">{n.label}</span>
              </div>
            ))}
          </div>

          {/* badges flotantes (z-30 para quedar sobre los nodos; centrados en cada lado, zona libre) */}
          <div className="absolute -left-4 top-[44%] z-30 flex -translate-y-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink shadow-lg">
            <ShieldCheck className="h-5 w-5 text-emerald" />
            <div className="text-[12px] leading-tight">
              <div className="font-semibold">Garantía oficial</div>
              <div className="text-slate-500">marcas líderes</div>
            </div>
          </div>
          <div className="absolute -right-3 top-[58%] z-30 flex -translate-y-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink shadow-lg">
            <Clock className="h-5 w-5 text-brand" />
            <div className="text-[12px] leading-tight">
              <div className="font-semibold">Soporte B2B</div>
              <div className="text-slate-500">respuesta 24 hs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
