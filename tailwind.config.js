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
        98: 0.98,
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Rajdhani", "Inter", "sans-serif"],
      },

      fontSize: {
        // Utility
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        footnote: ["13px", { lineHeight: "18px", fontWeight: "500" }],

        // Body
        body: ["15px", { lineHeight: "22px", fontWeight: "500" }],
        subhead: ["16px", { lineHeight: "22px", fontWeight: "600" }],

        // Action
        button: ["16px", { lineHeight: "22px", fontWeight: "700" }],

        // Headings
        title: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        headline: ["24px", { lineHeight: "32px", fontWeight: "800" }],

        // Numbers
        "number-sm": ["15px", { lineHeight: "22px", fontWeight: "700" }],
        "number-md": ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "number-lg": ["28px", { lineHeight: "34px", fontWeight: "700" }],
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
