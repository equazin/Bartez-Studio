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
        // Paleta estricta Bartez
        verde: "#14532D",
        "verde-deep": "#0A2818",
        "verde-acento": "#22C55E",
        crema: "#FAF8F3",
        texto: "#0F1F17",
        bronce: "#B8956A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,31,23,.04)",
        card: "0 30px 60px -28px rgba(20,83,45,.35)",
        glow: "0 14px 30px -12px rgba(34,197,94,.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.2,.7,.2,1) both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
