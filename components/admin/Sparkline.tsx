/**
 * Sparkline minimalista (SVG puro, sin librería) estilo dashboard ejecutivo.
 * Recibe una serie de valores y opcionalmente el tono (verde/rojo/azul).
 */
export function Sparkline({
  data,
  tone = "neutral",
  filled = true,
  className,
}: {
  data: number[];
  tone?: "up" | "down" | "neutral";
  filled?: boolean;
  className?: string;
}) {
  if (data.length < 2) {
    return <div className={className} aria-hidden style={{ height: 36 }} />;
  }

  const width = 200;
  const height = 36;
  const padding = 1;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = (width - padding * 2) / (data.length - 1);

  const points = data.map((value, idx) => {
    const x = padding + idx * step;
    const y = padding + ((max - value) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${width - padding},${height - padding} L${padding},${height - padding} Z`;

  const stroke = tone === "up" ? "#059669" : tone === "down" ? "#dc2626" : "#1236d8";
  const fill = tone === "up" ? "rgba(16,185,129,0.10)" : tone === "down" ? "rgba(239,68,68,0.10)" : "rgba(18,54,216,0.08)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Sparkline"
      className={className}
      style={{ width: "100%", height }}
    >
      {filled && <path d={areaPath} fill={fill} />}
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
