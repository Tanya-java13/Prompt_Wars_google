/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#1a3a2a',
        gold: '#c8973a',
        'gold-light': '#e8c97a',
        cream: '#faf8f4',
        sand: '#f5f0e8',
        mist: '#e8e4dc',
        sky: '#2d6a8f',
        coral: '#d4614a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
