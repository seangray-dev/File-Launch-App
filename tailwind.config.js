/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        cyan: '#3EE9E5',
        deepBlue: '#093F68',
        gray: '#777F98',
        darkBlue: '#080C20',
        error: '#FF2965',
      },
    },
  },
  plugins: [],
};
