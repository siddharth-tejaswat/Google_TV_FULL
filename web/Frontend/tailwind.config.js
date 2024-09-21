/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        100: "40rem",
        101: "35rem",
      },
      width: {
        100: "40rem",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      nimation: {
        fadeOut: "fadeOut 1.5s forwards",
      },
    },
  },
  plugins: [],
};
