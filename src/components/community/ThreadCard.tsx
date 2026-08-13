import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { Thread } from '@/types/community'

interface ThreadCardProps {
  thread: Thread
  onPress?: () => void
}

export function ThreadCard({ thread, onPress }: ThreadCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <Badge label={`#${thread.channelName}`} tone="info" />
          {thread.isLocked && <Badge label="🔒 Locked" tone="warning" />}
        </View>
        <Text variant="h3" style={styles.title}>{thread.title}</Text>
        <Text variant="body" style={styles.preview} numberOfLines={2}>
          {thread.preview}
        </Text>
        <View style={styles.footer}>
          <View style={styles.participants}>
            {thread.participantAvatars?.slice(0, 3).map((uri, i) => (
              <Avatar key={i} uri={uri} size="xs" style={styles.stackAvatar} />
            ))}
            {thread.participantCount > 3 && (
              <View style={styles.moreCount}>
                <Text variant="caption">+{thread.participantCount - 3}</Text>
              </View>
            )}
          </View>
          <Text variant="caption">
            💬 {thread.replyCount} · {thread.timeAgo}
          </Text>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    marginBottom: 6,
  },
  preview: {
    color: '#6B7280',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    marginLeft: -6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreCount: {
    marginLeft: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
})
