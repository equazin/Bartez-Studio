import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDynamicSuccessCases } from "../../lib/db-content";

export async function Experience() {
  const cases = await getDynamicSuccessCases();
  if (cases.length === 0) return null;

  return (
    <section id="experiencia" className="scroll-mt-24 bg-[#030c07] py-20 md:py-28" aria-labelledby="experience-title">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-[650px]">
          <h2 id="experience-title" className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
            Experiencia aplicada a problemas reales.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
            Conocé implementaciones diseñadas a la medida de cada operación.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cases.map((item) => (
            <Link key={item.id} href={`/casos/${item.id}`} className="group overflow-hidden rounded-3xl border border-white/5 bg-[#082214] transition-all duration-300 hover:border-accent/40 hover:bg-[#0c2e1d]">
              <div className="relative aspect-[16/8] overflow-hidden bg-[#030c07]">
                <Image src={item.coverImage} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-[1.025]" />
              </div>
              <div className="p-7">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-accent">{item.clientName}</span>
                    <h3 className="mt-2 font-display text-[20px] font-bold leading-snug text-white">{item.title}</h3>
                  </div>
                  <ArrowUpRight className="size-5 flex-none text-slate-500 transition-colors group-hover:text-accent" />
                </div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-slate-400">{item.description}</p>
                {item.metrics.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-5">
                    {item.metrics.map((metric) => (
                      <span key={metric} className="rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[12px] font-semibold text-accent">{metric}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
