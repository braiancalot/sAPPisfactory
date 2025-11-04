import { colors } from "src/theme/theme.js";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        surface: "#1e293b",
        "surface-active": "#334155", // Estado "pressionado" para bg-surface

        border: "#334155",
        overlay: "rgba(15, 23, 42, 0.75)",

        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8", // Cor sutil (placeholders, /min)

        accent: {
          light: "#fb923c",
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },

        danger: {
          light: "#f87171",
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },
        success: {
          light: "#4ade80",
          DEFAULT: "#22c55e",
          dark: "#16a34a",
        },
        warning: {
          light: "#fbbf24",
          DEFAULT: "#f59e0b",
          dark: "#d97706",
        },
      },
      padding: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
      },
      borderRadius: {
        sm: 4, // tags
        md: 8, // botoes, inputs
        lg: 12, // cards, modais
      },
      fontSize: {
        caption: 12,
        body: 15,
        button: 16,
        subhead: 16,
        title: 20,
        headline: 24,
      },
    },
  },
  plugins: [],
};
