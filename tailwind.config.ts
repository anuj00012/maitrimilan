import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        marigold: "#F4A261",
        sindoor: "#B23A48",
        lotus: "#FAF3EF",
        mehendi: "#476A52",
        ink: "#302827"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(71, 48, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
