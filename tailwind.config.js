/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Permite alternar modo oscuro manualmente añadiendo la clase 'dark' a la etiqueta html
  theme: {
    extend: {
      colors: {
        diaRed: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#e5121b',  // Rojo Dia Oficial
          700: '#c20e14',
          800: '#991115',
          900: '#7f1317',
        },
        darkBg: {
          900: '#0b0f19', // Fondo extra oscuro para pantallas OLED
          850: '#0f1422', // Fondo intermedio para headers en modo oscuro
          800: '#111827', // Fondo oscuro secundario
          750: '#18202e', // Botones y paneles secundarios
          705: '#1d2735', // Corrección para tarjetas de carrito
          700: '#1f2937', // Tarjetas y paneles en modo oscuro
          600: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(0, 0, 0, 0.15), 0 2px 8px -1px rgba(0, 0, 0, 0.08)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
