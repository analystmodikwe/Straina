export const tokens = {
  color: {
    primary: '#0F4C5C',
    primaryHover: '#0B3A47',
    secondary: '#334155',
    accent: '#0369A1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#475569',
    border: '#CBD5E1',
    borderControl: '#64748B',
    error: '#B42318',
    errorBg: '#FEF3F2',
    offline: '#7A2E0E',
    offlineBg: '#FEF0C7',
    demo: '#4C1D95',
    demoBg: '#EDE9FE',
    success: '#085D3A',
    successBg: '#DCFAE6',
    hotspot: '#C2410C',
    hotspotChip: '#9A3412',
    hotspotChipBg: '#FFEDD5',
    notHotspot: '#2F7F9E',
    insufficientData: '#475569', // dashed outline
    insufficientDataBg: '#E2E8F0', // fill
    noData: '#64748B', // hollow outline
    disabledBg: '#E2E8F0',
    disabledText: '#64748B',
  },
  font: {
    family: 'Inter, system-ui, sans-serif',
    stack: ['Inter', 'system-ui', 'sans-serif'],
    // Matches Tailwind's default text-* sizes, so no fontSize override is needed.
    size: {
      pageTitle: { size: '30px', lineHeight: '36px', weight: 600 }, // text-3xl font-semibold
      sectionHeading: { size: '20px', lineHeight: '28px', weight: 600 }, // text-xl font-semibold
      body: { size: '16px', lineHeight: '24px', weight: 400 }, // text-base
      label: { size: '14px', lineHeight: '20px', weight: 500 }, // text-sm font-medium
      button: { size: '14px', lineHeight: '20px', weight: 600 }, // text-sm font-semibold
      helper: { size: '12px', lineHeight: '16px', weight: 500 }, // text-xs font-medium
      wordmark: { size: '20px', lineHeight: '28px', weight: 700 }, // text-xl font-bold
    },
  },
  spacing: {
    base: 4,
    scale: [4, 8, 12, 16, 24, 32, 48],
  },
  radius: {
    control: '6px',
    card: '12px',
    tag: '9999px',
  },
  shadow: {
    card: '0 1px 2px rgba(15,23,42,0.08)',
    popover: '0 4px 12px rgba(15,23,42,0.12)',
  },
} as const