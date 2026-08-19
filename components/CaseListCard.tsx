import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DynamicSuccessCase } from "@/lib/db-content";
import { resolveClientLogo, wordmarkInitials } from "@/lib/client-logo";

// Card de listado para /casos — "métrica protagonista": el resultado
// (headlineStat) es lo primero que se lee, el logo queda chico junto al
// nombre del cliente, como una firma. Fondo blanco simple, sin gradientes
// de color — coherente con el resto de cards del sitio (border-slate-200).
export function CaseListCard({ item }: { item: DynamicSuccessCase }) {
  const logo = resolveClientLogo(item.logoUrl);

  return (
    <Link
      href={`/casos/${item.id}`}
      className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-12 flex-none place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5">
          {logo ? (
            <div className="relative h-full w-full">
              <Image src={logo} alt={item.clientName} fill className="object-contain" sizes="48px" />
            </div>
          ) : (
            <span className="font-display text-[13px] font-semibold text-[#0046EA]">
              {wordmarkInitials(item.clientName)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-bold text-[#11142a]">{item.clientName}</p>
          {item.industry ? <p className="truncate text-[11px] text-slate-500">{item.industry}</p> : null}
        </div>
      </div>

      {item.headlineStat ? (
        <div className="mt-5">
          <p className="font-display text-[30px] font-semibold leading-none tracking-[-0.02em] text-[#0046EA]">
            {item.headlineStat}
          </p>
          {item.headlineStatLabel ? (
            <p className="mt-1.5 text-[11.5px] font-semibold text-slate-500">{item.headlineStatLabel}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex-1">
        <h2 className="font-display text-[16.5px] font-semibold leading-snug text-[#11142a]">{item.title}</h2>
        <p className="mt-2 text-[12.8px] leading-relaxed text-slate-600">{item.description}</p>
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0046EA]">
        Ver caso <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
