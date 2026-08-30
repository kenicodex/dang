import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { RequestCard } from '@/components/support/RequestCard'
import { useSupportStore } from '@/store/useSupportStore'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

type RequestsTab = 'all' | 'resolved'

export default function MyRequestsScreen() {
  const requests = useSupportStore(s => s.requests)
  const [tab, setTab] = useState<RequestsTab>('all')

  const visibleRequests = useMemo(
    () => (tab === 'resolved' ? requests.filter(r => r.status === 'resolved') : requests),
    [requests, tab],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          My Requests
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <Tabs
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'resolved', label: 'Resolved' },
        ]}
        value={tab}
        onChange={setTab}
        stretch={false}
        style={styles.tabs}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visibleRequests.length > 0 ? (
          visibleRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onPress={() => router.push(`/(account)/help/request/${request.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon={<Icon name="bubble.left" size={40} tintColor={colors.light.primary[300]} />}
            title="Start your message"
            description="Start a conversation with our support team."
            actionLabel="Contact support"
            onAction={() => router.push('/(account)/help/contact')}
          />
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/(account)/help/contact')}>
        <Icon name="bubble.left.and.bubble.right.fill" size={22} tintColor={colors.light.neutral.white} />
      </Pressable>
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
    justifyContent: 'space-between',
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
  headerTitle: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  tabs: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 12,
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
