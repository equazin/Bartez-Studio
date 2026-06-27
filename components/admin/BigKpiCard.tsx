import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Sparkline } from "./Sparkline";

interface BigKpiCardProps {
  label: string;
  periodLabel: string; // "Últimos 30 días"
  value: string; // ya formateado (ej: "$278.600", "162")
  delta: number | null; // % vs período anterior; null si no aplica
  positiveIsGood?: boolean; // false para métricas tipo "churn" (subir es malo)
  series: number[];
  footnote?: string; // texto chico al pie
}

function deltaTone(delta: number | null, positiveIsGood: boolean): "up" | "down" | "neutral" {
  if (delta == null || Math.abs(delta) < 0.5) return "neutral";
  const isUp = delta > 0;
  if (positiveIsGood) return isUp ? "up" : "down";
  return isUp ? "down" : "up";
}

export function BigKpiCard({ label, periodLabel, value, delta, positiveIsGood = true, series, footnote }: BigKpiCardProps) {
  const tone = deltaTone(delta, positiveIsGood);
  const toneStyles = tone === "up"
    ? "bg-emerald-50 text-emerald-700"
    : tone === "down"
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-600";
  const Icon = tone === "up" ? ArrowUpRight : tone === "down" ? ArrowDownRight : Minus;
  const deltaText = delta == null ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">{periodLabel}</p>
          <p className="mt-1 text-[14px] font-semibold text-slate-700">{label}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold ${toneStyles}`}>
          <Icon className="size-3" />
          {deltaText}
        </span>
      </div>
      <p className="mt-3 font-display text-[34px] font-bold leading-none tracking-[-0.03em] text-slate-950">{value}</p>
      <div className="mt-4">
        <Sparkline data={series} tone={tone} />
      </div>
      {footnote && <p className="mt-2 text-[12px] text-slate-600">{footnote}</p>}
    </section>
  );
}
