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
          deep: '#123C35',
          botanical: '#194D42',
          sage: '#829B83',
          sageLight: '#E8EFE8',
          ivory: '#F6F3E9',
          cream: '#FFFDF8',
          gold: '#D9AD54',
          goldLight: '#FBF5E8',
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
        'elevated': '0 12px 32px -4px rgba(18, 60, 53, 0.12), 0 4px 12px -2px rgba(18, 60, 53, 0.06)'
      }
    },
  },
  plugins: [],
}
