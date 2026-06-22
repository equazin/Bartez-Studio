import { Building2, ServerCog } from "lucide-react";
import { getDynamicSuccessCases } from "../../lib/db-content";

const pendingCases = [
  {
    icon: ServerCog,
    area: "Infraestructura y continuidad",
    text: "Caso disponible próximamente",
  },
  {
    icon: Building2,
    area: "Tecnología para equipos de trabajo",
    text: "Caso disponible próximamente",
  },
];

export async function Experience() {
  const cases = await getDynamicSuccessCases();

  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="experience-title">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-[650px]">
          <h2
            id="experience-title"
            className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink"
          >
            Experiencia aplicada a problemas reales.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
            {cases.length > 0 
              ? "Conocé algunas de las implementaciones y soluciones diseñadas a la medida de nuestros clientes."
              : "Publicaremos casos de trabajo cuando contemos con resultados y autorización de cada cliente."}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cases.length > 0 ? (
            cases.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 p-7 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-brand">
                      {c.clientName}
                    </span>
                    <h3 className="mt-1 font-display text-[19px] font-bold text-ink leading-snug">
                      {c.title}
                    </h3>
                  </div>
                  {c.logoUrl && (
                    <div className="h-10 w-16 bg-white rounded p-1 border border-slate-200/60 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logoUrl} alt={c.clientName} className="max-h-full max-w-full object-contain filter grayscale" />
                    </div>
                  )}
                </div>
                
                <p className="text-[14.5px] leading-relaxed text-slate-600 flex-1">
                  {c.description}
                </p>

                {c.metrics && c.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200/60">
                    {c.metrics.map((m, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-[11px] font-semibold text-brand">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            pendingCases.map((item) => (
              <div
                key={item.area}
                className="flex min-h-44 items-center gap-7 rounded-2xl border border-slate-200 bg-slate-50/50 p-7"
              >
                <item.icon className="size-14 flex-none text-brand/35" strokeWidth={1.1} />
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-slate-400">{item.area}</p>
                  <p className="mt-3 font-display text-[19px] font-semibold text-slate-700">{item.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}