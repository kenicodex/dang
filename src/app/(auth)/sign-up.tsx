import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { colors } from '@/theme/colors'

export default function SignUpScreen() {
  const router = useRouter()

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
            icon={<SymbolView name="envelope.fill" size={18} tintColor={colors.light.neutral.white} />}
            onPress={() => router.push('/(auth)/email')}
          />
          <Button
            title="Continue with phone"
            variant="outline"
            size="lg"
            icon={<SymbolView name="phone.fill" size={18} tintColor={colors.light.text} />}
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
            icon={<SymbolView name="apple.logo" size={18} tintColor={colors.light.text} />}
            onPress={() => {}}
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
            onPress={() => {}}
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
