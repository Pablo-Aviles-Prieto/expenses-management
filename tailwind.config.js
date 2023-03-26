/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      transitionProperty: {
        spacing: 'margin, padding'
      }
    }
  },
  plugins: [],
  darkMode: 'media' // or 'media' or 'class'
}
