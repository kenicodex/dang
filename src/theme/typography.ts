export const typography = {
  fontFamily: {
    display: 'System',
    body: 'System',
    mono: 'System',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.3,
    normal: 0,
    wide: 0.2,
    label: 0.5,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },
  scale: {
    h1: { fontSize: 40, fontWeight: '900', letterSpacing: -0.8, lineHeight: 1.1 },
    h2: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 1.15 },
    h3: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, lineHeight: 1.25 },
    h4: { fontSize: 20, fontWeight: '700', letterSpacing: -0.2, lineHeight: 1.3 },
    bodyXL: { fontSize: 18, fontWeight: '400', letterSpacing: -0.1, lineHeight: 1.5 },
    body: { fontSize: 15, fontWeight: '400', letterSpacing: 0, lineHeight: 1.5 },
    bodySm: { fontSize: 14, fontWeight: '400', letterSpacing: 0, lineHeight: 1.5 },
    caption: { fontSize: 13, fontWeight: '400', letterSpacing: 0, lineHeight: 1.4 },
    label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, lineHeight: 1.2 },
    eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, lineHeight: 1.1 },
  },
} as const

export type TypographyScale = keyof typeof typography.scale
