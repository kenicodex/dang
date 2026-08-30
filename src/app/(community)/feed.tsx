import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { FilterChips, Tabs, type FilterChip } from '@/components/ui'
import { PostCard, RejectionSheet } from '@/components/community'
import { FOR_YOU_POSTS, MY_POSTS } from '@/components/community/mockData'
import { useAuthStore } from '@/store/useAuthStore'
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

export default function FeedScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const [tab, setTab] = useState<FeedTab>('forYou')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [myPosts, setMyPosts] = useState<Post[]>(MY_POSTS)
  const [rejectedPost, setRejectedPost] = useState<Post | null>(null)

  const visibleMyPosts = myPosts.filter(
    post => statusFilter === 'all' || post.moderationStatus === statusFilter,
  )

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

        {(tab === 'forYou' ? FOR_YOU_POSTS : visibleMyPosts).map(post => (
          <PostCard
            key={post.id}
            post={post}
            showStatus={tab === 'myPosts'}
            onPress={() => handlePostPress(post)}
            onLike={() => {}}
            onReply={() => {}}
            onRepost={() => {}}
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
        onDelete={() => {
          setMyPosts(posts => posts.filter(p => p.id !== rejectedPost?.id))
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
