import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./constants.ts",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Verde Bartez (oscuro) — remapeo de los tokens del sitio
        ink: "#0A2818", // verde profundo (hero / footer / secciones oscuras)
        navy: "#0C3520", // verde secundario (cards sobre oscuro)
        brand: "#14532D", // verde principal (CTAs / acentos sobre claro)
        "brand-bright": "#16A34A", // hover
        accent: "#22C55E", // verde acento (chips, líneas, detalles)
        sky: "#4ADE80", // verde claro (texto/acento sobre oscuro)
        emerald: "#10B981", // stock / éxito
        bronce: "#B8956A", // detalle editorial (números, divisores)
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.06)",
        card: "0 24px 50px -28px rgba(15,39,71,.45)",
        glow: "0 14px 34px -12px rgba(34,197,94,.5)",
        ring: "0 0 0 1px rgba(226,232,240,1)",
      },
      backgroundImage: {
        "grid-tech":
          "linear-gradient(rgba(56,189,248,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.07) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        pulseline: { "0%,100%": { opacity: ".25" }, "50%": { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.2,.7,.2,1) both",
        marquee: "marquee 30s linear infinite",
        pulseline: "pulseline 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
