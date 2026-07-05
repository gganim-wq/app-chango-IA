/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        figmaBlack: '#000000',
        figmaNavy: '#0A0C10',
        figmaRed: '#FF1E1E',
        figmaCyan: '#00D1FF',
        figmaPurple: '#A855F7',
        figmaBlue: '#2563EB',
        darkBg: {
          700: '#1e1e1e',
          705: '#252525',
          750: '#1a1a1a',
          800: '#121212',
          850: '#0f0f0f',
          900: '#000000',
        },
        diaRed: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#e5121b',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'accent': '0 10px 20px rgba(255, 30, 30, 0.3)',
      },
      backgroundImage: {
        'savings-gradient': 'linear-gradient(135deg, #00D1FF 0%, #BC00FF 100%)',
      }
    },
  },
  plugins: [],
}
