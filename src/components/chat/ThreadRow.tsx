import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { ChatThreadSummary } from '@/types/chat'

interface ThreadRowProps {
  thread: ChatThreadSummary
  onPress?: () => void
}

export function ThreadRow({ thread, onPress }: ThreadRowProps) {
  if (thread.circle) {
    return <CircleThreadRow thread={thread} onPress={onPress} />
  }

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.avatarWrap}>
        {thread.memberAvatars ? (
          <View style={styles.stack}>
            {thread.memberAvatars.slice(0, 3).map((uri, i) => (
              <Avatar key={uri + i} uri={uri} size="sm" style={[styles.stackAvatar, i > 0 && styles.stackAvatarOverlap]} />
            ))}
          </View>
        ) : (
          <Avatar uri={thread.avatarUrl} initials={thread.title.slice(0, 2)} size="lg" />
        )}
        {thread.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {thread.title}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {thread.preview}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.time}>{thread.time}</Text>
        {!!thread.unreadCount && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{thread.unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

function CircleThreadRow({ thread, onPress }: ThreadRowProps) {
  return (
    <Pressable style={styles.circleCard} onPress={onPress}>
      {thread.memberAvatars ? (
        <View style={[styles.stack, styles.circleStack]}>
          {thread.memberAvatars.slice(0, 3).map((uri, i) => (
            <Avatar key={uri + i} uri={uri} size="md" style={[styles.stackAvatar, i > 0 && styles.stackAvatarOverlap]} />
          ))}
        </View>
      ) : (
        <Avatar uri={thread.avatarUrl} initials={thread.title.slice(0, 2)} size="lg" />
      )}

      <View style={styles.circleInfo}>
        <View style={styles.circleTitleRow}>
          <Text style={styles.name}>{thread.title}</Text>
          {thread.circle?.isPrivate && (
            <View style={styles.privatePill}>
              <Icon name="lock.fill" size={10} tintColor={colors.light.primary[600]} />
              <Text style={styles.privatePillText}>Private</Text>
            </View>
          )}
        </View>
        <Text style={styles.hostedBy} numberOfLines={1}>
          Hosted by {thread.circle?.hostedBy}
        </Text>
        <Text style={styles.circleDescription} numberOfLines={2}>
          {thread.circle?.description}
        </Text>
      </View>

      <Icon name="chevron.right" size={16} tintColor={colors.light.textSoft} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  stack: {
    flexDirection: 'row',
    width: 44,
  },
  circleStack: {
    width: 76,
  },
  stackAvatar: {
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  stackAvatarOverlap: {
    marginLeft: -14,
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.semantic.success,
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  preview: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  time: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 18,
    padding: 14,
    marginBottom: 4,
  },
  circleInfo: {
    flex: 1,
    gap: 3,
  },
  circleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.light.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  privatePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  hostedBy: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  circleDescription: {
    fontSize: 12,
    color: colors.light.textMuted,
    lineHeight: 17,
  },
})
