/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // This is CRITICAL - enables dark mode
  theme: {
    extend: {
      animation: {
        slideUp: "slideUp 0.5s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(20px, -20px)" },
        },
      },
    },
  },
  plugins: [],
};
