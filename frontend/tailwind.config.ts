import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nvidia: {
          green: "#76B900",
          dark: "#111111",
          gray: "#2D2D2D"
        }
      }
    },
  },
  plugins: [],
};
export default config;
