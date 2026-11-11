import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { OtpInput } from '@/components/flow/OtpInput'
import { NextFab } from '@/components/flow/NextFab'
import { ApiError } from '@/api/client'
import { useResendEmailVerificationMutation, useVerifyEmailMutation } from '@/api/hooks/auth.hooks'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { USE_MOCK_DATA } from '@/constants/env'

const CODE_LENGTH = 6
const RESEND_SECONDS = 30

/** Reached right after register() succeeds, since verifying email requires an authenticated session. */
export default function VerifyEmailCodeScreen() {
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmailMutation()
  const { mutateAsync: resendVerification, isPending: isResending } = useResendEmailVerificationMutation()
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const hasSentInitialCode = useRef(false)

  const goNext = () => router.replace('/(onboarding)/welcome')

  const sendCode = async (isManualResend: boolean) => {
    try {
      const response = await resendVerification()
      if (response.alreadyVerified) {
        goNext()
        return
      }
      setSecondsLeft(RESEND_SECONDS)
      if (isManualResend) showToast('A new code has been sent to your email.', 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not send a verification code. Please try again.'
      showToast(message, 'error')
    }
  }

  useEffect(() => {
    if (hasSentInitialCode.current) return
    hasSentInitialCode.current = true
    sendCode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (secondsLeft === 0) return
    const timer = setInterval(() => setSecondsLeft(s => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleVerify = async () => {
    try {
      const response = await verifyEmail({ code })
      if (response.verified) {
        goNext()
      } else {
        showToast('That code didn’t work. Please try again.', 'error')
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'That code didn’t work. Please try again.'
      showToast(message, 'error')
    }
  }

  return (
    <FlowScreen>
      <View style={styles.container}>
        <View style={styles.iconRing}>
          <Text style={styles.emoji}>📧</Text>
        </View>

        <Text variant="h2" style={styles.headline}>
          Check your email
        </Text>
        <Text style={styles.subtitle}>
          We sent a {CODE_LENGTH}-digit code to your email address to confirm it&rsquo;s you.
        </Text>

        <OtpInput length={CODE_LENGTH} value={code} onChangeText={setCode} autoFocus />

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Text style={styles.resendText}>
              Didn&rsquo;t get a code? Resend in 0:{secondsLeft.toString().padStart(2, '0')}
            </Text>
          ) : (
            <Pressable onPress={() => sendCode(true)} disabled={isResending}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}
        </View>

        <Pressable onPress={goNext} style={styles.skip}>
          <Text style={styles.skipText}>Skip for now, verify later</Text>
        </Pressable>
      </View>

      <View style={styles.fabRow}>
        <NextFab onPress={handleVerify} disabled={!USE_MOCK_DATA && code.length < CODE_LENGTH} loading={isPending} />
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
  resendRow: {
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
  skip: {
    marginTop: 16,
  },
  skipText: {
    color: colors.light.textSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  fabRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
})
