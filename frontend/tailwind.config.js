/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kannada: ['Noto Sans Kannada', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
