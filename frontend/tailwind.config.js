/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F7F4',
        surface: '#FFFFFF',
        surfaceMuted: '#F0F2EF',
        primary: {
          DEFAULT: '#245B4A',
          hover: '#1B473A',
          light: '#EBF3EF',
          muted: '#C5D8CF',
        },
        secondary: {
          DEFAULT: '#78A892',
          hover: '#67937E',
          light: '#F0F6F3',
        },
        text: {
          primary: '#171A18',
          secondary: '#686D68',
          muted: '#8E948E',
        },
        border: {
          DEFAULT: '#E5E7E3',
          dark: '#D0D4CE',
        },
        warning: {
          DEFAULT: '#D99A3D',
          light: '#FEF8EE',
          border: '#F6DFB8',
        },
        success: {
          DEFAULT: '#3C8A62',
          light: '#EDF7F1',
          border: '#BFE3CE',
        },
        info: {
          DEFAULT: '#2B6CB0',
          light: '#EBF4FF',
        },
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 26, 24, 0.04), 0 1px 2px -1px rgba(23, 26, 24, 0.04)',
        'card': '0 4px 16px -2px rgba(23, 26, 24, 0.06), 0 2px 6px -2px rgba(23, 26, 24, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 26, 24, 0.09), 0 4px 12px -2px rgba(23, 26, 24, 0.05)',
        'dropdown': '0 16px 40px -6px rgba(23, 26, 24, 0.12), 0 6px 16px -4px rgba(23, 26, 24, 0.06)',
      }
    },
  },
  plugins: [],
}
