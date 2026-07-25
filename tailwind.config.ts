import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand surfaces that stay the same rich navy in both themes
        // (buttons, footer, sidebar, CTA bands) — never swapped by --color-* vars.
        navy: "#0B2545",
        navyLight: "#1A3A66",
        orange: "#FF4B36",
        // Theme-aware tokens: driven by CSS variables (see globals.css),
        // so every existing bg-bg / text-ink / text-text / etc. usage
        // across the app automatically adapts when .dark is toggled.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        green: "rgb(var(--color-green) / <alpha-value>)",
        greenBg: "rgb(var(--color-green-bg) / <alpha-value>)",
        amber: "rgb(var(--color-amber) / <alpha-value>)",
        amberBg: "rgb(var(--color-amber-bg) / <alpha-value>)",
        red: "rgb(var(--color-red) / <alpha-value>)",
        redBg: "rgb(var(--color-red-bg) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
