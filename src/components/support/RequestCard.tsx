import { Pressable, StyleSheet, View } from 'react-native'

import { Badge } from '@/components/ui/Badge'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { SupportRequest } from '@/types/support'
import { STATUS_META } from './support.data'

interface RequestCardProps {
  request: SupportRequest
  onPress?: () => void
}

export function RequestCard({ request, onPress }: RequestCardProps) {
  const status = STATUS_META[request.status]

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.id}>#{request.id}</Text>
        <Badge label={status.label} tone={status.tone} />
      </View>
      <Text style={styles.subject} numberOfLines={1}>
        {request.subject}
      </Text>
      <Text style={styles.message} numberOfLines={2}>
        {request.message}
      </Text>
      <Text style={styles.updated}>{request.updatedLabel}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  id: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textSoft,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.light.textMuted,
  },
  updated: {
    fontSize: 12,
    color: colors.light.textSoft,
    marginTop: 6,
  },
})
