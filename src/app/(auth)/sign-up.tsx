import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Icon } from '@/components/ui/Icon'
import { StyleSheet, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'

export default function SignUpScreen() {
  const router = useRouter()
  const loginWithApple = useAuthStore(s => s.loginWithApple)
  const showToast = useUIStore(s => s.showToast)

  const handleAppleSignIn = async () => {
    try {
      const nonce = Math.random().toString(36).slice(2)
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      })
      if (!credential.identityToken) throw new Error('Apple did not return an identity token.')
      const displayName = credential.fullName?.givenName
        ? `${credential.fullName.givenName} ${credential.fullName.familyName ?? ''}`.trim()
        : undefined
      await loginWithApple(credential.identityToken, nonce, displayName)
      router.replace('/home')
    } catch (err: any) {
      if (err?.code === 'ERR_REQUEST_CANCELED') return
      const message = err instanceof ApiError ? err.message : 'Apple sign-in failed. Please try again.'
      showToast(message, 'error')
    }
  }

  const handleGoogleSignIn = () => {
    showToast('Google sign-in is not configured yet.', 'info')
  }

  return (
    <FlowScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/dang-logo-black.svg')}
            contentFit="contain"
            style={styles.logo}
          />
          <Text style={styles.tagline}>
            a private community for women who are serious about faith, career, and growth
          </Text>
        </View>

        <View style={styles.hero}>
          <Text variant="h2" style={styles.headline}>Join the community</Text>
          <Text style={styles.heroSubtitle}>2,000+ women are already inside.</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Continue with email"
            variant="primary"
            size="lg"
            icon={<Icon name="envelope.fill" size={18} tintColor={colors.light.neutral.white} />}
            onPress={() => router.push('/(auth)/email')}
          />
          <Button
            title="Continue with phone"
            variant="outline"
            size="lg"
            icon={<Icon name="phone.fill" size={18} tintColor={colors.light.text} />}
            onPress={() => router.push('/(auth)/phone')}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Continue with Apple"
            variant="outline"
            size="lg"
            icon={<Icon name="apple.logo" size={18} tintColor={colors.light.text} />}
            onPress={handleAppleSignIn}
          />
          <Button
            title="Continue with Google"
            variant="outline"
            size="lg"
            icon={
              <Image
                source={require('@/assets/images/google-logo.svg')}
                style={styles.googleIcon}
                contentFit="contain"
              />
            }
            onPress={handleGoogleSignIn}
          />
        </View>

        <Text style={styles.legal}>
          By continuing, you agree to DANG&rsquo;s Terms of Service and Privacy Policy
        </Text>

        <Text style={styles.signInRow}>
          already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => router.push('/(auth)')}>
            sign in
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
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 84,
    height: 28,
    marginBottom: 16,
  },
  tagline: {
    textAlign: 'center',
    color: colors.light.textMuted,
    paddingHorizontal: 12,
  },
  hero: {
    alignItems: 'center',
    marginTop: 56,
    marginBottom: 32,
  },
  headline: {
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: 6,
    color: colors.light.textMuted,
  },
  actions: {
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light.border,
  },
  dividerText: {
    color: colors.light.textSoft,
    fontSize: 13,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  legal: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.light.textSoft,
    marginTop: 24,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  signInRow: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 'auto',
    marginBottom: 8,
  },
  signInLink: {
    color: colors.light.primary[500],
    fontWeight: '700',
  },
})
