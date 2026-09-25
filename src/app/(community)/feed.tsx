import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { FilterChips, Tabs, type FilterChip } from '@/components/ui'
import { PostCard, RejectionSheet } from '@/components/community'
import { toLegacyPost } from '@/components/community/postAdapters'
import { ApiError } from '@/api/client'
import {
  useAddReactionMutation,
  useDeletePostMutation,
  useFeed,
  useMyPosts,
  useRemoveReactionMutation,
  useRepostMutation,
} from '@/api/hooks/posts.hooks'
import type { PostModerationStatus as ApiPostModerationStatus } from '@/api/services/posts.service'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { Post, PostModerationStatus } from '@/types/community'

type FeedTab = 'forYou' | 'myPosts'
type StatusFilter = 'all' | PostModerationStatus

const STATUS_CHIPS: FilterChip<StatusFilter>[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_TO_API: Record<PostModerationStatus, ApiPostModerationStatus> = {
  pending: 'PENDING',
  approved: 'PUBLISHED',
  rejected: 'REJECTED',
}

export default function FeedScreen() {
  const user = useAuthStore(s => s.user)
  const showToast = useUIStore(s => s.showToast)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const [tab, setTab] = useState<FeedTab>('forYou')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [rejectedPost, setRejectedPost] = useState<Post | null>(null)

  const { data: feedPage } = useFeed({ sort: 'NEW' })
  const { data: myApiPosts = [] } = useMyPosts(statusFilter === 'all' ? undefined : STATUS_TO_API[statusFilter])
  const { mutate: addReaction } = useAddReactionMutation()
  const { mutate: removeReaction } = useRemoveReactionMutation()
  const { mutateAsync: repost } = useRepostMutation()
  const { mutateAsync: deletePost } = useDeletePostMutation()

  const forYouPosts = useMemo(
    () => (feedPage?.items ?? []).map(post => toLegacyPost(post, likedIds)),
    [feedPage, likedIds],
  )
  const visibleMyPosts = useMemo(
    () => myApiPosts.map(post => toLegacyPost(post, likedIds)),
    [myApiPosts, likedIds],
  )

  const toggleLike = (post: Post) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(post.id)) {
        next.delete(post.id)
        removeReaction({ id: post.id, type: 'LIKE' })
      } else {
        next.add(post.id)
        addReaction({ id: post.id, type: 'LIKE' })
      }
      return next
    })
  }

  const handleRepost = async (post: Post) => {
    try {
      await repost({ id: post.id })
      showToast('Reposted.', 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not repost. Please try again.'
      showToast(message, 'error')
    }
  }

  const handlePostPress = (post: Post) => {
    if (post.moderationStatus === 'rejected') {
      setRejectedPost(post)
      return
    }
    router.push(`/(community)/thread/${post.id}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Avatar initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text style={styles.streakEmoji}>🔥</Text>
        <Pressable style={styles.bellButton}>
          <Icon name="bell" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: 'forYou', label: 'For you' },
          { value: 'myPosts', label: 'My posts' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'myPosts' && (
          <FilterChips chips={STATUS_CHIPS} value={statusFilter} onChange={setStatusFilter} />
        )}

        {(tab === 'forYou' ? forYouPosts : visibleMyPosts).map(post => (
          <PostCard
            key={post.id}
            post={post}
            showStatus={tab === 'myPosts'}
            onPress={() => handlePostPress(post)}
            onLike={() => toggleLike(post)}
            onReply={() => handlePostPress(post)}
            onRepost={() => handleRepost(post)}
            onBookmark={() => {}}
            onShare={() => {}}
          />
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/create-post')}>
        <Icon name="plus" size={22} tintColor={colors.light.neutral.white} weight="bold" />
      </Pressable>

      <RejectionSheet
        visible={!!rejectedPost}
        onClose={() => setRejectedPost(null)}
        reason={rejectedPost?.rejectionReason ?? ''}
        onDelete={async () => {
          if (rejectedPost) {
            try {
              await deletePost(rejectedPost.id)
            } catch (err) {
              const message = err instanceof ApiError ? err.message : 'Could not delete this post.'
              showToast(message, 'error')
            }
          }
          setRejectedPost(null)
        }}
        onEdit={() => {
          setRejectedPost(null)
          router.push('/create-post')
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  streakEmoji: {
    fontSize: 22,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
})
