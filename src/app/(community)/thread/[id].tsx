import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { PostDetail } from '@/components/community/PostDetail'
import { ReplyItem } from '@/components/community/ReplyItem'
import { ReplyComposerBar } from '@/components/community/ReplyComposerBar'
import { findPostById, getRepliesForPost } from '@/components/community/mockData'
import { useAuthStore } from '@/store'
import { colors } from '@/theme/colors'
import type { Reply } from '@/types/community'

function updateReplyTree(replies: Reply[], targetId: string, update: (reply: Reply) => Reply): Reply[] {
  return replies.map(reply => {
    if (reply.id === targetId) return update(reply)
    if (reply.replies?.length) {
      return { ...reply, replies: updateReplyTree(reply.replies, targetId, update) }
    }
    return reply
  })
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const user = useAuthStore(s => s.user)

  const initialPost = useMemo(() => findPostById(id), [id])
  const [post, setPost] = useState(initialPost)
  const [replies, setReplies] = useState<Reply[]>(() => getRepliesForPost(id ?? ''))
  const [replyTarget, setReplyTarget] = useState<Reply | null>(null)

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <SymbolView name="chevron.left" size={18} tintColor={colors.light.text} />
          </Pressable>
          <Text variant="h3" style={styles.headerTitle}>
            Post
          </Text>
          <View style={styles.iconButton} />
        </View>
        <Text style={styles.empty}>This post is no longer available.</Text>
      </SafeAreaView>
    )
  }

  const toggleReplyLike = (reply: Reply) => {
    setReplies(prev =>
      updateReplyTree(prev, reply.id, r => ({
        ...r,
        hasLiked: !r.hasLiked,
        likeCount: r.hasLiked ? r.likeCount - 1 : r.likeCount + 1,
      })),
    )
  }

  const handleSubmitReply = (content: string) => {
    const newReply: Reply = {
      id: `local-reply-${Date.now()}`,
      postId: post.id,
      parentReplyId: replyTarget?.id,
      author: { id: 'me', displayName: user?.displayName ?? 'You', handle: '@me' },
      content,
      isAnonymous: false,
      likeCount: 0,
      timeAgo: 'now',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (replyTarget) {
      setReplies(prev =>
        updateReplyTree(prev, replyTarget.id, r => ({
          ...r,
          replies: [...(r.replies ?? []), newReply],
        })),
      )
    } else {
      setReplies(prev => [...prev, newReply])
    }

    setPost(p => (p ? { ...p, replyCount: p.replyCount + 1 } : p))
    setReplyTarget(null)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <SymbolView name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Post
        </Text>
        <View style={styles.iconButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <PostDetail
            post={post}
            onLike={() =>
              setPost(p =>
                p ? { ...p, hasLiked: !p.hasLiked, likeCount: p.hasLiked ? p.likeCount - 1 : p.likeCount + 1 } : p,
              )
            }
            onReply={() => setReplyTarget(null)}
            onBookmark={() => setPost(p => (p ? { ...p, hasBookmarked: !p.hasBookmarked } : p))}
          />

          <View style={styles.divider} />

          <View style={styles.repliesSection}>
            {replies.length > 0 ? (
              replies.map(reply => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onLike={toggleReplyLike}
                  onReply={setReplyTarget}
                />
              ))
            ) : (
              <Text style={styles.empty}>No replies yet. Be the first to join the conversation.</Text>
            )}
          </View>
        </ScrollView>

        <ReplyComposerBar
          replyingToName={
            replyTarget
              ? replyTarget.isAnonymous
                ? replyTarget.anonymousHandle || 'Anonymous'
                : replyTarget.author?.displayName
              : undefined
          }
          onCancelReplyTo={() => setReplyTarget(null)}
          onSubmit={handleSubmitReply}
          userAvatarUri={user?.avatarUrl}
          userInitials={(user?.displayName ?? 'Me').slice(0, 2).toUpperCase()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  divider: {
    height: 8,
    backgroundColor: colors.light.surfaceAlt,
  },
  repliesSection: {
    paddingHorizontal: 16,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
    paddingHorizontal: 20,
  },
})
