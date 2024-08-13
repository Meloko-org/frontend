/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/*.{js,jsx,ts,tsx}",
    "./screens/customer/*.{js,jsx,ts,tsx}",
    "./screens/producer/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
    "./components/cards/*.{js,jsx,ts,tsx}",
    "./components/utils/*.{js,jsx,ts,tsx}",
    "./components/utils/badges/*.{js,jsx,ts,tsx}",
    "./components/utils/buttons/*.{js,jsx,ts,tsx}",
    "./components/utils/inputs/*.{js,jsx,ts,tsx}",
    "./components/map/*.{js,jsx,ts,tsx}",
    "./components/utils/texts/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#98B66E',
        'secondary': '#262E20',
        'lightbg': '#FCFFF0',
        'darkbg': '#262E20',
        'tertiary': '#444C3D',
        'danger': '#942911',
        'warning': '#D16014',
      }},
  },
  plugins: [],
};



