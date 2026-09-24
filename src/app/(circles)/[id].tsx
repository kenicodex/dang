import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/api/client'
import { useApplyToSpaceMutation, useSpace, useSpaceMembers } from '@/api/hooks/spaces.hooks'
import { useAuthStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)
  const currentUserId = useAuthStore(s => s.user?.id)

  const { data: space, isLoading } = useSpace(id ?? '')
  const { data: members = [] } = useSpaceMembers(id ?? '')
  const { mutateAsync: applyToSpace, isPending: isApplying } = useApplyToSpaceMutation()
  const [applied, setApplied] = useState(false)

  const isMember = !!currentUserId && members.some(member => member.memberId === currentUserId)

  const handleApply = async () => {
    if (!id) return
    try {
      await applyToSpace(id)
      setApplied(true)
      showToast('Your application has been sent for review.', 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not send your application. Please try again.'
      showToast(message, 'error')
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Loading circle…</Text>
      </SafeAreaView>
    )
  }

  if (!space) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Circle not found.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.title} numberOfLines={1}>
          {space.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.emoji}>{space.emoji ?? '🔒'}</Text>
        <Text style={styles.description}>{space.description}</Text>
        <Text style={styles.memberCount}>{space.memberCount} members</Text>

        {isMember ? (
          <View style={styles.linksRow}>
            <Pressable style={styles.linkButton} onPress={() => router.push(`/(circles)/${id}/members`)}>
              <Text style={styles.linkButtonText}>Members</Text>
            </Pressable>
            <Pressable style={styles.linkButton} onPress={() => router.push(`/(circles)/${id}/invite`)}>
              <Text style={styles.linkButtonText}>Invite</Text>
            </Pressable>
          </View>
        ) : (
          <Button
            title={applied ? 'Application sent' : 'Apply to join'}
            disabled={applied}
            loading={isApplying}
            style={styles.applyButton}
            onPress={handleApply}
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
  title: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.light.textAlt,
    textAlign: 'center',
    lineHeight: 22,
  },
  memberCount: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 8,
  },
  applyButton: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  linkButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
