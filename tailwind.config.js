const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
      },
      borderColor: {
        base: {
          light: colors.gray["300"],
          dark: colors.zinc["600"],
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
};
