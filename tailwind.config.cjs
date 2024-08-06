/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#98B66E',
        'secondary' : '#262E20',
        'lightbg': '#FCFFF0',
        'darkbg' : '#262E20',
        'ternary' : '#444C3D',
        'danger' : '#942911',
        'warning': '#D16014',
      }},
  },
  plugins: [],
};



