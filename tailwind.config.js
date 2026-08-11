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
          navy: {
            DEFAULT: '#0f172a',
            light: '#1e293b',
            dark: '#020617',
            blue: '#1e3a8a'
          },
          saffron: {
            DEFAULT: '#f97316',
            light: '#ffedd5',
            dark: '#ea580c'
          },
          green: {
            DEFAULT: '#10b981',
            light: '#ecfdf5',
            dark: '#059669'
          },
          slate: {
            light: '#f8fafc',
            DEFAULT: '#f1f5f9',
            dark: '#cbd5e1'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
