import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { LiveSession } from '@/types/learning'

interface LiveSessionCardProps {
  session: LiveSession
  onPress?: () => void
  onJoin?: () => void
}

export function LiveSessionCard({ session, onPress, onJoin }: LiveSessionCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          {session.isLive && <Badge label="🔴 LIVE NOW" tone="danger" />}
          {!session.isLive && <Badge label="Upcoming" tone="info" />}
        </View>
        <Text variant="h2" style={styles.title}>{session.title}</Text>
        <Text variant="caption" style={styles.subtitle}>
          with {session.host} · {session.date}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text variant="caption">📍 {session.location || 'In-Platform Room'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text variant="caption">👥 {session.participantCount || 0} attending</Text>
          </View>
        </View>
        {session.isLive && (
          <Button
            title="Join Live Session"
            variant="primary"
            style={styles.joinBtn}
            onPress={onJoin}
          />
        )}
        {!session.isLive && (
          <Button
            title="Set Reminder"
            variant="secondary"
            style={styles.joinBtn}
            onPress={onJoin}
          />
        )}
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 14,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {},
  joinBtn: {
    marginTop: 4,
  },
})
