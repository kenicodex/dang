import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { CURRENT_PLAN, formatNaira, formatPlanDate } from '@/components/account'
import { useBillingStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

export default function SubscriptionScreen() {
  const router = useRouter()
  const status = useBillingStore(s => s.status)
  const cancelAtPeriodEnd = useBillingStore(s => s.cancelAtPeriodEnd)
  const pausedUntil = useBillingStore(s => s.pausedUntil)
  const resumeSubscription = useBillingStore(s => s.resumeSubscription)

  const isPaused = status === 'paused'

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Subscription
        </Text>
        <Pressable style={styles.iconButton} onPress={() => router.push('/(account)/manage-subscriptions')}>
          <Icon name="ellipsis" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.light.primary[900], colors.light.secondary[700], colors.light.primary[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCard}
        >
          <View style={styles.planTopRow}>
            <View>
              <Text style={styles.planEyebrow}>CURRENT PLAN</Text>
              <Text style={styles.planName}>{CURRENT_PLAN.name}</Text>
            </View>
            <View style={styles.planPriceWrap}>
              <Text style={styles.planPrice}>{formatNaira(CURRENT_PLAN.monthlyPrice)}</Text>
              <Text style={styles.planPriceUnit}>/month</Text>
            </View>
          </View>

          <View style={styles.planDivider} />

          <View style={styles.planBottomRow}>
            <Text style={styles.planRenewal}>
              {isPaused && pausedUntil
                ? `Paused • resumes ${formatPlanDate(pausedUntil)}`
                : `${cancelAtPeriodEnd ? 'Cancels' : 'Next renewal'} • ${formatPlanDate(CURRENT_PLAN.renewalDate)}`}
            </Text>
            <Pressable
              style={styles.renewButton}
              onPress={isPaused ? resumeSubscription : () => router.push('/(account)/change-plan')}
              disabled={!isPaused && cancelAtPeriodEnd}
            >
              <Text style={styles.renewButtonText}>{isPaused ? 'Resume' : 'Renew'}</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <Text variant="label" style={styles.sectionLabel}>
          Included features
        </Text>
        <View style={styles.featureList}>
          {CURRENT_PLAN.features.map(feature => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureCheck}>
                <Icon name="checkmark" size={11} tintColor={colors.light.semantic.success} weight="bold" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => router.push('/(account)/change-plan')}>
          <LinearGradient
            colors={['#F6A93B', '#E8752C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeButtonText}>✨ Change Plan</Text>
          </LinearGradient>
        </Pressable>

        <Button
          title="Manage Billing"
          variant="outline"
          onPress={() => router.push('/(account)/billing')}
          style={styles.manageButton}
        />
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
    paddingBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  planCard: {
    borderRadius: 24,
    padding: 22,
    ...shadows.lg,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  planName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  planPriceWrap: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  planPriceUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  planDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 18,
  },
  planBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planRenewal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
  },
  renewButton: {
    backgroundColor: colors.light.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  renewButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  sectionLabel: {
    marginTop: 28,
    marginBottom: 12,
  },
  featureList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.semantic.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: colors.light.text,
    flex: 1,
  },
  upgradeButton: {
    marginTop: 28,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.sm,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  manageButton: {
    marginTop: 12,
    borderRadius: 999,
  },
})
