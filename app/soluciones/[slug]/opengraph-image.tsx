import { ImageResponse } from "next/og";
import { verticals } from "@/constants";

export const alt = "Bartez Tecnología";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = verticals.find((v) => v.slug === slug);
  const eyebrow = vertical?.eyebrow ?? "Soluciones B2B";
  const title = vertical?.navLabel ?? "Bartez Tecnología";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg,#0046EA 0%,#0038C4 55%,#001a5c 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#ffffff,#dbe7ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0046EA",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>
            Bartez <span style={{ color: "#a8c4ff", fontWeight: 500 }}>Tecnología</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              color: "#a8c4ff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 1000,
              fontWeight: 700,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 27,
              color: "rgba(255,255,255,.78)",
              marginTop: 22,
              maxWidth: 900,
            }}
          >
            Distribución IT B2B · Rosario, Argentina · Cobertura nacional
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 30,
            color: "#a8c4ff",
            fontSize: 22,
          }}
        >
          <span>Factura A</span>
          <span>·</span>
          <span>Multi-marca</span>
          <span>·</span>
          <span>Respuesta 24 hs</span>
        </div>
      </div>
    ),
    size,
  );
}
