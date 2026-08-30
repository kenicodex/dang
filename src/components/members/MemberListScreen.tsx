import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { EmptyState } from '@/components/ui/EmptyState'
import { useMembersStore } from '@/store/useMembersStore'
import { colors } from '@/theme/colors'
import type { MemberProfile } from '@/types/members'
import { MemberListRow } from './MemberListRow'

interface MemberListScreenProps {
  title: string
  members: MemberProfile[]
  showLocation?: boolean
  emptyMessage?: string
}

export function MemberListScreen({ title, members, showLocation, emptyMessage }: MemberListScreenProps) {
  const followingIds = useMembersStore(s => s.followingIds)
  const toggleFollow = useMembersStore(s => s.toggleFollow)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {members.length > 0 ? (
          members.map(member => (
            <MemberListRow
              key={member.id}
              member={member}
              showLocation={showLocation}
              isFollowing={followingIds.includes(member.id)}
              onPress={() => router.push(`/(community)/profile/${member.id}`)}
              onToggleFollow={() => toggleFollow(member.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={<Icon name="person.2" size={36} tintColor={colors.light.primary[300]} />}
            title="Nobody here yet"
            description={emptyMessage ?? 'Check back soon.'}
          />
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
    fontSize: 18,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
})
