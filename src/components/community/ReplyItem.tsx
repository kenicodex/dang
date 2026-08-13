import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import type { Reply } from '@/types/community'

interface ReplyItemProps {
  reply: Reply
  depth?: number
}

export function ReplyItem({ reply, depth = 0 }: ReplyItemProps) {
  return (
    <View style={[styles.container, { marginLeft: depth * 20 }]}>
      {depth > 0 && <View style={styles.threadLine} />}
      <View style={styles.wrapper}>
        {reply.isAnonymous ? (
          <Avatar initials="?" size="sm" />
        ) : (
          <Avatar
            uri={reply.author?.avatarUrl}
            initials={reply.author?.displayName?.slice(0, 2)}
            size="sm"
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h3" style={styles.name}>
              {reply.isAnonymous ? 'Anonymous' : reply.author?.displayName}
            </Text>
            <Text variant="caption"> · {reply.timeAgo}</Text>
          </View>
          <Text variant="body" style={styles.text}>{reply.content}</Text>
          <View style={styles.actions}>
            <Text variant="caption">❤️ {reply.likeCount}</Text>
            <Text variant="caption">↩️ Reply</Text>
          </View>
        </View>
      </View>
      {reply.replies?.map(r => (
        <ReplyItem key={r.id} reply={r} depth={depth + 1} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  threadLine: {
    position: 'absolute',
    left: -12,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  wrapper: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
})
