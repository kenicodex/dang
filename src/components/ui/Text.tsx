import React from 'react'
import { Text as RNText, TextProps, StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label'

interface TypographyProps extends TextProps {
  variant?: Variant
}

export function Text({ variant = 'body', style, ...props }: TypographyProps) {
  return <RNText style={[styles.base, styles[variant], style]} {...props} />
}

const styles = StyleSheet.create({
  base: {
    color: colors.light.text,
  },
  h1: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.light.textMuted,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
