/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebefff',
          200: '#cfd8ff',
          300: '#b3c0ff',
          400: '#7f90ff',
          500: '#5a6bff',
          600: '#4a54e6',
          700: '#3a3bbf',
          800: '#2a2a99',
          900: '#141466',
        }
      }
    }
  },
  plugins: [],
}
