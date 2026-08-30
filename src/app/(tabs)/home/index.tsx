import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui'
import { PostCard } from '@/components/community'
import { StreakModal } from '@/components/home'
import { FOR_YOU_POSTS, FOLLOWING_POSTS } from '@/components/community/mockData'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { Post } from '@/types/community'

type HomeTab = 'forYou' | 'following'

export default function HomeScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const openDrawer = useUIStore(s => s.openDrawer)
  const [tab, setTab] = useState<HomeTab>('forYou')
  const [streakVisible, setStreakVisible] = useState(false)
  const insets = useSafeAreaInsets()

  const posts = tab === 'forYou' ? FOR_YOU_POSTS : FOLLOWING_POSTS

  const handlePostPress = (post: Post) => {
    router.push(`/(community)/thread/${post.id}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={openDrawer} hitSlop={8}>
          <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        </Pressable>
        <Pressable onPress={() => setStreakVisible(true)} hitSlop={8}>
          <Text style={styles.streakEmoji}>🔥</Text>
        </Pressable>
        <Pressable style={styles.bellButton} onPress={() => router.push('/home/notifications')}>
          <Icon name="bell" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: 'forYou', label: 'For you' },
          { value: 'following', label: 'Following' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {posts.map(post => (
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
        ))}
      </ScrollView>

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + 96 }]}
        onPress={() => router.push('/(community)/create-post')}
      >
        <Icon name="plus" size={22} tintColor={colors.light.neutral.white} weight="bold" />
      </Pressable>

      <StreakModal visible={streakVisible} onClose={() => setStreakVisible(false)} />
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
})
