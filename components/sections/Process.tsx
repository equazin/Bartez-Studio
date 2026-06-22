import { ClipboardList, FileText, MessagesSquare, Rocket } from "lucide-react";

const steps = [
  { icon: MessagesSquare, title: "Contanos el desafío", description: "Nos compartís qué necesitás resolver y cuáles son tus prioridades." },
  { icon: ClipboardList, title: "Evaluamos la necesidad", description: "Analizamos el entorno y relevamos los requerimientos clave." },
  { icon: FileText, title: "Presentamos la propuesta", description: "Diseñamos una solución y una propuesta de trabajo clara." },
  { icon: Rocket, title: "Implementamos y acompañamos", description: "Coordinamos la puesta en marcha y el seguimiento." },
];

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-24 bg-transparent py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="max-w-[720px] font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
          De la consulta a la implementación.
        </h2>

        <ol className="relative mt-14 grid gap-9 md:grid-cols-4 md:gap-6">
          <span className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-accent/20 md:block" aria-hidden />
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="relative z-10 grid size-10 place-items-center rounded-full border border-accent bg-[#030c07] font-display text-[13px] font-bold text-accent">
                {index + 1}
              </span>
              <step.icon className="mt-7 size-6 text-accent" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-[16px] font-semibold text-white">{step.title}</h3>
              <p className="mt-2 max-w-[26ch] text-[13px] leading-relaxed text-slate-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}