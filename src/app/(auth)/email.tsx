import { useState } from 'react'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { colors } from '@/theme/colors'

export default function EmailSignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <View style={styles.container}>
        <Text style={styles.emoji}>📧</Text>
        <Text variant="h2">What&rsquo;s your email?</Text>
        <Text style={styles.subtitle}>We&rsquo;ll send you a verification code to confirm it&rsquo;s you.</Text>

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
          <Input
            label="Create password"
            required
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            label="Create password"
            required
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <FooterNote icon="lock.fill">Your data is encrypted and secure</FooterNote>
        <View style={styles.fabRow}>
          <NextFab
            onPress={() =>
              router.push({ pathname: '/(auth)/verify', params: { method: 'email', value: email } })
            }
          />
        </View>
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
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  form: {
    gap: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  fabRow: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
})
