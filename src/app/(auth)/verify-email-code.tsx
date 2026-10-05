import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { OtpInput } from '@/components/flow/OtpInput'
import { NextFab } from '@/components/flow/NextFab'
import { ApiError } from '@/api/client'
import { useVerifyEmailMutation } from '@/api/hooks/auth.hooks'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'

const CODE_LENGTH = 6

export default function VerifyEmailCodeScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string; password?: string }>()
  const showToast = useUIStore(s => s.showToast)
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmailMutation()
  const [code, setCode] = useState('')

  const goNext = () => router.push({ pathname: '/(onboarding)/name', params })

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

        <Pressable onPress={goNext} style={styles.skip}>
          <Text style={styles.skipText}>Skip for now, verify later</Text>
        </Pressable>
      </View>

      <View style={styles.fabRow}>
        <NextFab onPress={handleVerify} disabled={code.length < CODE_LENGTH} loading={isPending} />
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
  skip: {
    marginTop: 24,
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
