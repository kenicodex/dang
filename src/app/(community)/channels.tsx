import { useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { SpaceCard } from '@/components/community/SpaceCard'
import { CATEGORIES, SPACES } from '@/components/community/spaces.data'
import { useAuthStore, useCommunityStore } from '@/store'
import { colors } from '@/theme/colors'

type Tab = 'discover' | 'mine'

export default function SpacesScreen() {
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const joinedSpaceIds = useCommunityStore(s => s.joinedSpaceIds)

  const [tab, setTab] = useState<Tab>('discover')
  const [category, setCategory] = useState('All')

  const visibleSpaces = useMemo(() => {
    const base = tab === 'mine' ? SPACES.filter(s => joinedSpaceIds.includes(s.id)) : SPACES
    if (category === 'All') return base
    return base.filter(s => s.category === category)
  }, [tab, category, joinedSpaceIds])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Avatar initials={(user?.displayName ?? 'Me').slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.title}>
          Spaces
        </Text>
        <Pressable style={styles.searchButton} onPress={() => router.push('/(community)/search')}>
          <SymbolView name="magnifyingglass" size={16} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <View style={styles.tabRow}>
        <Pressable style={styles.tabItem} onPress={() => setTab('discover')}>
          <Text style={[styles.tabLabel, tab === 'discover' && styles.tabLabelActive]}>Discover</Text>
          {tab === 'discover' && <View style={styles.tabIndicator} />}
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => setTab('mine')}>
          <Text style={[styles.tabLabel, tab === 'mine' && styles.tabLabelActive]}>My spaces</Text>
          {tab === 'mine' && <View style={styles.tabIndicator} />}
        </Pressable>
      </View>

      {tab === 'discover' && (
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
      )}

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {visibleSpaces.map(space => (
          <SpaceCard
            key={space.id}
            space={space}
            newCount={tab === 'mine' ? 99 : undefined}
            onPress={() => router.push(`/(community)/channel/${space.id}`)}
          />
        ))}
        {visibleSpaces.length === 0 && (
          <Text style={styles.empty}>
            {tab === 'mine' ? "You haven't joined any spaces yet." : 'No spaces in this category yet.'}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 20,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tabItem: {
    paddingBottom: 12,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textSoft,
  },
  tabLabelActive: {
    color: colors.light.text,
  },
  tabIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.light.primary[500],
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
