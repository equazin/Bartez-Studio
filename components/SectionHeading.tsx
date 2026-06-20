import { Reveal } from "./motion";

export function SectionHeading({
  num,
  eyebrow,
  title,
  desc,
  light = false,
  center = false,
  className = "",
}: {
  num?: string;
  eyebrow: string;
  title: string;
  desc?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`max-w-[680px] ${center ? "mx-auto text-center" : ""} ${className}`}>
      <span className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] ${light ? "text-accent" : "text-brand"}`}>
        {num && <span className="font-mono text-slate-400">{num}</span>}
        {eyebrow}
      </span>
      <h2 className={`mt-4 font-display text-[clamp(28px,3.8vw,46px)] font-bold leading-[1.08] tracking-[-0.02em] text-balance ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {desc && <p className={`mt-4 text-[17px] leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>{desc}</p>}
    </Reveal>
  );
}
