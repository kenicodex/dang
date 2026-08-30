import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { colors } from '@/theme/colors'

function getPasswordStrength(password: string) {
  if (!password) return null
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { progress: 0.33, label: 'Weak password', color: colors.light.semantic.error }
  if (score <= 2) return { progress: 0.66, label: 'Good password', color: colors.light.semantic.warning }
  return { progress: 1, label: 'Strong password', color: colors.light.semantic.success }
}

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword])

  const meetsPolicy =
    newPassword.length >= 8 && /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /\d/.test(newPassword)
  const canSubmit = !!currentPassword && meetsPolicy && !!confirmPassword && newPassword === confirmPassword

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Change Password
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Icon name="lock.shield.fill" size={20} tintColor={colors.light.primary[500]} />
          <Text style={styles.infoText}>
            Your password must be at least 8 characters and include uppercase, lowercase, and a number.
          </Text>
        </View>

        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          showPasswordToggle
          containerStyle={styles.field}
        />
        <Input
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          showPasswordToggle
          containerStyle={styles.field}
        />
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          showPasswordToggle
          error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
          containerStyle={styles.field}
        />

        {strength && (
          <View style={styles.strengthWrap}>
            <View style={styles.strengthTrack}>
              <View style={[styles.strengthFill, { width: `${strength.progress * 100}%`, backgroundColor: strength.color }]} />
            </View>
            <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
          </View>
        )}

        <Button title="Update Password" disabled={!canSubmit} style={styles.submitButton} onPress={() => router.back()} />
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
    paddingTop: 20,
    paddingBottom: 40,
    gap: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textAlt,
  },
  field: {
    gap: 0,
  },
  strengthWrap: {
    gap: 8,
    marginTop: -6,
  },
  strengthTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.light.border,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 999,
    marginTop: 8,
    backgroundColor: colors.light.primary[500],
  },
})
