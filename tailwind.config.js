/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kpi-morado': '#3f2a52',
        'kpi-morado-light': '#beaed8',
        'kpi-azul': '#77a9d4',
      }
    },
  },
  plugins: [],
}