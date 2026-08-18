/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#f0f7f3',
          100: '#dcf0e4',
          200: '#bce1cb',
          300: '#90ccaa',
          400: '#5eb185',
          500: '#2d7a58',
          600: '#236347',
          700: '#1c4f39',
          800: '#173f2f',
          900: '#133427',
          950: '#0a1d16',
        },
        mandi: {
          50: '#f0f7f3',
          100: '#dcf0e4',
          200: '#bce1cb',
          300: '#90ccaa',
          400: '#5eb185',
          500: '#2d7a58', // Rich Pine Green
          600: '#236347', // Deep Forest Pine
          700: '#1c4f39',
          800: '#173f2f',
          900: '#133427',
          950: '#0a1d16',
        },
        krishi: {
          50: '#f0f9f3',
          100: '#ddf2e3',
          500: '#1f7a43', // Lush Pine/Krishi
          600: '#176335',
          700: '#14502c',
          800: '#114125',
        },
        seva: {
          500: '#0969da', // Seva Blue
          600: '#0550ae',
        }
      },
      fontFamily: {
        sans: ['Hind', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
