import Link from "next/link";
import { ArrowRight, Handshake, Package, Percent, Zap } from "lucide-react";

const highlights = [
  { icon: Percent, label: "Condiciones de canal" },
  { icon: Package, label: "Marcas líderes" },
  { icon: Zap, label: "Respuesta en 24 hs" },
];

export function ResellerBanner() {
  return (
    <section className="bg-[#030c07] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink via-[#0d3520] to-[#0a2818] px-8 py-10 md:px-12 md:py-12">
          {/* Decoración */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-10 left-1/3 size-40 rounded-full bg-accent/10 blur-2xl" aria-hidden />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 mb-4">
                <Handshake className="size-3.5 text-accent" />
                <span className="text-[11.5px] font-semibold tracking-wide text-slate-200">Canal IT · Revendedores</span>
              </div>
              <h2 className="font-display text-[clamp(22px,3vw,34px)] font-bold leading-[1.1] tracking-[-0.035em] text-white text-balance">
                ¿Distribuís tecnología?{" "}
                <span className="text-accent">Trabajemos juntos.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-slate-300">
                Sumate al canal de distribución de Bartez. Más de 30 años de experiencia, marcas oficiales y condiciones comerciales pensadas para que tu negocio crezca.
              </p>

              {/* Highlights */}
              <div className="mt-6 flex flex-wrap gap-4">
                {highlights.map((h) => (
                  <div key={h.label} className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-lg bg-white/10">
                      <h.icon className="size-3.5 text-accent" strokeWidth={1.8} />
                    </span>
                    <span className="text-[12.5px] font-medium text-slate-300">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch xl:flex-row">
              <Link
                href="/revendedores"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                Quiero ser revendedor <ArrowRight size={16} />
              </Link>
              <Link
                href="/marcas"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:border-white/50"
              >
                Ver marcas que distribuimos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
