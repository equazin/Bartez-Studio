import Image from "next/image";
import type { DynamicSuccessCase } from "@/lib/db-content";
import { accentFor, resolveClientLogo, wordmarkInitials } from "@/lib/client-logo";

// Panel de resumen para el hero de /casos/[id] — acento de color fino +
// logo sobre chip clara + lista de resumen (rubro, relación, frecuencia,
// foco). Reemplaza el media slot por defecto de InternalHero via `children`.
export function CaseDetailPanel({ item }: { item: DynamicSuccessCase }) {
  const logo = resolveClientLogo(item.logoUrl);
  const accent = accentFor(item.id);
  const isRecurrente = item.relationship === "recurrente";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-[#f7f9fc]">
      <div className="h-[4px]" style={{ background: accent.solid }} />
      <div className="p-7">
        <div className="flex h-[76px] items-center justify-center rounded-lg bg-white p-4">
          {logo ? (
            <div className="relative h-full w-full">
              <Image src={logo} alt={item.clientName} fill className="object-contain" sizes="240px" />
            </div>
          ) : (
            <span className="font-display text-[22px] font-semibold text-[#0046EA]">
              {wordmarkInitials(item.clientName)}
            </span>
          )}
        </div>

        <dl className="mt-6 space-y-3 text-[12.5px] leading-relaxed text-slate-600">
          {item.industry ? (
            <div className="flex gap-2">
              <dt className="w-24 flex-none font-semibold text-[#11142a]">Rubro</dt>
              <dd>{item.industry}</dd>
            </div>
          ) : null}
          <div className="flex gap-2">
            <dt className="w-24 flex-none font-semibold text-[#11142a]">Relación</dt>
            <dd style={{ color: accent.text }} className="font-semibold">
              {isRecurrente ? "Cliente recurrente" : "Proyecto puntual"}
            </dd>
          </div>
          {isRecurrente && item.cadence ? (
            <div className="flex gap-2">
              <dt className="w-24 flex-none font-semibold text-[#11142a]">Frecuencia</dt>
              <dd>{item.cadence}</dd>
            </div>
          ) : null}
          {item.focus ? (
            <div className="flex gap-2">
              <dt className="w-24 flex-none font-semibold text-[#11142a]">Foco</dt>
              <dd>{item.focus}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
