import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B2545",
        navyLight: "#1A3A66",
        orange: "#FF4B36",
        bg: "#F4F7FF",
        muted: "#7A84AC",
        text: "#4A5580",
        border: "#D9E0F5",
        green: "#1F8B4C",
        greenBg: "#E9F7EE",
        amber: "#B8720C",
        amberBg: "#FFF4E5",
        red: "#C7371D",
        redBg: "#FFE9E5",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
