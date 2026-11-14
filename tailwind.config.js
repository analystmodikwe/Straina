/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C5C',
          hover: '#0B3A47',
        },
        secondary: '#334155',
        accent: '#0369A1',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#0F172A',
          muted: '#475569',
        },
        border: {
          DEFAULT: '#CBD5E1',
          control: '#64748B',
        },
        hotspot: {
          DEFAULT: '#C2410C',
          chip: '#9A3412',
          chipBg: '#FFEDD5',
        },
        notHotspot: '#2F7F9E',
        insufficient: '#E2E8F0',
        error: {
          DEFAULT: '#B42318',
          bg: '#FEF3F2',
        },
        offline: {
          DEFAULT: '#7A2E0E',
          bg: '#FEF0C7',
        },
        demo: {
          DEFAULT: '#4C1D95',
          bg: '#EDE9FE',
        },
        success: {
          DEFAULT: '#085D3A',
          bg: '#DCFAE6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        control: '6px',
        card: '12px',
      },
    },
  },
  plugins: [],
}
