import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#111111',
          card: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#222222',
        },
        orange: {
          DEFAULT: '#ff6b00',
          hover: '#ff8c2a',
          glow: 'rgba(255, 107, 0, 0.3)',
          subtle: 'rgba(255, 107, 0, 0.1)',
        },
        yellow: {
          accent: '#fbbf24',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#606060',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255, 107, 0, 0.3)',
        'orange-glow-sm': '0 0 10px rgba(255, 107, 0, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'orange-gradient': 'linear-gradient(135deg, #ff6b00 0%, #ff8c2a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 107, 0, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(255, 107, 0, 0.5)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
