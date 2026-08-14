export const primary = {
  50: '#EFEEFC',
  100: '#DAD9F8',
  200: '#B9B6F1',
  300: '#9894EA',
  400: '#807BE5',
  500: '#6660E0',
  600: '#423BD9',
  700: '#2D25C0',
  800: '#231D95',
  900: '#181466',
}

const secondary = {
  50: '#EDE9FE',
  100: '#DDD6FE',
  200: '#C4B5FD',
  400: '#A78BFA',
  500: '#8B5CF6',
  700: '#6D28D9',
}

const tertiary = {
  50: '#D1FAE5',
  100: '#A7F3D0',
  400: '#34D399',
  600: '#059669',
  800: '#065F46',
}

const neutral = {
  white: '#FFFFFF',
  background: '#F9FAFB',
  surface: '#F3F4F6',
  border: '#E5E7EB',
  muted: '#D1D5DB',
  placeholder: '#9CA3AF',
  secondaryText: '#6B7280',
  dark: '#374151',
  black: '#1A1A1A',
}

const semantic = {
  successBg: '#D1FAE5',
  success: '#10B981',
  errorBg: '#FEE2E2',
  error: '#EF4444',
  warningBg: '#FEF3C7',
  warning: '#F59E0B',
  infoBg: '#DBEAFE',
  info: '#3B82F6',
}

const light = {
  bg: '#FFFFFF',
  bgAlt: '#F9FAFB',
  bgElevated: '#FFFFFF',
  bgSoft: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',
  border: '#E5E7EB',
  borderAlt: '#F3F4F6',
  text: '#111827',
  textAlt: '#374151',
  textMuted: '#6B7280',
  textSoft: '#9CA3AF',
  textInverse: '#FFFFFF',
}

const dark = {
  bg: '#0B1220',
  bgAlt: '#0F172A',
  bgElevated: '#1E293B',
  bgSoft: '#1E293B',
  surface: '#111827',
  surfaceAlt: '#1E293B',
  border: '#334155',
  borderAlt: '#1E293B',
  text: '#F9FAFB',
  textAlt: '#E5E7EB',
  textMuted: '#94A3B8',
  textSoft: '#64748B',
  textInverse: '#0B1220',
}

export const colors = {
  light: {
    primary,
    secondary,
    tertiary,
    neutral,
    semantic,
    danger: semantic.error,
    ...light,
  },
  dark: {
    primary,
    secondary,
    tertiary,
    neutral,
    semantic,
    danger: semantic.error,
    ...dark,
  },
}

export type ColorScheme = keyof typeof colors
