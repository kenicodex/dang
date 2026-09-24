import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { useConfirmEmailChangeMutation, useVerifyEmailMutation } from '@/api/hooks/auth.hooks'
import { colors } from '@/theme/colors'

type Status = 'checking' | 'verified' | 'failed'

export default function VerifyEmailScreen() {
  const router = useRouter()
  const { token, type } = useLocalSearchParams<{ token?: string; type?: string }>()
  const isChange = type === 'change'
  const { mutateAsync: verifyEmail } = useVerifyEmailMutation()
  const { mutateAsync: confirmEmailChange } = useConfirmEmailChangeMutation()
  const [status, setStatus] = useState<Status>(() => (token ? 'checking' : 'failed'))

  useEffect(() => {
    if (!token) return
    let cancelled = false
    const request = isChange
      ? confirmEmailChange({ token }).then(() => true)
      : verifyEmail({ token }).then(response => response.verified)
    request
      .then(verified => {
        if (!cancelled) setStatus(verified ? 'verified' : 'failed')
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })
    return () => {
      cancelled = true
    }
  }, [token, isChange, verifyEmail, confirmEmailChange])

  const goNext = () => router.replace(status === 'verified' ? '/(auth)/sign-in' : '/(auth)/forgot-password')

  return (
    <FlowScreen>
      <View style={styles.container}>
        {status === 'checking' && (
          <>
            <ActivityIndicator size="large" color={colors.light.primary[500]} />
            <Text style={styles.headline}>Verifying your email…</Text>
          </>
        )}

        {status === 'verified' && (
          <>
            <View style={styles.iconRing}>
              <Icon name="checkmark" size={28} weight="bold" tintColor={colors.light.primary[500]} />
            </View>
            <Text variant="h2" style={styles.headline}>
              {isChange ? 'Email updated' : 'Email verified'}
            </Text>
            <Text style={styles.subtitle}>
              {isChange
                ? 'Your new email address is now confirmed.'
                : 'Your email address has been confirmed. You’re all set.'}
            </Text>
            <Button title="Continue" size="lg" style={styles.fullWidthButton} onPress={goNext} />
          </>
        )}

        {status === 'failed' && (
          <>
            <View style={[styles.iconRing, styles.iconRingError]}>
              <Icon name="xmark" size={24} weight="bold" tintColor={colors.light.semantic.error} />
            </View>
            <Text variant="h2" style={styles.headline}>
              Verification failed
            </Text>
            <Text style={styles.subtitle}>This link is invalid or has expired.</Text>
            <Button title="Back to sign in" variant="outline" size="lg" style={styles.fullWidthButton} onPress={goNext} />
          </>
        )}
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
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
    marginBottom: 8,
  },
  iconRingError: {
    borderColor: colors.light.semantic.errorBg,
    backgroundColor: colors.light.semantic.errorBg,
  },
  headline: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
})
