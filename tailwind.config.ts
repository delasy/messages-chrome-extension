import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./popup/**/*.{css,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: "#FAFAFA",
        cod: "#111111",
        gallery: "#EFEFEF",
        mine: "#323232",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
} satisfies Config;
