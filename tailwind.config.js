/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0e14',
        panel: '#141922',
        panel2: '#1c222e',
        line: '#2a3140',
        brand: '#3b82f6',
        accent: '#22d3ee',
        danger: '#ef4444',
        warn: '#f59e0b',
        ok: '#22c55e',
        mute: '#8b94a7',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        fadeup: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeup: 'fadeup 0.35s ease-out',
        pop: 'pop 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
