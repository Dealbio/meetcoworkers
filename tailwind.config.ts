import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        moss: "#315c45",
        mist: "#f3f5ef",
        sand: "#e9e2d3",
      },
      boxShadow: { soft: "0 20px 60px rgba(23, 33, 27, 0.10)" },
    },
  },
  plugins: [],
} satisfies Config;
