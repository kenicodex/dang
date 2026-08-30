import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { colors } from '@/theme/colors'
import type { Post } from '@/types/community'
import { AnonymousAvatar } from './AnonymousAvatar'
import { StatusDot } from './StatusDot'

interface PostCardProps {
  post: Post
  showStatus?: boolean
  onPress?: () => void
  onLike?: () => void
  onReply?: () => void
  onRepost?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onMore?: () => void
}

export function PostCard({
  post,
  showStatus,
  onPress,
  onLike,
  onReply,
  onRepost,
  onBookmark,
  onShare,
  onMore,
}: PostCardProps) {
  const tag = post.tags?.[0]
  const hasEngagement = (post.replyCount || 0) > 0 || (post.likeCount || 0) > 0

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          {post.isAnonymous ? (
            <AnonymousAvatar size="md" />
          ) : (
            <Avatar
              uri={post.author?.avatarUrl}
              initials={post.author?.displayName?.slice(0, 2) || '??'}
              size="md"
            />
          )}
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text variant="h3" style={styles.name}>
                {post.isAnonymous ? post.anonymousHandle || 'Anonymous Sister' : post.author?.displayName}
              </Text>
              {post.isPinned && <Badge label="📌 Pinned" tone="info" />}
            </View>
            <View style={styles.metaRow}>
              <Text variant="caption">{post.timeAgo}</Text>
              {showStatus && (
                <>
                  <Text variant="caption"> · </Text>
                  <StatusDot status={post.moderationStatus} />
                </>
              )}
            </View>
          </View>
          <Pressable hitSlop={8} onPress={onMore}>
            <Icon name="ellipsis" size={18} tintColor={colors.light.textSoft} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text variant="body">{post.content}</Text>
          {tag && (
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText}>#{tag}</Text>
            </View>
          )}
        </View>

        {post.attachments?.[0]?.type === 'image' && (
          <View style={styles.mediaPlaceholder} />
        )}

        {post.attachments?.[0]?.type === 'video' && (
          <View style={styles.videoPlaceholder}>
            <View style={styles.playButton}>
              <Icon name="play.fill" size={22} tintColor={colors.light.neutral.white} />
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <View style={styles.actionsLeft}>
            <Pressable style={styles.action} onPress={onLike} hitSlop={6}>
              <Icon
                name={post.hasLiked ? 'heart.fill' : 'heart'}
                size={18}
                tintColor={post.hasLiked ? colors.light.semantic.error : colors.light.textMuted}
              />
            </Pressable>
            <Pressable style={styles.action} onPress={onReply} hitSlop={6}>
              <Icon name="bubble.left" size={18} tintColor={colors.light.textMuted} />
            </Pressable>
            <Pressable style={styles.action} onPress={onRepost} hitSlop={6}>
              <Icon name="arrow.2.squarepath" size={18} tintColor={colors.light.textMuted} />
            </Pressable>
          </View>
          <View style={styles.actionsRight}>
            <Pressable style={styles.action} onPress={onBookmark} hitSlop={6}>
              <Icon
                name={post.hasBookmarked ? 'bookmark.fill' : 'bookmark'}
                size={18}
                tintColor={post.hasBookmarked ? colors.light.primary[500] : colors.light.textMuted}
              />
            </Pressable>
            <Pressable style={styles.action} onPress={onShare} hitSlop={6}>
              <Icon name="paperplane" size={18} tintColor={colors.light.textMuted} />
            </Pressable>
          </View>
        </View>

        {hasEngagement && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryAvatars}>
              {post.replierAvatars?.slice(0, 3).map((uri, i) => (
                <Avatar key={i} uri={uri} size="xs" style={styles.stackAvatar} />
              ))}
            </View>
            <Text variant="caption">
              {post.replyCount} replies · {post.likeCount} Likes
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    marginBottom: 12,
  },
  tagPill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.light.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagPillText: {
    color: colors.light.primary[500],
    fontSize: 12,
    fontWeight: '600',
  },
  mediaPlaceholder: {
    height: 140,
    borderRadius: 12,
    backgroundColor: colors.light.surfaceAlt,
    marginBottom: 12,
  },
  videoPlaceholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.light.neutral.black,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingTop: 12,
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: 20,
  },
  actionsRight: {
    flexDirection: 'row',
    gap: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  summaryAvatars: {
    flexDirection: 'row',
  },
  stackAvatar: {
    marginLeft: -6,
    borderWidth: 2,
    borderColor: colors.light.surface,
  },
})
