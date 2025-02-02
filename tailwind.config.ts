/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [
    require("tailwindcss-animate"),
    function ({ addComponents }: any) {
      addComponents({
        ".no-arrows::-webkit-outer-spin-button, .no-arrows::-webkit-inner-spin-button":
          {
            "-webkit-appearance": "none",
            margin: 0,
          },
        ".no-arrows": {
          "-moz-appearance": "textfield",
        },
      });
    },
  ],
} satisfies Config;
