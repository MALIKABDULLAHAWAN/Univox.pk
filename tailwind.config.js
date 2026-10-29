module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        primary: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45f0b',
          700: '#92400e',
          800: '#78350f',
          900: '#654321',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        urdu: ['Jameel Noori Nastaleeq', 'Nafees', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        urdu: ['Jameel Noori Nastaleeq', 'Nafees', 'sans-serif'],
      },
      colors: {
        brand: '#0ea5e9',
        primary: '#f59e0b',
      },
    },
  },
  plugins: [],
};