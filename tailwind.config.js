/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'alaiz-gold':        '#D4AF37',
        'alaiz-gold-light':  '#E8C766',
        'alaiz-black':       '#0A0A0A',
        'alaiz-earth':       '#8B4513',
        'alaiz-terracotta':  '#A0522D',
        'alaiz-cream':       '#F8F4E9',
        'alaiz-gray':        '#2A2A2A',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
