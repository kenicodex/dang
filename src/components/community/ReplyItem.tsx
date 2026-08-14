import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { AnonymousAvatar } from './AnonymousAvatar'
import { colors } from '@/theme/colors'
import type { Reply } from '@/types/community'

const AVATAR_SIZE = 32

interface ReplyItemProps {
  reply: Reply
  depth?: number
  onLike?: (reply: Reply) => void
  onReply?: (reply: Reply) => void
  onRepost?: (reply: Reply) => void
  onBookmark?: (reply: Reply) => void
  onShare?: (reply: Reply) => void
  onMore?: (reply: Reply) => void
}

export function ReplyItem({ reply, depth = 0, onLike, onReply, onRepost, onBookmark, onShare, onMore }: ReplyItemProps) {
  const name = reply.isAnonymous ? reply.anonymousHandle || 'Anonymous' : reply.author?.displayName ?? 'Member'
  const nestedCount = reply.replies?.length ?? 0

  return (
    <View style={depth === 0 ? styles.top : styles.nested}>
      {depth > 0 && <View style={styles.threadLine} />}
      <View style={styles.row}>
        {reply.isAnonymous ? (
          <AnonymousAvatar size="sm" />
        ) : (
          <Avatar uri={reply.author?.avatarUrl} initials={reply.author?.displayName?.slice(0, 2)} size="sm" />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h3" style={styles.name}>
              {name}
            </Text>
            <Text variant="caption" style={styles.time}>
              {reply.timeAgo}
            </Text>
            <Pressable hitSlop={8} onPress={() => onMore?.(reply)}>
              <SymbolView name="ellipsis" size={16} tintColor={colors.light.textSoft} />
            </Pressable>
          </View>

          <Text variant="body" style={styles.text}>
            {reply.content}
          </Text>

          <View style={styles.actions}>
            <View style={styles.actionsLeft}>
              <Pressable style={styles.action} onPress={() => onLike?.(reply)} hitSlop={6}>
                <SymbolView
                  name={reply.hasLiked ? 'heart.fill' : 'heart'}
                  size={16}
                  tintColor={reply.hasLiked ? colors.light.semantic.error : colors.light.textMuted}
                />
                {reply.likeCount > 0 && (
                  <Text variant="caption" style={styles.actionCount}>
                    {reply.likeCount}
                  </Text>
                )}
              </Pressable>
              <Pressable style={styles.action} onPress={() => onReply?.(reply)} hitSlop={6}>
                <SymbolView name="bubble.left" size={16} tintColor={colors.light.textMuted} />
                {nestedCount > 0 && (
                  <Text variant="caption" style={styles.actionCount}>
                    {nestedCount}
                  </Text>
                )}
              </Pressable>
              <Pressable style={styles.action} onPress={() => onRepost?.(reply)} hitSlop={6}>
                <SymbolView name="arrow.2.squarepath" size={16} tintColor={colors.light.textMuted} />
              </Pressable>
            </View>
            <View style={styles.actionsRight}>
              <Pressable hitSlop={6} onPress={() => onBookmark?.(reply)}>
                <SymbolView name="bookmark" size={16} tintColor={colors.light.textMuted} />
              </Pressable>
              <Pressable hitSlop={6} onPress={() => onShare?.(reply)}>
                <SymbolView name="paperplane" size={16} tintColor={colors.light.textMuted} />
              </Pressable>
            </View>
          </View>

          {reply.replies?.map(child => (
            <ReplyItem
              key={child.id}
              reply={child}
              depth={depth + 1}
              onLike={onLike}
              onReply={onReply}
              onRepost={onRepost}
              onBookmark={onBookmark}
              onShare={onShare}
              onMore={onMore}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  top: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderAlt,
  },
  nested: {
    position: 'relative',
    marginTop: 12,
  },
  threadLine: {
    position: 'absolute',
    left: AVATAR_SIZE / 2 - 1,
    top: -16,
    height: 16,
    width: 1.5,
    backgroundColor: colors.light.border,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
  },
  time: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textAlt,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: 18,
  },
  actionsRight: {
    flexDirection: 'row',
    gap: 18,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 12,
  },
})
