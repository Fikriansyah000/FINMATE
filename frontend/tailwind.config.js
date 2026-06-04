/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e3e8ff',
          200: '#cbd4ff',
          300: '#a5b4fc',
          400: '#7e8ef9',
          500: '#5a61f2',
          600: '#403ae2',
          700: '#342bc4',
          800: '#2b259f',
          900: '#26247e',
        }
      }
    },
  },
  plugins: [],
}
