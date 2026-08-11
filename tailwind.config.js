/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: {
            DEFAULT: '#0c2340', // Official Indian Govt Deep Navy
            light: '#163a63',
            dark: '#07162c',
            royal: '#1b365d',
            soft: '#f0f4f8'
          },
          saffron: {
            DEFAULT: '#e65100', // Saffron / Ashoka Gold
            light: '#fff3e0',
            dark: '#c2410c'
          },
          green: {
            DEFAULT: '#15803d', // Indian Green
            light: '#f0fdf4',
            dark: '#166534'
          },
          slate: {
            light: '#f8fafc',
            DEFAULT: '#f1f5f9',
            dark: '#64748b'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 2px 10px rgba(12, 35, 64, 0.08)',
        'gov-lg': '0 10px 25px -5px rgba(12, 35, 64, 0.12)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
