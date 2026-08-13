import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

interface CardProps extends ViewProps {
  padded?: boolean
}

export function Card({ padded = true, style, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    ...shadows.sm,
  },
  padded: {
    padding: 16,
  },
})
