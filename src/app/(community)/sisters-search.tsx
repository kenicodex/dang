import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { SuggestedMemberCard } from '@/components/members/SuggestedMemberCard'
import { MemberListRow } from '@/components/members/MemberListRow'
import { MEMBERS, SEARCH_SUGGESTED_IDS, getMembersByIds } from '@/components/members/members.data'
import { useMembersStore } from '@/store/useMembersStore'
import { colors } from '@/theme/colors'

export default function SearchSistersScreen() {
  const [query, setQuery] = useState('')
  const recentSearchIds = useMembersStore(s => s.recentSearchIds)
  const removeRecentSearch = useMembersStore(s => s.removeRecentSearch)
  const clearRecentSearches = useMembersStore(s => s.clearRecentSearches)
  const followingIds = useMembersStore(s => s.followingIds)
  const toggleFollow = useMembersStore(s => s.toggleFollow)
  const addRecentSearch = useMembersStore(s => s.addRecentSearch)

  const recents = getMembersByIds(recentSearchIds)
  const suggested = getMembersByIds(SEARCH_SUGGESTED_IDS)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return MEMBERS.filter(
      m => m.displayName.toLowerCase().includes(q) || m.handle.toLowerCase().includes(q),
    )
  }, [query])

  const openProfile = (id: string) => {
    addRecentSearch(id)
    router.push(`/(community)/profile/${id}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.searchRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <View style={styles.searchField}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Sisters"
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {query.trim() ? (
          results.length > 0 ? (
            results.map(member => (
              <MemberListRow
                key={member.id}
                member={member}
                isFollowing={followingIds.includes(member.id)}
                onPress={() => openProfile(member.id)}
                onToggleFollow={() => toggleFollow(member.id)}
              />
            ))
          ) : (
            <Text style={styles.empty}>No sisters found for &ldquo;{query}&rdquo;</Text>
          )
        ) : (
          <>
            {recents.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text variant="label" style={styles.sectionLabel}>
                    Recents
                  </Text>
                  <Pressable onPress={clearRecentSearches} hitSlop={8}>
                    <Text style={styles.clearAll}>clear all</Text>
                  </Pressable>
                </View>
                {recents.map(member => (
                  <Pressable key={member.id} style={styles.recentRow} onPress={() => openProfile(member.id)}>
                    <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="md" />
                    <View style={styles.recentInfo}>
                      <Text style={styles.recentName}>{member.displayName}</Text>
                      <Text style={styles.recentHandle}>{member.handle}</Text>
                    </View>
                    <Pressable
                      style={styles.recentRemove}
                      onPress={() => removeRecentSearch(member.id)}
                      hitSlop={8}
                    >
                      <Icon name="xmark" size={16} tintColor={colors.light.text} />
                    </Pressable>
                  </Pressable>
                ))}
              </>
            )}

            <Text variant="label" style={[styles.sectionLabel, styles.suggestedLabel]}>
              Suggested
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestedContent}
            >
              {suggested.map(member => (
                <View key={member.id} style={styles.suggestedCard}>
                  <SuggestedMemberCard
                    member={{ ...member, isFollowing: followingIds.includes(member.id) }}
                    onPress={() => openProfile(member.id)}
                    onToggleFollow={() => toggleFollow(member.id)}
                  />
                </View>
              ))}
            </ScrollView>

            <Button
              title="See all"
              variant="secondary"
              onPress={() => router.push('/(community)/sisters-suggestions')}
              style={styles.seeAllButton}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  suggestedLabel: {
    marginTop: 16,
    marginBottom: 12,
  },
  clearAll: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  recentInfo: {
    flex: 1,
    gap: 2,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  recentHandle: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  recentRemove: {
    padding: 8,
  },
  suggestedContent: {
    gap: 12,
    paddingRight: 4,
  },
  suggestedCard: {
    width: 170,
  },
  seeAllButton: {
    marginTop: 20,
    borderRadius: 999,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
