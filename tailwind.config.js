const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
      },
      backgroundColor: {
        light: colors.zinc["50"],
        dark: "#1f2224",
      },
      textColor: {
        titles: {
          light: colors.zinc["900"],
          dark: colors.zinc["100"],
        },
        subtitles: {
          light: colors.zinc["700"],
          dark: colors.zinc["100"],
        },
        descriptions: {
          light: colors.zinc["500"],
          dark: colors.zinc["500"],
        },
        bases: {
          light: colors.zinc["600"],
          dark: colors.zinc["400"],
        },
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
