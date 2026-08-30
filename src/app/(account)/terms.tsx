import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { colors } from '@/theme/colors'

const AGREEMENT_ITEMS = [
  'Provide accurate account information.',
  'Keep your login credentials secure.',
  'Respect other community members.',
  'Use DANG only for lawful purposes.',
  'Follow our Community Guidelines.',
]

const STANDARDS_ITEMS = [
  'Harass, bully, or threaten others.',
  'Share hateful, abusive, or discriminatory content.',
  'Post misleading or false information.',
  'Spam, advertise, or promote unauthorized products or services.',
  "Upload content that infringes on another person's rights.",
]

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map(item => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

export default function TermsScreen() {
  const [agreed, setAgreed] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <Text style={styles.titleCardHeading}>TERMS OF SERVICE</Text>
          <Text style={styles.titleCardSubtitle}>LAST UPDATE: AUGUST 2026</Text>
        </View>

        <View style={styles.body}>
          <TermsSection title="Welcome to DANG!">
            <Text style={styles.paragraph}>
              Hi 👋 By creating an account or using DANG, you agree to follow these Terms of Service. Our goal is to
              create a safe, supportive, and empowering community for women.
            </Text>
          </TermsSection>

          <TermsSection title="Using DANG">
            <Text style={styles.paragraph}>You agree to:</Text>
            <BulletList items={AGREEMENT_ITEMS} />
          </TermsSection>

          <TermsSection title="Community Standards">
            <Text style={styles.paragraph}>To maintain a positive environment, you must not:</Text>
            <BulletList items={STANDARDS_ITEMS} />
            <Text style={styles.paragraph}>
              Accounts that violate these standards may be suspended or permanently removed.
            </Text>
          </TermsSection>

          <TermsSection title="Your Content">
            <Text style={styles.paragraph}>
              You retain ownership of the content you post. By sharing content on DANG, you grant us permission to
              display, store, and distribute it within the platform to operate and improve our services.
            </Text>
          </TermsSection>

          <TermsSection title="Events & Learning">
            <Text style={styles.paragraph}>
              DANG offers virtual and in-person events, courses, and educational resources. Event schedules,
              speakers, and availability may change. Some events may be recorded for replay within the app.
            </Text>
          </TermsSection>

          <TermsSection title="Account Suspension">
            <Text style={styles.paragraph}>
              We may suspend or terminate accounts that violate these Terms, misuse the platform, or compromise the
              safety of our community.
            </Text>
          </TermsSection>

          <TermsSection title="Changes to these Terms">
            <Text style={styles.paragraph}>
              We may update these Terms from time to time. If significant changes are made, we will notify you
              through the app or by email.
            </Text>
          </TermsSection>

          <TermsSection title="Contact Us">
            <Text style={styles.paragraph}>
              If you have questions about these Terms, please contact our support team.{'\n'}Email: support@dang.com
            </Text>
          </TermsSection>

          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>Confirmation Checkbox</Text>
            <View style={styles.sectionDivider} />
            <Pressable style={styles.agreeRow} onPress={() => setAgreed(v => !v)}>
              <Checkbox checked={agreed} onChange={setAgreed} />
              <Text style={styles.agreeText}>I have read and agree to the Terms of Service.</Text>
            </Pressable>
          </View>

          <Button
            title="Continue"
            variant="outline"
            disabled={!agreed}
            style={styles.continueButton}
            onPress={() => router.back()}
          />

          <View style={styles.logoWrap}>
            <Image
              source={require('@/assets/images/dang-logo-white.svg')}
              contentFit="contain"
              style={styles.logo}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.primary[600],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleCard: {
    backgroundColor: colors.light.bg,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  titleCardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.light.primary[600],
  },
  titleCardSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.primary[400],
    marginTop: 2,
    letterSpacing: 0.5,
  },
  body: {
    borderRadius: 18,
    padding: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.neutral.white,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  bulletList: {
    gap: 4,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletDot: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.85)',
  },
  confirmSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  agreeText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  continueButton: {
    borderRadius: 999,
    backgroundColor: colors.light.neutral.white,
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  logo: {
    width: 100,
    height: 32,
  },
})
