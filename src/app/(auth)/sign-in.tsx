import { useState } from 'react'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'

export default function SignInScreen() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)
  const isLoading = useAuthStore(s => s.isLoading)
  const showToast = useUIStore(s => s.showToast)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async () => {
    try {
      await login(email.trim(), password)
      router.replace('/home')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      showToast(message, 'error')
    }
  }

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <View style={styles.container}>
        <Text variant="h2">Sign In</Text>
        <Text style={styles.subtitle}>Good to see you again</Text>

        <View style={styles.form}>
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

          <View>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.passwordLabel}>
                Create password<Text style={styles.required}> *</Text>
              </Text>
              <Text
                style={styles.forgotLink}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                forgot password?
              </Text>
            </View>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              showPasswordToggle
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <Button
          title="Sign In"
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={!email.trim() || !password}
          style={styles.submit}
          onPress={handleSignIn}
        />

        <Text style={styles.signUpRow}>
          new here?{' '}
          <Text style={styles.signUpLink} onPress={() => router.push('/(auth)/sign-up')}>
            create account
          </Text>
        </Text>
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  subtitle: {
    color: colors.light.textMuted,
    marginTop: 6,
    marginBottom: 28,
  },
  form: {
    gap: 20,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  passwordLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  required: {
    color: colors.light.semantic.error,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  submit: {
    marginTop: 32,
  },
  signUpRow: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 20,
  },
  signUpLink: {
    color: colors.light.primary[500],
    fontWeight: '700',
  },
})
