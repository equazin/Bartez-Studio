import { Building2, ServerCog } from "lucide-react";

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

export function Experience() {
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
            Publicaremos casos de trabajo cuando contemos con resultados y autorización de cada cliente.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {pendingCases.map((item) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}