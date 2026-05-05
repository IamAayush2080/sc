/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#e6f7ed',
          100: '#c1ebd0',
          200: '#98ddb0',
          500: '#27a85a',
          700: '#1a7a42',
          900: '#0d4f2b',
        },
      },
    },
  },
  plugins: [],
}
