import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { PostModerationStatus } from '@/types/community'

const CONFIG: Record<PostModerationStatus, { label: string; color: string }> = {
  pending: { label: 'PENDING', color: colors.light.semantic.warning },
  approved: { label: 'APPROVED', color: colors.light.semantic.success },
  rejected: { label: 'REJECTED', color: colors.light.semantic.error },
}

interface StatusDotProps {
  status: PostModerationStatus
}

export function StatusDot({ status }: StatusDotProps) {
  const { label, color } = CONFIG[status]
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})
