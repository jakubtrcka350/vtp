import type { Config } from "tailwindcss";
import { colors } from "./src/lib/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent:        colors.accent,
        cobalt:        colors.cobalt,
        bg:            colors.bg,
        surface:       colors.surface,
        "surface-2":   colors.surface2,
        "surface-alt": colors.surfaceAlt,
        border:        colors.border,
        "text-primary": colors.textPrimary,
        "text-muted":   colors.textMuted,
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
