/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#ff7b00',
        'brand-gold': '#ffb700',
        'brand-dark': '#0a0a0a',
        'brand-darker': '#050505',
        'glass-light': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #ff7b00 0%, #ffb700 100%)',
      }

    },
  },
  plugins: [],
}
