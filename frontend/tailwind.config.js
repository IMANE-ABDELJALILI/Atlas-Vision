/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morocco: {
          ochre: '#C19A6B', // Example ochre
          terracotta: '#E2725B', // Example terracotta
          sand: '#F4A460',
          sky: '#87CEEB',
          deep: '#8B4513'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
