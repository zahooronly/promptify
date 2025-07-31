/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          50: 'rgba(248, 250, 252, 0.95)',
          100: 'rgba(241, 245, 249, 0.9)',
          200: 'rgba(226, 232, 240, 0.8)',
          300: 'rgba(203, 213, 225, 0.7)',
          400: 'rgba(148, 163, 184, 0.6)',
          500: 'rgba(100, 116, 139, 0.5)',
          600: 'rgba(71, 85, 105, 0.4)',
          700: 'rgba(51, 65, 85, 0.3)',
          800: 'rgba(30, 41, 59, 0.2)',
          900: 'rgba(15, 23, 42, 0.1)',
        },
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-white-hover': 'rgba(255, 255, 255, 0.2)',
        'glass-white-active': 'rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 12px 40px rgba(31, 38, 135, 0.5)',
        'glass-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glass-dark-hover': '0 12px 40px rgba(0, 0, 0, 0.5)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}