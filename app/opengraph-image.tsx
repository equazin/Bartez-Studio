import { ImageResponse } from "next/og";
import { company, seo } from "../constants";

export const runtime = "edge";
export const alt = company.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
          background: "linear-gradient(150deg,#0c3520 0%,#0A2818 60%,#061a10 100%)",
          color: "#fff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#22C55E,#14532D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0A2818",
              fontSize: 34,
              fontWeight: 600,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "sans-serif" }}>
            Bartez <span style={{ color: "#B8956A", fontWeight: 500 }}>· Tecnología</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 900 }}>
            {company.tagline}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,.72)", marginTop: 24, fontFamily: "sans-serif", maxWidth: 880 }}>
            Distribución mayorista de hardware IT · Rosario, Argentina
          </div>
        </div>

        <div style={{ display: "flex", gap: 36, color: "#B8956A", fontSize: 22, fontFamily: "sans-serif" }}>
          <span>+14.000 productos</span>
          <span>·</span>
          <span>Cotización en 24 hs</span>
          <span>·</span>
          <span>Cobertura nacional</span>
        </div>
      </div>
    ),
    size
  );
}
