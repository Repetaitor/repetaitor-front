import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

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
    extend: {
      colors: {
        background: 'rgba(13, 17, 23, 1)',
        foreground: 'rgba(243, 245, 248, 1)',

        header: 'rgba(3, 4, 5, 1)',

        primary: 'rgba(61, 135, 86, 1)',
        'primary-foreground': 'rgba(243, 245, 248, 1)',

        secondary: 'rgba(37, 39, 42, 1)',
        'secondary-foreground': 'rgba(243, 245, 248, 1)',

        muted: 'rgba(35, 39, 44, 1)',
        'muted-foreground': 'rgba(140, 150, 160, 1)',

        danger: 'rgba(135, 43, 37, 1)',
        'danger-foreground': 'rgba(243, 245, 248, 1)',

        card: 'rgba(23, 25, 28, 1)',
        'card-foreground': 'rgba(243, 245, 248, 1)',

        popover: 'rgba(21, 23, 27, 1)',
        'popover-foreground': 'rgba(243, 245, 248, 1)',

        accent: 'rgba(35, 39, 44, 1)',
        'accent-foreground': 'rgba(243, 245, 248, 1)',

        border: 'rgba(35, 39, 44, 1)',
        input: 'rgba(35, 39, 44, 1)',
        ring: 'rgba(212, 215, 230, 1)',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
