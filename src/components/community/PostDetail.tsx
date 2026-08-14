import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { SymbolView } from 'expo-symbols'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { AnonymousAvatar } from './AnonymousAvatar'
import { colors } from '@/theme/colors'
import type { Post } from '@/types/community'

interface PostDetailProps {
  post: Post
  onLike?: () => void
  onReply?: () => void
  onRepost?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onMore?: () => void
}

export function PostDetail({ post, onLike, onReply, onRepost, onBookmark, onShare, onMore }: PostDetailProps) {
  const image = post.attachments?.find(a => a.type === 'image')

  return (
    <View style={styles.container}>
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
          <Text variant="caption">{post.timeAgo}</Text>
        </View>
        <Pressable hitSlop={8} onPress={onMore}>
          <SymbolView name="ellipsis" size={18} tintColor={colors.light.textSoft} />
        </Pressable>
      </View>

      <Text variant="body" style={styles.content}>
        {post.content}
      </Text>

      {post.tags?.[0] && (
        <View style={styles.tagPill}>
          <Text style={styles.tagPillText}>#{post.tags[0]}</Text>
        </View>
      )}

      {image &&
        (image.url ? (
          <Image source={{ uri: image.url }} style={styles.media} contentFit="cover" />
        ) : (
          <View style={styles.media} />
        ))}

      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <Pressable onPress={onLike} hitSlop={8}>
            <SymbolView
              name={post.hasLiked ? 'heart.fill' : 'heart'}
              size={22}
              tintColor={post.hasLiked ? colors.light.semantic.error : colors.light.text}
            />
          </Pressable>
          <Pressable onPress={onReply} hitSlop={8}>
            <SymbolView name="bubble.left" size={22} tintColor={colors.light.text} />
          </Pressable>
          <Pressable onPress={onRepost} hitSlop={8}>
            <SymbolView name="arrow.2.squarepath" size={22} tintColor={colors.light.text} />
          </Pressable>
        </View>
        <View style={styles.actionsRight}>
          <Pressable hitSlop={8} onPress={onBookmark}>
            <SymbolView
              name={post.hasBookmarked ? 'bookmark.fill' : 'bookmark'}
              size={20}
              tintColor={colors.light.text}
            />
          </Pressable>
          <Pressable hitSlop={8} onPress={onShare}>
            <SymbolView name="paperplane" size={20} tintColor={colors.light.text} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
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
    fontSize: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 23,
  },
  tagPill: {
    marginTop: 10,
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
  media: {
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: 14,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: colors.light.surfaceAlt,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: 22,
  },
  actionsRight: {
    flexDirection: 'row',
    gap: 20,
  },
})
