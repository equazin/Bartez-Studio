"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { hero } from "../../constants";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yDevice = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const yPill = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-[linear-gradient(160deg,#0c3520_0%,#0A2818_100%)] text-white"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden />
      <div
        className="pointer-events-none absolute -right-20 top-0 h-[480px] w-[480px] rounded-full opacity-70 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,.22), transparent 65%)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-7 pb-20 pt-28 md:grid-cols-[1.05fr_.95fr] md:pt-32">
        <div>
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-bronce/35 px-4 py-1.5 text-[12.5px] font-semibold text-bronce"
          >
            ◆ {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-serif text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] text-balance"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-[46ch] text-[clamp(16px,1.4vw,19px)] text-white/75"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-9 flex flex-wrap gap-3.5"
          >
            <a
              href={hero.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-full bg-verde px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-verde-acento hover:text-verde-deep hover:shadow-glow"
            >
              {hero.ctaPrimary.label} <ArrowRight size={18} />
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-verde-acento hover:text-verde-acento"
            >
              {hero.ctaSecondary.label}
            </a>
          </motion.div>

          <div className="mt-16 flex items-center gap-2.5 text-[12px] uppercase tracking-[0.1em] text-white/50">
            <ChevronDown size={16} className="animate-bounce" /> Partners oficiales abajo
          </div>
        </div>

        {/* Visual de hardware (servidor render CSS) con parallax */}
        <motion.div style={{ y: yDevice }} className="relative">
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-3xl border border-bronce/25 bg-[#0b2f1d] shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(150deg,rgba(34,197,94,.10),rgba(10,40,24,.2)),radial-gradient(80% 80% at 70% 20%,rgba(184,149,106,.18),transparent 60%)",
              }}
              aria-hidden
            />
            <div className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative mb-2.5 flex h-[30px] items-center gap-1.5 rounded-md border border-bronce/25 bg-[linear-gradient(90deg,#16321f,#1d4a2e)] px-3"
                >
                  <span className={`h-[7px] w-[7px] rounded-full ${i % 2 ? "bg-bronce" : "bg-verde-acento shadow-[0_0_8px_#22C55E]"}`} />
                  <span className={`h-[7px] w-[7px] rounded-full ${i % 3 ? "bg-verde-acento shadow-[0_0_8px_#22C55E]" : "bg-bronce"}`} />
                  <span
                    className="ml-auto h-[11px] w-[42%] rounded-sm"
                    style={{ background: "repeating-linear-gradient(90deg,rgba(184,149,106,.3) 0 3px,transparent 3px 7px)" }}
                  />
                </div>
              ))}
            </div>
            <span className="absolute bottom-3.5 right-3.5 rounded-full bg-verde-acento px-3 py-1.5 text-[11px] font-semibold text-verde-deep">
              ● Stock disponible
            </span>
          </div>

          <motion.div
            style={{ y: yPill }}
            className="absolute -left-3.5 top-8 rounded-2xl bg-crema/95 px-4 py-3 text-[13px] font-semibold text-texto shadow-[0_16px_40px_-16px_rgba(0,0,0,.5)]"
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-bronce">Entrega</span>
            Rosario → todo el país
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
