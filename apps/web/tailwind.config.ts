import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: ['./app/**/*.{vue,js,ts}', './server/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf7f0',
          100: '#f0e8d4',
          200: '#e0d0a8',
          300: '#c9b078',
          400: '#b8956a',
          500: '#a8854a',
          600: '#8f6f3d',
          700: '#735832',
          800: '#5c4629',
          900: '#3d2f1c',
        },
        ink: '#0a0a0a',
        paper: '#fafafa',
        surface: '#141414',
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(10, 10, 10, 0.12)',
        card: '0 4px 24px rgba(10, 10, 10, 0.08)',
        'gold-glow': '0 0 40px rgba(197, 160, 89, 0.08)',
      },
      backgroundImage: {
        'gold-shine': 'linear-gradient(135deg, #f9e29c 0%, #c5a059 45%, #805a26 100%)',
        'gold-shine-vertical': 'linear-gradient(to bottom, #e5c48b 0%, #c5a059 50%, #8b5e3c 100%)',
        'header-bar': 'linear-gradient(135deg, #0a0a0a 0%, #110f0d 40%, #161310 70%, #12100e 100%)',
        'footer-bar': 'linear-gradient(to bottom, #0a0a0a 0%, #0d0b09 25%, #12100c 50%, #181410 75%, #1e1914 100%)',
      },
    },
  },
}
