import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Checkbox } from '@/components/ui/Checkbox'
import { DangFooter } from '@/components/account/DangFooter'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'

const DELETED_ITEMS = [
  'Your profile and personal information',
  'Your posts, comments, and community activity',
  'Daily faith posts & reflections',
  'Learning progress and certificates',
  'Points, badges, streaks, and leaderboard rankings',
  'Event registrations and attendance history',
]

export default function DeleteAccountScreen() {
  const logout = useAuthStore(s => s.logout)
  const [confirmed, setConfirmed] = useState(false)

  const handleDelete = () => {
    logout()
    router.replace('/(auth)')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Delete Account
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBanner}>
          <View style={styles.warningTitleRow}>
            <Icon name="exclamationmark.circle.fill" size={16} tintColor={colors.light.semantic.error} />
            <Text style={styles.warningTitle}>Permanent Action Warning</Text>
          </View>
          <Text style={styles.warningBody}>
            Deleting your account is permanent and cannot be undone. Once your account is deleted, you will lose
            access to your profile, courses, community activity, event registrations, saved content, and
            subscription benefits. Please review the information below before continuing.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>What Will Be Deleted</Text>
        <View style={styles.list}>
          {DELETED_ITEMS.map(item => (
            <View key={item} style={styles.listRow}>
              <Icon name="checkmark.circle.fill" size={16} tintColor={colors.light.semantic.success} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Confirmation Checkbox</Text>
        <Pressable style={styles.confirmRow} onPress={() => setConfirmed(v => !v)}>
          <Checkbox checked={confirmed} onChange={setConfirmed} />
          <Text style={styles.confirmText}>I understand that deleting my account is permanent and cannot be undone.</Text>
        </Pressable>

        <Pressable style={styles.keepAccount} onPress={() => router.back()}>
          <Text style={styles.keepAccountText}>Keep My Account</Text>
        </Pressable>

        <Pressable style={[styles.deleteButton, !confirmed && styles.deleteButtonDisabled]} disabled={!confirmed} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Yes, Delete My Account</Text>
        </Pressable>

        <DangFooter />
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
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  warningBanner: {
    backgroundColor: colors.light.semantic.errorBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  warningTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
  warningBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textAlt,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  list: {
    gap: 12,
    marginBottom: 24,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  confirmText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textAlt,
  },
  keepAccount: {
    alignItems: 'center',
    marginBottom: 14,
  },
  keepAccountText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textSoft,
  },
  deleteButton: {
    backgroundColor: colors.light.semantic.errorBg,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
})
