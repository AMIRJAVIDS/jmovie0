export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      keyframes: {
        kenBurns: {
          "0%":   { transform: "scale(1.05) translate(0, 0)" },
          "50%":  { transform: "scale(1.18) translate(-1.5%, -1.5%)" },
          "100%": { transform: "scale(1.05) translate(0, 0)" },
        },
        progress: {
          from: { transform: "scaleX(0)" },
          to:   { transform: "scaleX(1)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ken-burns": "kenBurns 20s ease-in-out infinite",
        progress: "progress 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
