import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import type { Replay } from '@/types/learning'

interface ReplayCardProps {
  replay: Replay
  onPress?: () => void
}

export function ReplayCard({ replay, onPress }: ReplayCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.thumbnail}>
          <Text style={styles.playIcon}>▶</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{replay.duration}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text variant="h3" style={styles.title}>{replay.title}</Text>
          <Text variant="caption" style={styles.meta}>
            {replay.sessionDate} · {replay.host}
          </Text>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 14,
  },
  thumbnail: {
    height: 120,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  durationBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {},
})
