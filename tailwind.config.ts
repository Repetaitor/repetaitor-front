import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate'; // Use import instead of require

export default {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {},
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
