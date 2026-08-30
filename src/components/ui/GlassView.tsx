import React from 'react'
import { Platform, StyleSheet, ViewProps } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  GlassView as ExpoGlassView,
  GlassColorScheme,
  GlassStyle,
  isLiquidGlassAvailable,
} from 'expo-glass-effect'

import { radii, RadiusValue } from '@/theme/radii'

interface GlassViewProps extends ViewProps {
  glassEffectStyle?: GlassStyle
  tintColor?: string
  isInteractive?: boolean
  colorScheme?: GlassColorScheme
  radius?: RadiusValue
  /** Soft drop shadow that lifts the glass surface off its background. @default true */
  glow?: boolean
}

const glassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable()

export function GlassView({
  glassEffectStyle = 'regular',
  tintColor,
  isInteractive = false,
  colorScheme = 'auto',
  radius = 'xl',
  glow = true,
  style,
  children,
  ...props
}: GlassViewProps) {
  const borderRadius = radii[radius]

  if (glassAvailable) {
    return (
      <ExpoGlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor}
        isInteractive={isInteractive}
        colorScheme={colorScheme}
        style={[{ borderRadius }, glow && styles.glow, style]}
        {...props}
      >
        {children}
      </ExpoGlassView>
    )
  }

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.02)']}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[
        styles.fallback,
        { borderRadius },
        tintColor ? { backgroundColor: tintColor } : null,
        glow && styles.glow,
        style,
      ]}
      {...props}
    >
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: 'rgba(24,24,27,0.45)',
    borderWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
    borderLeftColor: 'rgba(255,255,255,0.24)',
    borderRightColor: 'rgba(255,255,255,0.12)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  glow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
})
