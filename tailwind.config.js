/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        fredoka: ['"Fredoka One"', 'cursive'],
      },
      colors: {
        background: '#0f0c29',
        accent: '#ffcc00',
        card: '#1A1A3A',
      }
    },
  },
  plugins: [],
}
