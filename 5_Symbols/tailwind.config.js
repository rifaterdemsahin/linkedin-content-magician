import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          900: '#4c1d95',
        },
        indigo: {
          900: '#312e81',
        },
        green: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
        },
        yellow: {
          300: '#fde047',
          400: '#facc15',
        },
        red: {
          300: '#fca5a5',
          500: '#ef4444',
        },
      },
    },
  },
})