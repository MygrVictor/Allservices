import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens de thème (voir variables dans src/app/globals.css)
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
          light: "rgb(var(--color-primary-light) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          dark: "rgb(var(--color-accent-dark) / <alpha-value>)",
        },
        neige: "rgb(var(--color-snow) / <alpha-value>)",
        ardoise: "rgb(var(--color-ink) / <alpha-value>)",
        // « sapin » conservé comme alias de la couleur principale
        sapin: "rgb(var(--color-primary) / <alpha-value>)",
        taupe: "#B7AB9A",
        pierre: "#8A96A3",
        bois: "#A67C52",
        glacier: "rgb(var(--color-primary-light) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(44, 62, 80, 0.08)",
      },
      borderRadius: {
        panel: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
