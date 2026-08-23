import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bps: {
          orange: "#F58220",
          light: "#FFA64D",
          dark: "#D96500",
          bg: "#FFF7ED",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
        mono: ["var(--font-space)", "monospace"],
      },
      boxShadow: {
        glass: "0 10px 30px -5px rgba(245, 130, 32, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 25px rgba(245, 130, 32, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
