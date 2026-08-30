import { useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { SpaceCard } from '@/components/community/SpaceCard'
import { CATEGORIES, SPACES } from '@/components/community/spaces.data'
import { colors } from '@/theme/colors'

export default function SpaceSearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const results = useMemo(() => {
    return SPACES.filter(space => {
      const matchesCategory = category === 'All' || space.category === category
      const matchesQuery =
        query.trim().length === 0 || space.name.toLowerCase().includes(query.trim().toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Icon name="chevron.left" size={20} tintColor={colors.light.text} />
        </Pressable>
        <View style={styles.searchField}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a space"
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(c => {
          const isSelected = category === c
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
            >
              <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>{c}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {results.map(space => (
          <SpaceCard key={space.id} space={space} onPress={() => router.push(`/(community)/channel/${space.id}`)} />
        ))}
        {results.length === 0 && <Text style={styles.empty}>No spaces found.</Text>}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchField: {
    flex: 1,
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
  categoryScroll: {
    marginTop: 14,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
  },
  categoryPillSelected: {
    backgroundColor: colors.light.primary[500],
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  categoryLabelSelected: {
    color: colors.light.neutral.white,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
