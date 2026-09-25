import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { PostDetail } from '@/components/community/PostDetail'
import { ReplyItem } from '@/components/community/ReplyItem'
import { ReplyComposerBar } from '@/components/community/ReplyComposerBar'
import { toLegacyPost, buildReplyTree } from '@/components/community/postAdapters'
import { ApiError } from '@/api/client'
import { useAddReactionMutation, useCreatePostMutation, usePostThread, useRemoveReactionMutation } from '@/api/hooks/posts.hooks'
import { useAuthStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import type { Reply } from '@/types/community'

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const showToast = useUIStore(s => s.showToast)

  const { data: thread, refetch } = usePostThread(id ?? '')
  const { mutate: addReaction } = useAddReactionMutation()
  const { mutate: removeReaction } = useRemoveReactionMutation()
  const { mutateAsync: createPost } = useCreatePostMutation()

  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [replyTarget, setReplyTarget] = useState<Reply | null>(null)

  const post = useMemo(() => (thread ? toLegacyPost(thread.post, likedIds) : undefined), [thread, likedIds])
  const replies = useMemo(
    () => (thread ? buildReplyTree(thread.post.id, thread.replies, likedIds) : []),
    [thread, likedIds],
  )

  if (!post || !thread) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
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

  const toggleLike = (postId: string) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
        removeReaction({ id: postId, type: 'LIKE' })
      } else {
        next.add(postId)
        addReaction({ id: postId, type: 'LIKE' })
      }
      return next
    })
  }

  const handleSubmitReply = async (content: string) => {
    try {
      await createPost({
        spaceId: thread.post.spaceId,
        parentId: replyTarget?.id ?? thread.post.id,
        contentType: 'TEXT',
        body: content,
        isAnonymous: false,
      })
      await refetch()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not post your reply. Please try again.'
      showToast(message, 'error')
    } finally {
      setReplyTarget(null)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
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
            onLike={() => toggleLike(post.id)}
            onReply={() => setReplyTarget(null)}
            onBookmark={() => {}}
          />

          <View style={styles.divider} />

          <View style={styles.repliesSection}>
            {replies.length > 0 ? (
              replies.map(reply => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onLike={r => toggleLike(r.id)}
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
