import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { SessionEntry } from './liveSession.data'

interface SessionListCardProps {
  session: SessionEntry
  onPress?: () => void
}

export function SessionListCard({ session, onPress }: SessionListCardProps) {
  const icon = session.status === 'live' ? 'dot.radiowaves.left.and.right' : session.status === 'upcoming' ? 'calendar' : 'play.fill'

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumb}>
        <Icon name={icon} size={20} tintColor={colors.light.neutral.white} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {session.title}
        </Text>
        <Text style={styles.host}>{session.host}</Text>
        <View style={styles.metaRow}>
          {session.status === 'live' ? (
            <Badge label="LIVE" tone="danger" />
          ) : (
            <Text style={styles.metaText}>
              {session.duration ? `${session.duration} · ` : ''}
              {session.dateLabel}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.sm,
  },
  thumb: {
    width: 88,
    backgroundColor: colors.light.neutral.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  host: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
})
