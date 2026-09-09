/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans 3 Variable", "Source Sans 3", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Newsreader Variable", "Newsreader", "Palatino", "serif"],
      },
    },
  },
  plugins: [],
};
