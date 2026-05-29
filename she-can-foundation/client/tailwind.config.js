/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        rose: {
          DEFAULT: '#e8476a',
          light: '#f9d0d9',
          dark: '#c0254a',
        },
        cream: '#fdf8f3',
        charcoal: '#1a1a2e',
      },
    },
  },
  plugins: [],
};
