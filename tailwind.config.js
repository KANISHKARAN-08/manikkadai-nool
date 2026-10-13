/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#0B2925',
          deep: '#123C35',
          botanical: '#194D42',
          sage: '#829B83',
          sageLight: '#E8EFE8',
          ivory: '#F6F3E9',
          cream: '#FFFDF8',
          gold: '#D9AD54',
          goldLight: '#FBF5E8',
          goldDark: '#B88F3A',
          ink: '#1E2926',
          muted: '#68736F',
          border: '#E3E4DA',
          warnBg: '#FFF8E6',
          warnBorder: '#F2D48E',
          warnText: '#87560B',
          alertRed: '#8B2D2D'
        }
      },
      fontFamily: {
        serif: ['Lora', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(18, 60, 53, 0.08), 0 2px 6px -1px rgba(18, 60, 53, 0.04)',
        'elevated': '0 16px 40px -4px rgba(11, 41, 37, 0.16), 0 4px 16px -2px rgba(11, 41, 37, 0.08)',
        'gold-glow': '0 0 35px rgba(217, 173, 84, 0.28)',
        'emerald-glow': '0 0 45px rgba(18, 60, 53, 0.45)',
        'inner-gold': 'inset 0 1px 1px 0 rgba(217, 173, 84, 0.3)'
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatRev 10s ease-in-out infinite',
        'spin-very-slow': 'spin 40s linear infinite',
        'spin-reverse': 'spinRev 35s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1.5deg)' },
        },
        spinRev: {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
