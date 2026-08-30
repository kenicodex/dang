import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostCard } from '@/components/community'
import { BOOKMARKED_POSTS, VIDEO_POSTS, LIKED_POSTS } from '@/components/community/history.data'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'
import type { Post } from '@/types/community'

type HistoryTab = 'bookmark' | 'videos' | 'likes'

const TAB_DATA: Record<HistoryTab, Post[]> = {
  bookmark: BOOKMARKED_POSTS,
  videos: VIDEO_POSTS,
  likes: LIKED_POSTS,
}

const EMPTY_COPY: Record<HistoryTab, { title: string; description: string }> = {
  bookmark: {
    title: 'No bookmarks yet',
    description: 'Posts you bookmark will show up here.',
  },
  videos: {
    title: 'No saved videos yet',
    description: 'Videos you bookmark will show up here.',
  },
  likes: {
    title: 'No likes yet',
    description: 'Posts you like will show up here.',
  },
}

export default function HistoryScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const [tab, setTab] = useState<HistoryTab>('bookmark')

  const posts = TAB_DATA[tab]

  const handlePostPress = (post: Post) => {
    router.push(`/(community)/thread/${post.id}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.title}>
          History
        </Text>
        <Pressable style={styles.searchButton} onPress={() => router.push('/(community)/search')}>
          <Icon name="magnifyingglass" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: 'bookmark', label: 'Bookmark', icon: 'bookmark' },
          { value: 'videos', label: 'Videos', icon: 'play.circle' },
          { value: 'likes', label: 'Likes', icon: 'heart' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {posts.length === 0 ? (
          <EmptyState title={EMPTY_COPY[tab].title} description={EMPTY_COPY[tab].description} />
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => handlePostPress(post)}
              onLike={() => {}}
              onReply={() => {}}
              onRepost={() => {}}
              onBookmark={() => {}}
              onShare={() => {}}
            />
          ))
        )}
      </ScrollView>
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
  title: {
    fontSize: 20,
  },
  searchButton: {
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
})
