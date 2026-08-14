import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  label: string
  tone?: Tone
  icon?: React.ReactNode
}

export function Badge({ label, tone = 'default', icon }: BadgeProps) {
  return (
    <View style={[styles.base, styles[`tone_${tone}`]]}>
      {icon}
      <Text style={[styles.text, styles[`text_${tone}`]]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tone_default: {
    backgroundColor: colors.light.surfaceAlt,
  },
  tone_success: {
    backgroundColor: colors.light.semantic.successBg,
  },
  tone_warning: {
    backgroundColor: colors.light.semantic.warningBg,
  },
  tone_danger: {
    backgroundColor: colors.light.semantic.errorBg,
  },
  tone_info: {
    backgroundColor: colors.light.semantic.infoBg,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  text_default: {
    color: colors.light.textAlt,
  },
  text_success: {
    color: colors.light.semantic.success,
  },
  text_warning: {
    color: colors.light.semantic.warning,
  },
  text_danger: {
    color: colors.light.semantic.error,
  },
  text_info: {
    color: colors.light.semantic.info,
  },
})
