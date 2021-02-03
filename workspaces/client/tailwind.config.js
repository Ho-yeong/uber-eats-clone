const { emerald } = require('tailwindcss/colors');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
        emerald: colors.emerald
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
