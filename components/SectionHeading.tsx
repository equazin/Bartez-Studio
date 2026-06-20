import { Reveal } from "./motion";

export function SectionHeading({
  num,
  eyebrow,
  title,
  desc,
  light = false,
  className = "",
}: {
  num?: string;
  eyebrow: string;
  title: string;
  desc?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`max-w-[660px] ${className}`}>
      <span className="font-serif text-[15px] text-bronce">
        {num ? `${num} — ` : ""}
        {eyebrow}
      </span>
      <h2
        className={`mt-5 font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.05] tracking-[-0.02em] text-balance ${
          light ? "text-white" : "text-verde-deep"
        }`}
      >
        {title}
      </h2>
      {desc && <p className={`mt-4 text-[17px] ${light ? "text-white/70" : "text-[#4a5a50]"}`}>{desc}</p>}
    </Reveal>
  );
}
