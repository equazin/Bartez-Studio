/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#05070d',
          900: '#080b14',
          850: '#0b1020',
          800: '#101729',
        },
        studio: {
          cyan: '#35e7ff',
          blue: '#497cff',
          violet: '#8b5cf6',
          magenta: '#f451c8',
          lime: '#c8ff5f',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(53, 231, 255, 0.16)',
        violet: '0 24px 90px rgba(139, 92, 246, 0.18)',
      },
      backgroundImage: {
        'studio-radial':
          'radial-gradient(circle at top left, rgba(53,231,255,.18), transparent 30%), radial-gradient(circle at 80% 20%, rgba(139,92,246,.16), transparent 28%), linear-gradient(180deg, #05070d 0%, #080b14 45%, #05070d 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
