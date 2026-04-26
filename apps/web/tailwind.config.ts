import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        sand: "#f6f2e8",
        clay: "#d0c5b4",
        moss: "#2f6b57",
        ember: "#c45a33",
        paper: "#fffdf8",
      },
      fontFamily: {
        sans: ["Avenir Next", "Trebuchet MS", "Segoe UI", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 18px 40px rgba(17, 17, 17, 0.08)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 500ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
