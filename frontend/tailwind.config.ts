import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202427",
        mist: "#f5f7f8",
        pine: "#1f5b4f",
        coral: "#c85c4a",
        amber: "#d39b38",
        violet: "#6554c0"
      }
    }
  },
  plugins: []
};

export default config;

