/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#1a3a5c',
          teal: '#0d9488',
        },
      },
    },
  },
  plugins: [],
};
