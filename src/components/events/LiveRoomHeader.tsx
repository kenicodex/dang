import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

interface LiveRoomHeaderProps {
  title: string
  hostName: string
  hostAvatar?: string
  participantCount?: number
  isRecording?: boolean
}

export function LiveRoomHeader({
  title,
  hostName,
  hostAvatar,
  participantCount = 0,
  isRecording,
}: LiveRoomHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <View style={styles.badges}>
            <Badge label="🔴 LIVE" tone="danger" />
            {isRecording && <Badge label="● REC" tone="warning" />}
          </View>
          <Text variant="h2" style={styles.title}>{title}</Text>
        </View>
        <View style={styles.participants}>
          <Badge label={`👥 ${participantCount}`} tone="info" />
        </View>
      </View>
      <View style={styles.hostRow}>
        <Avatar uri={hostAvatar} initials={hostName.slice(0, 2)} size="sm" ring />
        <View>
          <Text variant="caption">Host</Text>
          <Text variant="h3" style={styles.hostName}>{hostName}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  participants: {},
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hostName: {
    color: '#E2E8F0',
    fontSize: 14,
  },
})
