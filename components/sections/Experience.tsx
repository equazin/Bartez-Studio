import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, ServerCog } from "lucide-react";
import { getDynamicSuccessCases } from "../../lib/db-content";

const pendingCases = [
  { icon: ServerCog, area: "Infraestructura y continuidad", text: "Caso disponible próximamente" },
  { icon: Building2, area: "Tecnología para equipos de trabajo", text: "Caso disponible próximamente" },
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
              : "Publicaremos casos de trabajo cuando contemos con resultados y autorización de cada cliente."}
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
          )) : pendingCases.map((item) => (
            <div key={item.area} className="flex min-h-44 items-center gap-7 rounded-2xl border border-slate-200 bg-slate-50/50 p-7">
              <item.icon className="size-14 flex-none text-brand/35" strokeWidth={1.1} />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-slate-400">{item.area}</p>
                <p className="mt-3 font-display text-[19px] font-semibold text-slate-700">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
