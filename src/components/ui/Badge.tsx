import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

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
    backgroundColor: '#F3F4F6',
  },
  tone_success: {
    backgroundColor: '#D1FAE5',
  },
  tone_warning: {
    backgroundColor: '#FEF3C7',
  },
  tone_danger: {
    backgroundColor: '#FEE2E2',
  },
  tone_info: {
    backgroundColor: '#DBEAFE',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  text_default: {
    color: '#374151',
  },
  text_success: {
    color: '#065F46',
  },
  text_warning: {
    color: '#92400E',
  },
  text_danger: {
    color: '#991B1B',
  },
  text_info: {
    color: '#1E40AF',
  },
})
