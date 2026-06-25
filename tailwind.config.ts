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
        ink: "#11142a",
        navy: "#070a16",
        brand: "#1236d8",
        "brand-bright": "#0f2bb8",
        accent: "#0ea5ff",
        sky: "#0ea5ff",
        emerald: "#10B981",
        sunset: "#ff8f1f",
        bronce: "#B8956A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
        // Semantic radius tokens — prefer these over arbitrary values
        card: "14px",      // standard cards, feature grid items, badges
        surface: "18px",   // larger surfaces, modals, sheets
        hero: "24px",      // hero panels and showcase containers
        pill: "9999px",    // pills, fully rounded
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.06)",
        card: "0 24px 50px -28px rgba(15,39,71,.45)",
        glow: "0 14px 34px -12px rgba(18,54,216,.4)",
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
