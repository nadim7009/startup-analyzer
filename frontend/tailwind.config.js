/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6c63ff',
          600: '#5b52e6',
          700: '#4c43cc',
          800: '#3d35b3',
          900: '#2e2799',
        },
        secondary: {
          500: '#ff6584',
          600: '#e65a77',
        },
        success: {
          500: '#43e97b',
          600: '#3cd16f',
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#12121a',
          surface2: '#1a1a26',
          border: '#2a2a3d',
          text: '#e8e8f0',
          textMuted: '#7878a0',
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          surface2: '#f1f5f9',
          border: '#e2e8f0',
          text: '#0f172a',
          textMuted: '#64748b',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(108, 99, 255, 0.15)',
        'glow-lg': '0 0 40px rgba(108, 99, 255, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}