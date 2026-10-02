/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fbf7f0',
          100: '#f5ebd9',
          200: '#ead4b3',
          300: '#ddb884',
          400: '#cc9655',
          500: '#b87a3a',
          600: '#9a5f2c',
          700: '#7c4926',
          800: '#633c23',
          900: '#523220',
          950: '#2e1b12',
        },
        forest: {
          50: '#f3f7f2',
          100: '#e3ece1',
          200: '#c8d9c4',
          300: '#9fbf99',
          400: '#6f9d68',
          500: '#4d7d48',
          600: '#3a6436',
          700: '#2f512c',
          800: '#284125',
          900: '#223620',
          950: '#101d0f',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf6f0',
          200: '#f4ece0',
          300: '#ecdccb',
          400: '#dcc6a8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
