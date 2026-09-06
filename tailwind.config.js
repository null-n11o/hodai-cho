/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0e0d0c',
        ivory: '#ece7de',
        stone: '#9a9084',
        stonedim: '#6f675e',
        aka: '#c4543a',
      },
    },
  },
  plugins: [],
}

