const colors = require("./src/theme/colors.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      spacing: {
        "2xs": 4,
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 40,
        "3xl": 56,
      },

      borderRadius: {
        sm: "6",
        md: "10",
        lg: "14",
        pill: "999",
      },

      scale: {
        97: 0.97,
        98: 0.98,
        99: 0.99,
      },

      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
  },
  plugins: [],
};
