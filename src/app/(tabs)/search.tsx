import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { PostCard } from '@/components/community'
import { toLegacyPost } from '@/components/community/postAdapters'
import { usePostSearch } from '@/api/hooks/posts.hooks'
import { useState } from 'react'
import { colors } from '@/theme/colors'

export default function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { data: results = [], isFetching } = usePostSearch({ q: query })
  const posts = results.map(post => toLegacyPost(post))

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchField}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search posts"
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {query.trim().length === 0 && <Text style={styles.empty}>Search for posts by keyword.</Text>}
        {query.trim().length > 0 && isFetching && <Text style={styles.empty}>Searching…</Text>}
        {query.trim().length > 0 && !isFetching && posts.length === 0 && (
          <Text style={styles.empty}>No posts found.</Text>
        )}
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() => router.push(`/(community)/thread/${post.id}`)}
            onLike={() => {}}
            onReply={() => {}}
            onRepost={() => {}}
            onBookmark={() => {}}
            onShare={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 4,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
