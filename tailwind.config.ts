import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9d7",
          100: "#dbf1b0",
          200: "#bfe474",
          300: "#9fd33c",
          400: "#83c21f",
          500: "#67a512",
          600: "#5b920f",
          700: "#4a7a0d",
          800: "#3a630b",
          900: "#2b4a05",
        },
      },
    },
  },
  plugins: [],
};

export default config;
