import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { ApiError } from '@/api/client'
import {
  useApproveSpaceApplicationMutation,
  useAssignSpaceMemberRoleMutation,
  useRejectSpaceApplicationMutation,
  useSpaceApplications,
  useSpaceMembers,
} from '@/api/hooks/spaces.hooks'
import type { SpaceMemberRole } from '@/api/services/spaces.service'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'

const ROLE_LABEL: Record<SpaceMemberRole, string> = {
  LEADER: 'Leader',
  MODERATOR: 'Moderator',
  MEMBER: 'Member',
}

function initialsFor(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || '??'
}

export default function CircleMembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)

  const { data: members = [] } = useSpaceMembers(id ?? '')
  const { data: applications = [] } = useSpaceApplications(id ?? '')
  const { mutateAsync: approveApplication } = useApproveSpaceApplicationMutation()
  const { mutateAsync: rejectApplication } = useRejectSpaceApplicationMutation()
  const { mutateAsync: assignRole } = useAssignSpaceMemberRoleMutation()

  const [roleSheetMemberId, setRoleSheetMemberId] = useState<string | null>(null)

  const handleApprove = async (memberId: string) => {
    if (!id) return
    try {
      await approveApplication({ id, memberId })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not approve this application.'
      showToast(message, 'error')
    }
  }

  const handleReject = async (memberId: string) => {
    if (!id) return
    try {
      await rejectApplication({ id, memberId })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not reject this application.'
      showToast(message, 'error')
    }
  }

  const handleAssignRole = async (memberId: string, role: SpaceMemberRole) => {
    if (!id) return
    try {
      await assignRole({ id, memberId, role })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not update this member’s role.'
      showToast(message, 'error')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.title}>
          Members
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {applications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending applications</Text>
            {applications.map(application => {
              const displayName = application.profile?.displayName ?? 'Member'
              return (
                <View key={application.memberId} style={styles.row}>
                  <Avatar initials={initialsFor(displayName)} size="md" />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{displayName}</Text>
                    {!!application.profile?.handle && (
                      <Text style={styles.rowSubtitle}>@{application.profile.handle}</Text>
                    )}
                  </View>
                  <View style={styles.applicationActions}>
                    <Button
                      title="Approve"
                      size="sm"
                      style={styles.approveButton}
                      onPress={() => handleApprove(application.memberId)}
                    />
                    <Button
                      title="Reject"
                      size="sm"
                      variant="outline"
                      onPress={() => handleReject(application.memberId)}
                    />
                  </View>
                </View>
              )
            })}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members</Text>
          {members.length === 0 && <Text style={styles.empty}>No members yet.</Text>}
          {members.map(member => {
            const displayName = member.profile?.displayName ?? 'Member'
            return (
              <Pressable
                key={member.memberId}
                style={styles.row}
                onPress={() => setRoleSheetMemberId(member.memberId)}
              >
                <Avatar initials={initialsFor(displayName)} size="md" />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{displayName}</Text>
                  {!!member.profile?.handle && <Text style={styles.rowSubtitle}>@{member.profile.handle}</Text>}
                </View>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{ROLE_LABEL[member.role]}</Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      <ActionSheet
        visible={!!roleSheetMemberId}
        onClose={() => setRoleSheetMemberId(null)}
        actions={(['LEADER', 'MODERATOR', 'MEMBER'] as SpaceMemberRole[]).map(role => ({
          label: `Make ${ROLE_LABEL[role]}`,
          onPress: () => {
            if (roleSheetMemberId) handleAssignRole(roleSheetMemberId, role)
          },
        }))}
      />
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
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    backgroundColor: colors.light.semantic.success,
  },
  roleBadge: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 12,
  },
})
