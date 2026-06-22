import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  Laptop,
  Network,
  Server,
  ShieldCheck,
  Cloud,
  type LucideIcon,
} from "lucide-react";

const needs: Array<{
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    title: "Actualizar equipos de trabajo",
    description: "Renová estaciones y notebooks con una propuesta pensada para tu operación.",
    href: "/soluciones/notebooks-corporativas",
    icon: Laptop,
  },
  {
    title: "Mejorar servidores y almacenamiento",
    description: "Ganá rendimiento, disponibilidad y seguridad para tus datos.",
    href: "/soluciones/servidores",
    icon: Server,
  },
  {
    title: "Optimizar redes e infraestructura",
    description: "Conectividad y arquitectura para crecer sin fricciones.",
    href: "/soluciones/redes-infraestructura",
    icon: Network,
  },
  {
    title: "Implementar soporte y servicios IT",
    description: "Asistencia técnica, implementación y continuidad para tu operación.",
    href: "/servicios-administrados",
    icon: Headphones,
  },
  {
    title: "Reforzar ciberseguridad",
    description: "Capas de protección para redes, accesos, endpoints y respaldos.",
    href: "/ciberseguridad",
    icon: ShieldCheck,
  },
  {
    title: "Ordenar cloud y licencias",
    description: "Productividad, renovaciones, backup y servicios cloud para tu organización.",
    href: "/cloud-licenciamiento",
    icon: Cloud,
  },
];

export function Needs() {
  return (
    <section id="soluciones" className="scroll-mt-24 bg-[#030c07] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[280px_1fr] lg:gap-16">
        <div className="lg:pt-5">
          <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
            ¿Qué necesitás resolver?
          </h2>
          <p className="mt-5 max-w-[30ch] text-[16px] leading-relaxed text-slate-400">
            Elegí el desafío principal y te ayudamos a encontrar el camino adecuado.
          </p>
        </div>

        <div className="border-t border-white/10">
          {needs.map((need) => (
            <Link
              key={need.title}
              href={need.href}
              className="group grid items-center gap-4 border-b border-white/10 py-6 transition-colors hover:bg-[#082214]/40 sm:grid-cols-[48px_1fr_1.25fr_36px] sm:px-4"
              data-track="solution_need_selected"
            >
              <span className="grid size-11 place-items-center rounded-xl border border-white/10 text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                <need.icon size={21} strokeWidth={1.7} />
              </span>
              <span className="font-display text-[17px] font-semibold text-white">{need.title}</span>
              <span className="text-[13.5px] leading-relaxed text-slate-400">{need.description}</span>
              <span className="ml-auto grid size-9 place-items-center rounded-full text-accent transition-transform group-hover:translate-x-1 group-hover:bg-accent group-hover:text-ink">
                <ArrowRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
