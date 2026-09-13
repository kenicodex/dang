import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'

export default function ResetPasswordScreen() {
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token?: string }>()
  const resetPassword = useAuthStore(s => s.resetPassword)
  const isLoading = useAuthStore(s => s.isLoading)
  const showToast = useUIStore(s => s.showToast)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)

  const meetsPolicy = useMemo(
    () => newPassword.length >= 8 && /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /\d/.test(newPassword),
    [newPassword],
  )
  const canSubmit = !!token && meetsPolicy && newPassword === confirmPassword

  const handleSubmit = async () => {
    if (!token) return
    try {
      const success = await resetPassword(token, newPassword)
      if (success) {
        setDone(true)
      } else {
        showToast('That reset link is invalid or has expired.', 'error')
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      showToast(message, 'error')
    }
  }

  if (!token) {
    return (
      <FlowScreen>
        <StepHeader onBack={() => router.back()} />
        <View style={styles.confirmContainer}>
          <Text variant="h2" style={styles.headline}>
            Invalid reset link
          </Text>
          <Text style={styles.subtitle}>This password reset link is missing or invalid. Please request a new one.</Text>
          <Button
            title="Request new link"
            variant="outline"
            size="lg"
            style={styles.fullWidthButton}
            onPress={() => router.replace('/(auth)/forgot-password')}
          />
        </View>
      </FlowScreen>
    )
  }

  if (done) {
    return (
      <FlowScreen>
        <View style={styles.confirmContainer}>
          <View style={styles.iconRing}>
            <Icon name="checkmark" size={28} weight="bold" tintColor={colors.light.primary[500]} />
          </View>
          <Text variant="h2" style={styles.headline}>
            Password updated
          </Text>
          <Text style={styles.subtitle}>Your password has been reset. You can now sign in with your new password.</Text>
          <Button
            title="Sign in"
            size="lg"
            style={styles.fullWidthButton}
            onPress={() => router.replace('/(auth)/sign-in')}
          />
        </View>
      </FlowScreen>
    )
  }

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <View style={styles.container}>
        <Text style={styles.emoji}>🔒</Text>
        <Text variant="h2">Set a new password</Text>
        <Text style={styles.subtitleLeft}>
          Your new password must be at least 8 characters and include uppercase, lowercase, and a number.
        </Text>

        <View style={styles.form}>
          <Input
            label="New Password"
            required
            value={newPassword}
            onChangeText={setNewPassword}
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            label="Confirm Password"
            required
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
            error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
          />
        </View>

        <Button
          title="Reset password"
          size="lg"
          loading={isLoading}
          disabled={!canSubmit}
          style={styles.submit}
          onPress={handleSubmit}
        />
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitleLeft: {
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  form: {
    gap: 20,
  },
  submit: {
    marginTop: 32,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: colors.light.primary[100],
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headline: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
})
