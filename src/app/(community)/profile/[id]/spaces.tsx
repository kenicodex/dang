import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { EmptyState } from '@/components/ui/EmptyState'
import { SpaceCard } from '@/components/community/SpaceCard'
import { SPACES } from '@/components/community/spaces.data'
import { findMember } from '@/components/members/members.data'
import { useCommunityStore } from '@/store/useCommunityStore'
import { colors } from '@/theme/colors'

export default function SpacesInCommonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const member = findMember(id ?? '')
  const joinedSpaceIds = useCommunityStore(s => s.joinedSpaceIds)

  const commonSpaces = SPACES.filter(
    space => joinedSpaceIds.includes(space.id) && !!member?.joinedSpaceIds?.includes(space.id),
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Spaces in common
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {commonSpaces.length > 0 ? (
          commonSpaces.map(space => (
            <SpaceCard
              key={space.id}
              space={space}
              onPress={() => router.push(`/(community)/channel/${space.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon={<Icon name="person.2" size={36} tintColor={colors.light.primary[300]} />}
            title="No spaces in common"
            description={member ? `You and ${member.displayName} don't share any spaces yet.` : undefined}
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
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
})
