import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        subtle: "var(--subtle)",
        border: "var(--border)",
        brand: {
          navy: "var(--brand-navy)",
          blue: "var(--brand-blue)",
          light: "var(--brand-light-blue)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-sc)", "system-ui", "sans-serif"],
        heading: [
          "var(--font-space-grotesk)",
          "var(--font-noto-sans-sc)",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        "7xl": "80rem",
      },
    },
  },
  plugins: [],
};
export default config;
