/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'blue': {
          '50': '#f0faff',
          '100': '#e0f3fe',
          '200': '#b9e9fe',
          '300': '#7cd8fd',
          '400': '#36c6fa',
          '500': '#0cafeb',
          '600': '#0095d5',
          '700': '#016fa3',
          '800': '#065e86',
          '900': '#0b4e6f',
          DEFAULT: '#0095d5'
        },
      },
    },
  },
  plugins: [],
}
