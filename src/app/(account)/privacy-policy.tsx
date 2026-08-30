import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { DangFooter } from '@/components/account/DangFooter'
import { colors } from '@/theme/colors'

const SECTIONS = [
  {
    title: 'Data We Collect',
    body: 'Profile information, posts, engagement metrics, payment history, and usage data to improve your experience.',
  },
  {
    title: 'How We Use It',
    body: 'To power the Dang community platform, send relevant notifications, process payments via Paystack/Flutterwave, and comply with GDPR (UK) and NDPR (Nigeria).',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to access, correct, export, or permanently delete your data at any time from Settings → Export My Data.',
  },
  {
    title: 'Data Security',
    body: 'All member data is encrypted at rest and in transit using TLS 1.2+. Anonymous posts are cryptographically separated from your identity.',
  },
  {
    title: 'Contact',
    body: 'Data queries: privacy@dang.community · Registered in England & Wales and Nigeria.',
  },
]

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Policy
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={styles.heading}>Data Security</Text>
            <Text style={styles.subheading}>
              We&rsquo;re committed to protecting your personal information and being transparent about how we collect,
              use, and safeguard your data.
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Icon name="lock.shield.fill" size={36} tintColor={colors.light.primary[500]} />
          </View>
        </View>

        <View style={styles.docCard}>
          <View style={styles.docBadge}>
            <Icon name="doc.text.fill" size={18} tintColor={colors.light.neutral.white} />
          </View>
          <View style={styles.docText}>
            <Text style={styles.docTitle}>Privacy Policy</Text>
            <Text style={styles.docSubtitle}>Read the documentation below to familiarize with DANGS policy.</Text>
          </View>
        </View>

        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <DangFooter />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
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
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  heroText: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textMuted,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.light.primary[50],
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  docBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  docText: {
    flex: 1,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 2,
  },
  docSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textAlt,
  },
})
