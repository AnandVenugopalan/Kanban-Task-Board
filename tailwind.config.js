/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          50:  '#0f172a', // darkest text / headings
          100: '#1e293b', // primary text
          200: '#334155', // secondary text
          300: '#475569', // body text
          400: '#64748b', // muted text
          500: '#94a3b8', // placeholder / subtle text
          600: '#cbd5e1', // subtle border
          700: '#e2e8f0', // default border / hover bg
          800: '#ffffff', // card surface
          900: '#f4f7fe', // page surface
          950: '#eef2fb', // page background
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
        },
        pink: {
          400: '#F472B6',
          500: '#EC4899',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 60%)',
        'glow-indigo': 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.08), transparent)',
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99,102,241,0.2)',
        'glow-pink':   '0 0 20px rgba(236,72,153,0.2)',
        'glow-emerald':'0 0 20px rgba(16,185,129,0.2)',
        'card':        '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(100,116,139,0.1)',
        'card-hover':  '0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(100,116,139,0.18)',
        'modal':       '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(100,116,139,0.12)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease',
        'fade-up':    'fadeUp 0.4s ease',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-border': 'pulseBorder 1.5s ease infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'bounce-in':  'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' },              to: { opacity: '1' } },
        fadeUp:       { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:      { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(40px) scale(0.9)' }, to: { opacity: '1', transform: 'translateX(0) scale(1)' } },
        pulseBorder:  { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        shimmer:      { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        bounceIn:     { '0%': { opacity: '0', transform: 'scale(0.3)' }, '50%': { transform: 'scale(1.05)' }, '70%': { transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
