import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { OtpInput } from '@/components/flow/OtpInput'
import { colors } from '@/theme/colors'

const CODE_LENGTH = 4
const RESEND_SECONDS = 28

function maskContact(method: string, value: string) {
  if (method === 'email') {
    const [name, domain] = value.split('@')
    if (!domain) return value
    return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 1))}@${domain}`
  }
  return `${value.slice(0, -4)}****`
}

export default function VerifyScreen() {
  const router = useRouter()
  const { method = 'phone', value = '+234 812 345 6789' } = useLocalSearchParams<{
    method?: string
    value?: string
  }>()
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (secondsLeft === 0) return
    const timer = setInterval(() => setSecondsLeft(s => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <View style={styles.container}>
        <View style={styles.iconRing}>
          <Text style={styles.emoji}>🔒</Text>
        </View>

        <Text variant="h2" style={styles.headline}>Enter your code</Text>
        <Text style={styles.subtitle}>
          We sent a {CODE_LENGTH}-digit code to{'\n'}
          <Text style={styles.subtitleStrong}>{maskContact(method, value)}</Text>
        </Text>

        <OtpInput length={CODE_LENGTH} value={code} onChangeText={setCode} autoFocus />

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Text style={styles.resendText}>
              Didn&rsquo;t get a code? Resend in 0:{secondsLeft.toString().padStart(2, '0')}
            </Text>
          ) : (
            <Pressable onPress={() => setSecondsLeft(RESEND_SECONDS)}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}
          <Pressable onPress={() => router.back()}>
            <Text style={styles.altMethod}>or try a different method</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.fabRow}>
        <NextFab onPress={() => router.push('/(onboarding)/name')} />
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
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
  emoji: {
    fontSize: 36,
    lineHeight: 44,
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
  resendRow: {
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  resendText: {
    color: colors.light.textMuted,
    fontSize: 13,
  },
  resendLink: {
    color: colors.light.primary[500],
    fontWeight: '700',
    fontSize: 13,
  },
  altMethod: {
    color: colors.light.textSoft,
    fontSize: 13,
  },
  fabRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
})
