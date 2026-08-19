import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Repeat, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DynamicSuccessCase } from "@/lib/db-content";

// El logo real puede no haber llegado todavía (ver lib/success-cases.ts).
// Server component: chequeamos en disco en build/render y caemos al
// wordmark si el archivo no existe — así, apenas se sube el logo con el
// nombre esperado, aparece solo sin tocar código.
function resolveLogo(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  const onDisk = existsSync(join(process.cwd(), "public", logoUrl));
  return onDisk ? logoUrl : null;
}

// Paleta determinística por caso: cada cliente cae siempre en el mismo
// gradiente (hash simple sobre el id), para que la identidad visual sea
// estable entre la card del listado y el hero del detalle.
const palettes = [
  { from: "#0046EA", to: "#0038C4", tint: "#eef4ff" },
  { from: "#0f766e", to: "#0a4f4a", tint: "#ecfdf5" },
  { from: "#7c3aed", to: "#5b21b6", tint: "#f3ecff" },
  { from: "#c2410c", to: "#9a3412", tint: "#fff4ec" },
];

function paletteFor(id: number) {
  return palettes[id % palettes.length];
}

function wordmarkInitials(clientName: string): string {
  const words = clientName.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

type Size = "sm" | "lg";

export function ClientCaseIdentity({
  item,
  size = "sm",
  className,
}: {
  item: Pick<DynamicSuccessCase, "id" | "clientName" | "logoUrl" | "relationship" | "cadence" | "industry">;
  size?: Size;
  className?: string;
}) {
  const palette = paletteFor(item.id);
  const isRecurrente = item.relationship === "recurrente";
  const logo = resolveLogo(item.logoUrl);

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-lg border border-slate-200",
        size === "sm" ? "aspect-[16/9] p-5" : "aspect-[4/3] p-8 lg:aspect-auto lg:h-full",
        className
      )}
      style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
    >
      <div className="flex items-start justify-between gap-3">
        {item.industry ? (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white/90 backdrop-blur-sm">
            {item.industry}
          </span>
        ) : (
          <span />
        )}
        {item.relationship ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-semibold text-white/90 backdrop-blur-sm">
            {isRecurrente ? <Repeat size={11} strokeWidth={2.2} /> : <ShieldCheck size={11} strokeWidth={2.2} />}
            {isRecurrente ? (item.cadence ?? "Cliente recurrente") : "Proyecto puntual"}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-center py-4">
        {item.logoUrl ? (
          <div
            className={cn(
              "relative flex w-full items-center justify-center rounded-lg bg-white/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]",
              size === "sm" ? "h-20 px-6 py-3" : "h-28 px-10 py-5"
            )}
          >
            <div className="relative h-full w-full">
              <Image
                src={item.logoUrl}
                alt={item.clientName}
                fill
                className="object-contain object-center"
                sizes="320px"
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div
              className={cn(
                "mx-auto grid place-items-center rounded-full bg-white/12 font-display font-semibold text-white backdrop-blur-sm",
                size === "sm" ? "size-14 text-[20px]" : "size-20 text-[28px]"
              )}
            >
              {wordmarkInitials(item.clientName)}
            </div>
            <p
              className={cn(
                "mt-3 font-display font-semibold leading-tight text-white",
                size === "sm" ? "text-[15px]" : "text-[20px]"
              )}
            >
              {item.clientName}
            </p>
          </div>
        )}
      </div>

      <div />
    </div>
  );
}
