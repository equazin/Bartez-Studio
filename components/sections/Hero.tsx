import Image from "next/image";
import { ArrowRight, CalendarDays, FileCheck2, MapPinned, MessageCircle, UsersRound, type LucideIcon } from "lucide-react";
import { whatsappLinks } from "@/lib/whatsapp";

const proof: Array<{ label: string; icon: LucideIcon }> = [
  { label: "+10.000 clientes", icon: UsersRound },
  { label: "18 años en el rubro", icon: CalendarDays },
  { label: "Cobertura nacional", icon: MapPinned },
  { label: "Factura A", icon: FileCheck2 },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-x-clip bg-[#020a06] pt-[88px]">
      <div className="relative mx-auto max-w-[1536px] overflow-hidden border-x border-white/5">
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/photos/bartez-operations-hero-v2.webp"
            alt="Equipo de Bartez preparando servidores y equipamiento tecnológico"
            fill
            priority
            sizes="1536px"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-[#020a06] via-[#020a06]/95 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020a06]/70 to-transparent" aria-hidden />
        </div>

        <div className="relative z-10 flex min-h-[570px] max-w-[720px] flex-col justify-center px-6 py-14 sm:px-8 lg:px-[clamp(56px,6vw,96px)] lg:py-16">
          <h1 className="max-w-[650px] font-display text-[clamp(43px,4.45vw,68px)] font-bold leading-[1.01] tracking-[-0.052em] text-white text-balance">
            Distribución IT para empresas y revendedores<span className="text-[#22c55e]">.</span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-[clamp(15.5px,1.2vw,17px)] font-medium leading-[1.55] text-slate-300">
            Equipamiento, infraestructura y soluciones tecnológicas con asesoramiento especializado, atención en todo el país y respuesta comercial directa por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={whatsappLinks.quote}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-[#16c95f] px-6 text-[15px] font-bold text-white transition-colors hover:bg-[#12b955] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
              data-track="hero_whatsapp_quote"
            >
              <MessageCircle size={20} strokeWidth={2.1} /> Cotizar por WhatsApp
            </a>
            <a
              href="#soluciones"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-white/30 bg-black/15 px-6 text-[15px] font-bold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              Ver soluciones <ArrowRight size={17} />
            </a>
          </div>
          <a href="/rfq" className="mt-5 inline-flex w-fit items-center gap-2 text-[13.5px] font-semibold text-green-400 underline decoration-green-400/50 underline-offset-4 hover:text-white">
            Ya tengo modelos y cantidades <ArrowRight size={16} />
          </a>
        </div>

        <div className="relative h-[360px] overflow-hidden border-t border-white/10 lg:hidden">
          <Image
            src="/photos/bartez-operations-hero-v2.webp"
            alt="Equipo de Bartez preparando servidores y equipamiento tecnológico"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 1px"
            className="object-cover object-[72%_center]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020a06] to-transparent" aria-hidden />
        </div>
      </div>

      <div className="border-y border-white/10 bg-[#04110a]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-4 sm:grid-cols-4 sm:px-8">
          {proof.map((item, index) => (
            <div key={item.label} className={`flex min-h-[96px] items-center justify-center gap-3 border-white/10 px-3 py-5 ${index % 2 ? "border-l" : ""} sm:border-l sm:px-5 sm:first:border-l-0`}>
              <item.icon className="size-7 flex-none text-[#22c55e] sm:size-8" strokeWidth={1.55} />
              <span className="text-[12.5px] font-bold text-white sm:text-[14px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
