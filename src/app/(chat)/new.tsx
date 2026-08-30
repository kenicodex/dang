import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { MEMBERS, getMembersByIds } from '@/components/members/members.data'
import { contactDisplayName } from '@/components/chat'
import { useMembersStore } from '@/store/useMembersStore'
import { colors } from '@/theme/colors'

function threadIdForMember(memberId: string) {
  return `thread-${memberId.replace('mem-', '')}`
}

export default function NewMessagesScreen() {
  const [query, setQuery] = useState('')
  const recentSearchIds = useMembersStore(s => s.recentSearchIds)
  const removeRecentSearch = useMembersStore(s => s.removeRecentSearch)
  const clearRecentSearches = useMembersStore(s => s.clearRecentSearches)
  const addRecentSearch = useMembersStore(s => s.addRecentSearch)

  const recents = getMembersByIds(recentSearchIds)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return MEMBERS.filter(m => m.displayName.toLowerCase().includes(q) || m.handle.toLowerCase().includes(q))
  }, [query])

  const openThread = (memberId: string) => {
    addRecentSearch(memberId)
    router.push(`/(chat)/thread/${threadIdForMember(memberId)}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.navRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.navTitle}>
          New Messages
        </Text>
        <View style={styles.navSpacer} />
      </View>

      <View style={styles.searchRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <View style={styles.searchField}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder=""
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {query.trim() ? (
          results.length > 0 ? (
            results.map(member => (
              <Pressable key={member.id} style={styles.recentRow} onPress={() => openThread(member.id)}>
                <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="md" />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{contactDisplayName(member.id, member.displayName)}</Text>
                  <Text style={styles.recentHandle}>{member.handle}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.empty}>No one found for &ldquo;{query}&rdquo;</Text>
          )
        ) : (
          recents.length > 0 && (
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
                <Pressable key={member.id} style={styles.recentRow} onPress={() => openThread(member.id)}>
                  <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="md" />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentName}>{contactDisplayName(member.id, member.displayName)}</Text>
                    <Text style={styles.recentHandle}>{member.handle}</Text>
                  </View>
                  <Pressable style={styles.recentRemove} onPress={() => removeRecentSearch(member.id)} hitSlop={8}>
                    <Icon name="xmark" size={16} tintColor={colors.light.text} />
                  </Pressable>
                </Pressable>
              ))}
            </>
          )
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
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  navTitle: {
    fontSize: 18,
  },
  navSpacer: {
    width: 36,
    height: 36,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchField: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
  },
  searchInput: {
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
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
