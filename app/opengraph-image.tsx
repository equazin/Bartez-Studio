import { ImageResponse } from "next/og";
import { company } from "../constants";

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
          background: "linear-gradient(135deg,#0C3520 0%,#0A2818 60%,#061a10 100%)",
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
              background: "linear-gradient(135deg,#22C55E,#14532D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>
            Bartez <span style={{ color: "#7CE0A0", fontWeight: 500 }}>Tecnología</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 70, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 940, fontWeight: 700 }}>
            El partner tecnológico de tu empresa.
          </div>
          <div style={{ fontSize: 27, color: "rgba(255,255,255,.75)", marginTop: 22, maxWidth: 900 }}>
            Mayorista de hardware IT + servicios profesionales · Rosario, Argentina
          </div>
        </div>

        <div style={{ display: "flex", gap: 30, color: "#7CE0A0", fontSize: 22 }}>
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
