export const primary = {
  50: '#F0EFFE',
  100: '#DEDCFD',
  200: '#C2BFF8',
  300: '#9B96EC',
  400: '#817CE6',
  500: '#6660E0',
  600: '#524DC9',
  700: '#413DAF',
  800: '#332F8A',
  900: '#232060',
}

const secondary = {
  50: '#FFF0EC',
  100: '#FDDDD4',
  200: '#F5A88F',
  400: '#EB7B5E',
  500: '#E0613C',
  700: '#9E3E28',
}

const tertiary = {
  50: '#E6F5F0',
  100: '#B0DFD0',
  400: '#3EAA88',
  600: '#2B8A6E',
  800: '#1E6B52',
}

const neutral = {
  white: '#FAFAF7',
  background: '#F5F4F0',
  surface: '#EEECEA',
  border: '#E5E3DD',
  muted: '#C5C2BA',
  placeholder: '#8A8680',
  secondaryText: '#6B6862',
  dark: '#3A3835',
  black: '#1A1A1A',
}

const semantic = {
  successBg: '#E6F5EC',
  success: '#2B8A4E',
  errorBg: '#FFF0F0',
  error: '#C43E3E',
  warningBg: '#FFF6E6',
  warning: '#D4970A',
  infoBg: '#E8F2FF',
  info: '#2A6CB6',
}

// No dark-mode values were provided for this palette. The light/dark UI
// slots below are derived from the same neutral scale (flipped), rather
// than inventing new brand hex values.
const light = {
  bg: neutral.background,
  bgAlt: neutral.surface,
  bgElevated: neutral.white,
  bgSoft: neutral.surface,
  surface: neutral.white,
  surfaceAlt: neutral.surface,
  border: neutral.border,
  borderAlt: neutral.muted,
  text: neutral.black,
  textAlt: neutral.dark,
  textMuted: neutral.secondaryText,
  textSoft: neutral.placeholder,
  textInverse: neutral.white,
}

const dark = {
  bg: neutral.black,
  bgAlt: neutral.dark,
  bgElevated: neutral.dark,
  bgSoft: neutral.dark,
  surface: neutral.dark,
  surfaceAlt: neutral.black,
  border: neutral.secondaryText,
  borderAlt: neutral.placeholder,
  text: neutral.white,
  textAlt: neutral.background,
  textMuted: neutral.muted,
  textSoft: neutral.placeholder,
  textInverse: neutral.black,
}

export const colors = {
  light: {
    primary,
    secondary,
    tertiary,
    neutral,
    semantic,
    ...light,
  },
  dark: {
    primary,
    secondary,
    tertiary,
    neutral,
    semantic,
    ...dark,
  },
}

export type ColorScheme = keyof typeof colors
