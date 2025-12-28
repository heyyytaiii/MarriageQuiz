export const theme = {
  colors: {
    primary: {
      25: '#f8fbff',
      50: '#e0ecff',
      100: '#bfdbfe',
      200: '#93c5fd',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    ink: {
      50: '#f8fafc',
      100: '#e2e8f0',
      300: '#cbd5e1',
      500: '#475569',
      700: '#334155',
      900: '#0f172a',
    },
    success: {
      surface: '#ecfdf3',
      border: '#bbf7d0',
      text: '#166534',
    },
    warning: {
      surface: '#fff7ed',
      border: '#fed7aa',
      text: '#9a3412',
    },
    danger: {
      surface: '#fef2f2',
      border: '#fecdd3',
      text: '#b91c1c',
    },
    background: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
  },
  radius: {
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  shadow: {
    sm: '0 8px 18px rgba(37, 99, 235, 0.12)',
    lg: '0 12px 30px rgba(15, 23, 42, 0.04)',
  },
  spacing: (value: number) => `${value * 4}px`,
  typography: {
    title1: {
      size: '32px',
      lineHeight: 1.2,
      weight: 800,
    },
    title2: {
      size: '20px',
      lineHeight: 1.3,
      weight: 700,
    },
    body: {
      size: '15px',
      lineHeight: 1.5,
      weight: 400,
    },
    label: {
      size: '14px',
      lineHeight: 1.4,
      weight: 600,
      letterSpacing: '0.02em',
    },
  },
  fontFamily:
    "'Pretendard', 'Spoqa Han Sans Neo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

export type Theme = typeof theme
