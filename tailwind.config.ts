import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211c",
        paper: "#f6f2e8",
        paper2: "#efe8d8",
        side: "#1c2a22",
        sideink: "#eee6d4",
        sideinkdim: "#a9b6a9",
        accent: "#c1502e",
        accent2: "#b98b2a",
        line: "rgba(23,33,28,0.12)",
        lineside: "rgba(238,230,212,0.14)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
