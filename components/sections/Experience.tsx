import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, ServerCog } from "lucide-react";
import { getDynamicSuccessCases } from "../../lib/db-content";

// Mini-casos reales anónimos — mostrar mientras se acumulan casos con autorización completa
const miniCases = [
  {
    icon: Building2,
    area: "Renovación de flota corporativa",
    client: "Empresa distribuidora · Rosario",
    text: "Renovación de 40 notebooks corporativas ThinkPad para equipo de ventas y administración con imagen preinstalada y entrega coordinada a dos sucursales.",
    metrics: ["40 equipos en 2 semanas", "Imagen corporativa preinstalada", "Entrega multi-sede"],
  },
  {
    icon: ServerCog,
    area: "Infraestructura y conectividad",
    client: "Organismo privado · Santa Fe",
    text: "Diseño e implementación de red estructurada, switches Cisco y access points WiFi 6 para planta de 80 usuarios. Cableado, configuración y soporte post-implementación.",
    metrics: ["80 puestos de trabajo", "WiFi 6 en toda la planta", "Sin tiempo de parada"],
  },
];

export async function Experience() {
  const cases = await getDynamicSuccessCases();

  return (
    <section id="experiencia" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="experience-title">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-[650px]">
          <h2 id="experience-title" className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
            Experiencia aplicada a problemas reales.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
            {cases.length > 0
              ? "Conocé implementaciones diseñadas a la medida de cada operación."
              : "Proyectos realizados para empresas, organismos y canales en toda Argentina."}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cases.length > 0 ? cases.map((item) => (
            <Link key={item.id} href={`/casos/${item.id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-brand/40">
              <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
                <Image src={item.coverImage} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
              </div>
              <div className="p-7">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-brand">{item.clientName}</span>
                    <h3 className="mt-2 font-display text-[20px] font-bold leading-snug text-ink">{item.title}</h3>
                  </div>
                  <ArrowUpRight className="size-5 flex-none text-slate-400 transition-colors group-hover:text-brand" />
                </div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600">{item.description}</p>
                {item.metrics.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
                    {item.metrics.map((metric) => (
                      <span key={metric} className="text-[12px] font-semibold text-brand">{metric}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          )) : miniCases.map((item) => (
            <div key={item.area} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex items-start gap-4">
                <span className="grid size-12 flex-none place-items-center rounded-xl bg-brand/8">
                  <item.icon className="size-6 text-brand" strokeWidth={1.4} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-slate-400">{item.client}</p>
                  <h3 className="mt-1.5 font-display text-[18px] font-bold leading-snug text-ink">{item.area}</h3>
                </div>
              </div>
              <p className="mt-5 text-[14px] leading-relaxed text-slate-600">{item.text}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                {item.metrics.map((metric) => (
                  <span key={metric} className="rounded-full bg-brand/8 px-3 py-1 text-[12px] font-semibold text-brand">{metric}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
