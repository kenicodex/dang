import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { colors } from '@/theme/colors'

const FIRST_NAME = 'Amara'
const MEMBERSHIP_LABEL = 'Growth Member'

const NEXT_STEPS = [
  {
    key: 'prayer',
    emoji: '📖',
    title: 'Read today’s prayer',
    subtitle: 'Your daily faith post is waiting for you',
    recommended: true,
  },
  {
    key: 'space',
    emoji: '👥',
    title: 'Join your first Space',
    subtitle: 'Pick a topic and say hello',
  },
  {
    key: 'sisters',
    emoji: '☕',
    title: 'Find sisters near you',
    subtitle: 'See who shares your city and more',
  },
]

export default function WelcomeStepScreen() {
  const router = useRouter()

  const goHome = () => router.replace('/(tabs)/home')

  return (
    <FlowScreen>
      <StepHeader
        rightSlot={
          <Pressable onPress={goHome}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        }
      />

      <View style={styles.container}>
        <Text style={styles.sparkles}>✨ 💜 🎉 ✨</Text>

        <View style={styles.avatarArea}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{FIRST_NAME.charAt(0)}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Icon name="checkmark" size={12} tintColor={colors.light.neutral.white} weight="bold" />
          </View>
        </View>

        <Text style={styles.welcomeText}>
          welcome,{'\n'}
          <Text style={styles.welcomeName}>{FIRST_NAME}</Text>
        </Text>
        <Text style={styles.subtitle}>
          You&rsquo;re officially in. Your sisters are waiting, and your first prayer is already
          live
        </Text>

        <View style={styles.membershipBadge}>
          <Text style={styles.membershipEmoji}>✨</Text>
          <Text style={styles.membershipText}>{MEMBERSHIP_LABEL}</Text>
        </View>

        <Text variant="label" style={styles.sectionLabel}>
          Start with one of these
        </Text>

        <View style={styles.list}>
          {NEXT_STEPS.map((step) => (
            <Pressable key={step.key} style={styles.row}>
              <View style={styles.rowIcon}>
                <Text style={styles.rowEmoji}>{step.emoji}</Text>
              </View>
              <View style={styles.rowText}>
                <View style={styles.rowTitleLine}>
                  <Text style={styles.rowTitle}>{step.title}</Text>
                  {step.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>recommended</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.rowSubtitle}>{step.subtitle}</Text>
              </View>
              <Icon name="chevron.right" size={16} tintColor={colors.light.textSoft} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Continue to home" size="lg" style={styles.cta} onPress={goHome} />
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skip: {
    color: colors.light.primary[500],
    fontWeight: '600',
  },
  sparkles: {
    fontSize: 20,
    letterSpacing: 10,
    marginBottom: 16,
  },
  avatarArea: {
    width: 96,
    height: 96,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.light.secondary[400],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.light.primary[200],
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  verifiedBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.light.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.light.bg,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 32,
  },
  welcomeName: {
    color: colors.light.primary[500],
  },
  subtitle: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.light.primary[50],
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 16,
  },
  membershipEmoji: {
    fontSize: 13,
  },
  membershipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    marginTop: 32,
    marginBottom: 12,
  },
  list: {
    alignSelf: 'stretch',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.light.neutral.white,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowEmoji: {
    fontSize: 18,
  },
  rowText: {
    flex: 1,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  recommendedBadge: {
    backgroundColor: colors.light.primary[100],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primary[700],
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
  },
  cta: {
    borderRadius: 999,
  },
})
