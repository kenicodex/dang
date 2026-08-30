import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { NearbyMemberCard, SuggestedMemberCard, CATEGORIES, NEARBY_MEMBERS, SUGGESTED_MEMBERS } from '@/components/members'
import { useAuthStore, useMembersStore } from '@/store'
import { colors } from '@/theme/colors'

function Section({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <Text style={styles.seeAll} onPress={onSeeAll}>
          see all
        </Text>
      )}
    </View>
  )
}

export default function SistersNearYouScreen() {
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const followingIds = useMembersStore(s => s.followingIds)
  const toggleFollow = useMembersStore(s => s.toggleFollow)

  const [category, setCategory] = useState('All')
  const [nearby, setNearby] = useState(NEARBY_MEMBERS)
  const [suggested, setSuggested] = useState(SUGGESTED_MEMBERS)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Avatar initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.title}>
          Sisters near you
        </Text>
        <Pressable style={styles.searchButton} onPress={() => router.push('/(community)/sisters-search')}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.text} />
        </Pressable>
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="sisters nearby" onSeeAll={() => router.push('/(community)/sisters-nearby')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll} contentContainerStyle={styles.hScrollContent}>
          {nearby.map(member => (
            <NearbyMemberCard
              key={member.id}
              member={{ ...member, isFollowing: followingIds.includes(member.id) }}
              onPress={() => router.push(`/(community)/profile/${member.id}`)}
              onToggleFollow={() => toggleFollow(member.id)}
              onDismiss={() => setNearby(prev => prev.filter(m => m.id !== member.id))}
            />
          ))}
          {nearby.length === 0 && (
            <Text style={styles.empty}>No one nearby right now.</Text>
          )}
        </ScrollView>

        <Section title="people you may know" onSeeAll={() => router.push('/(community)/sisters-suggestions')} />
        <View style={styles.grid}>
          {suggested.map(member => (
            <SuggestedMemberCard
              key={member.id}
              member={{ ...member, isFollowing: followingIds.includes(member.id) }}
              onPress={() => router.push(`/(community)/profile/${member.id}`)}
              onToggleFollow={() => toggleFollow(member.id)}
              onDismiss={() => setSuggested(prev => prev.filter(m => m.id !== member.id))}
            />
          ))}
          {suggested.length === 0 && (
            <Text style={styles.empty}>No more suggestions right now.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
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
  categoryScroll: {
    marginTop: 14,
    flexGrow: 0,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  categoryPill: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillSelected: {
    backgroundColor: colors.light.primary[500],
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.light.text,
  },
  categoryLabelSelected: {
    color: colors.light.neutral.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  seeAll: {
    color: colors.light.primary[500],
    fontWeight: '600',
    fontSize: 13,
  },
  hScroll: {
    marginHorizontal: -20,
  },
  hScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  empty: {
    color: colors.light.textMuted,
    paddingHorizontal: 4,
  },
})
