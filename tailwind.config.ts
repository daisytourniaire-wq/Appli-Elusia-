import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elusia: {
          bg: "#FBF7F2",
          card: "#F3EAE0",
          ink: "#241F1B",
          muted: "#6E645C",
          clay: "#C97B5F",
          "clay-dark": "#B4644A",
          sage: "#8CA187",
          "sage-dark": "#6E8569",
          line: "#E7DCCF",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
