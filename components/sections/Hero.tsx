import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappLinks } from "@/lib/whatsapp";

const proof = ["+10.000 clientes", "18 años en el rubro", "Cobertura nacional", "Factura A"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-x-clip bg-[#030c07] pt-20">
      <div className="mx-auto grid max-w-[1440px] items-stretch lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 min-w-0 px-6 py-14 sm:px-8 lg:flex lg:min-h-[560px] lg:flex-col lg:justify-center lg:px-[clamp(48px,5.5vw,84px)] lg:py-14">
          <h1 className="max-w-[690px] font-display text-[clamp(41px,4.4vw,68px)] font-bold leading-[0.99] tracking-[-0.052em] text-white text-balance">
            Distribución IT para empresas y revendedores<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-[clamp(15.5px,1.25vw,17px)] leading-relaxed text-slate-400">
            Equipamiento, infraestructura y soluciones tecnológicas con asesoramiento especializado, atención en todo el país y respuesta comercial directa por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={whatsappLinks.quote}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#10b981] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              data-track="hero_whatsapp_quote"
            >
              <MessageCircle size={18} /> Cotizar por WhatsApp
            </a>
            <a
              href="#soluciones"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver soluciones <ArrowRight size={16} />
            </a>
          </div>
          <a href="/rfq" className="mt-5 inline-flex w-fit items-center gap-2 text-[13px] font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:text-white">
            Ya tengo modelos y cantidades <ArrowRight size={15} />
          </a>
        </div>

        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[460px] lg:min-h-[560px]">
          <Image
            src="/photos/engineer.jpg"
            alt="Especialista preparando infraestructura tecnológica para una empresa"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover object-center opacity-90"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-[#030c07] to-transparent lg:block"
            aria-hidden
          />
        </div>
      </div>
      <div className="border-y border-white/10 bg-[#04110a]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-6 sm:grid-cols-4 sm:px-8">
          {proof.map((item) => (
            <div key={item} className="border-white/10 px-2 py-5 text-center text-[12.5px] font-semibold text-white even:border-l sm:border-l sm:px-5 sm:py-6 sm:text-[14px] sm:first:border-l-0">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
