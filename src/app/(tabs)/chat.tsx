import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui'
import { ThreadRow, ChatEmptyState, PERSONAL_THREADS, GROUP_THREADS } from '@/components/chat'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'

type MessagesTab = 'personal' | 'group'

export default function MessagesScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const [tab, setTab] = useState<MessagesTab>('personal')

  const threads = tab === 'personal' ? PERSONAL_THREADS : GROUP_THREADS
  const totalUnread = PERSONAL_THREADS.reduce((sum, t) => sum + (t.unreadCount ?? 0), 0)

  const openThread = (id: string) => router.push(`/(chat)/thread/${id}`)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.title}>
          Messages
        </Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={() => router.push('/(chat)/new')}>
            <Icon name="square.and.pencil" size={17} tintColor={colors.light.text} />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push('/(chat)/new')}>
            <Icon name="magnifyingglass" size={17} tintColor={colors.light.text} />
          </Pressable>
        </View>
      </View>

      <Tabs
        tabs={[
          { value: 'personal', label: 'Personal', badge: totalUnread || undefined },
          { value: 'group', label: 'Group' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {threads.length === 0 ? (
          <ChatEmptyState
            title="Start your message"
            description={
              tab === 'personal'
                ? 'Start conversation with other friends.'
                : 'Make your conversations with divisions or friends more structured and organized'
            }
            actionLabel={tab === 'personal' ? 'Add New Message' : 'Start Group'}
            onAction={() => router.push('/(chat)/new')}
          />
        ) : (
          threads.map(thread => (
            <ThreadRow key={thread.id} thread={thread} onPress={() => openThread(thread.id)} />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    padding: 4,
  },
  headerButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
})
