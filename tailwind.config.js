import { tokens } from './src/theme/tokens.ts'

const c = tokens.color

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: c.primary, hover: c.primaryHover },
        secondary: c.secondary,
        accent: c.accent,
        background: c.background,
        surface: c.surface,
        text: { DEFAULT: c.text, muted: c.textMuted },
        border: { DEFAULT: c.border, control: c.borderControl },
        hotspot: { DEFAULT: c.hotspot, chip: c.hotspotChip, chipBg: c.hotspotChipBg },
        notHotspot: c.notHotspot,
        insufficient: c.insufficientDataBg,
        insufficientOutline: c.insufficientData,
        noData: c.noData,
        disabled: { DEFAULT: c.disabledBg, text: c.disabledText },
        error: { DEFAULT: c.error, bg: c.errorBg },
        offline: { DEFAULT: c.offline, bg: c.offlineBg },
        demo: { DEFAULT: c.demo, bg: c.demoBg },
        success: { DEFAULT: c.success, bg: c.successBg },
      },
      fontFamily: {
        sans: [...tokens.font.stack],
      },
      borderRadius: {
        control: tokens.radius.control,
        card: tokens.radius.card,
      },
      boxShadow: {
        card: tokens.shadow.card,
        popover: tokens.shadow.popover,
      },
      minHeight: {
        control: '40px',
        'control-touch': '44px',
      },
      height: {
        map: '600px',
      },
      maxWidth: {
        content: '960px',
      },
      zIndex: {
        map: '1000', // above Leaflet panes
      },
    },
  },
  plugins: [],
}