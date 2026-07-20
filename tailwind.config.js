/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Threads 風調色盤
        ink: '#000000',
        panel: '#0a0a0a',
        panel2: '#181818',
        line: '#262626',
        brand: '#0095f6', // 認證藍
        accent: '#0095f6',
        danger: '#ff3040', // Threads/IG 紅
        warn: '#f5a623',
        ok: '#22c55e',
        mute: '#777777',
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
