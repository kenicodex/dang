import { useState } from 'react'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { ApiError } from '@/api/client'
import { useRequestPasswordResetMutation } from '@/api/hooks/auth.hooks'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const { mutateAsync: requestPasswordReset, isPending: isLoading } = useRequestPasswordResetMutation()
  const showToast = useUIStore(s => s.showToast)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    try {
      const wasSent = await requestPasswordReset({ email: email.trim() })
      setSent(wasSent)
      if (!wasSent) showToast('Could not send reset instructions. Please try again.', 'error')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      showToast(message, 'error')
    }
  }

  if (sent) {
    return (
      <FlowScreen>
        <StepHeader onBack={() => router.back()} />
        <View style={styles.confirmContainer}>
          <View style={styles.iconRing}>
            <Icon name="envelope.fill" size={28} tintColor={colors.light.primary[500]} />
          </View>
          <Text variant="h2" style={styles.headline}>
            Check your email
          </Text>
          <Text style={styles.subtitle}>
            If an account exists for{'\n'}
            <Text style={styles.subtitleStrong}>{email}</Text>, we&rsquo;ve sent instructions to reset your
            password.
          </Text>
          <Button title="Back to sign in" variant="outline" size="lg" style={styles.backButton} onPress={() => router.replace('/(auth)/sign-in')} />
        </View>
      </FlowScreen>
    )
  }

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <View style={styles.container}>
        <Text style={styles.emoji}>🔑</Text>
        <Text variant="h2">Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter the email on your account and we&rsquo;ll send you instructions to reset it.
        </Text>

        <Input
          label="Email address"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title="Send reset instructions"
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={!email.trim()}
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
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
  subtitleStrong: {
    color: colors.light.text,
    fontWeight: '700',
  },
  submit: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  backButton: {
    alignSelf: 'stretch',
  },
})
