import Image from "next/image";
import { ClipboardCheck, Headphones, Ruler, Users } from "lucide-react";

const capabilities = [
  {
    icon: ClipboardCheck,
    title: "Relevamiento personalizado",
    description: "Entendemos tu contexto, objetivos y restricciones para diseñar la solución adecuada.",
  },
  {
    icon: Ruler,
    title: "Diseño y dimensionamiento",
    description: "Proponemos una arquitectura clara con productos de primera línea adaptada a cada operación.",
  },
  {
    icon: Users,
    title: "Todos los canales",
    description: "Atendemos empresas, sector público, canales gamer y hogares en todo el país.",
  },
  {
    icon: Headphones,
    title: "Implementación y soporte",
    description: "Acompañamos desde la propuesta hasta la puesta en marcha y el soporte continuo.",
  },
];

export function WhyBartez() {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-[#06140d] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="relative min-h-[430px] overflow-hidden rounded-2xl lg:min-h-[580px]">
          <Image
            src="/photos/datacenter.jpg"
            alt="Equipo técnico trabajando sobre infraestructura de servidores"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover opacity-85"
          />
          {/* Badge flotante con trayectoria */}
          <div className="absolute bottom-6 right-6 rounded-xl bg-ink border border-white/10 px-5 py-4 text-white shadow-card">
            <span className="block font-display text-[36px] font-bold leading-none text-accent">30+</span>
            <span className="mt-1 block text-[12px] font-medium text-slate-350">años de experiencia</span>
          </div>
          <div className="absolute left-6 top-6 rounded-xl bg-[#082214]/90 border border-white/5 px-4 py-3 shadow-glow backdrop-blur-sm">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-450">Distribuyendo desde</span>
            <span className="block font-display text-[22px] font-bold text-white">2008</span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-[clamp(32px,4vw,50px)] font-bold leading-[1.04] tracking-[-0.04em] text-white text-balance">
            Más de 30 años de experiencia al servicio de tu proyecto.
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-400">
            Nos dedicamos a comercializar y distribuir tecnología con el fin de brindar soluciones completas a diferentes canales: corporativo, gamer, organizaciones privadas y públicas, y hogares en distintos puntos de Argentina.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
            Nuestra ventaja competitiva es el valor agregado que brindamos a través de un conocimiento profesional adquirido a lo largo de más de 30 años, proveyendo productos de primera línea con asesoramiento personalizado para cada cliente.
          </p>

          <div className="mt-10 grid gap-7 border-t border-white/10 pt-8 sm:grid-cols-2">
            {capabilities.map((item) => (
              <div key={item.title}>
                <item.icon className="size-7 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-[15px] font-semibold leading-tight text-white">{item.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}