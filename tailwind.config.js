const colors = require("./src/theme/colors.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        "2xl": 32,
        "3xl": 40,
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
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
  },
  plugins: [],
};
