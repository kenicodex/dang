import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { CURRENT_PLAN, PLAN_TIERS, PLAN_TIER_ORDER, PlanChangeSheet, formatNaira } from '@/components/account'
import type { PlanKey } from '@/components/account'
import { colors } from '@/theme/colors'

type BillingCycle = 'monthly' | 'yearly'

export default function ChangePlanScreen() {
  const router = useRouter()
  const [planKey, setPlanKey] = useState<PlanKey>('dangBoss')
  const [cycle, setCycle] = useState<BillingCycle>('yearly')
  const [sheetVisible, setSheetVisible] = useState(false)

  const plan = PLAN_TIERS[planKey]
  const yearly = Math.round(plan.monthly * 12 * 0.8)
  const yearlyMonthlyEquivalent = Math.round(yearly / 12)
  const amount = cycle === 'yearly' ? yearly : plan.monthly
  const isCurrentPlan = plan.label === CURRENT_PLAN.name

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h2" style={styles.title}>
          Choose your plan
        </Text>
        <Text style={styles.subtitle}>
          All plans include daily prayers, community access, and streaks. Upgrade anytime.
        </Text>

        <View style={styles.segmentTrack}>
          {PLAN_TIER_ORDER.map(key => {
            const isSelected = key === planKey
            return (
              <View key={key} style={styles.segmentItemWrapper}>
                {PLAN_TIERS[key].recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>recommended</Text>
                  </View>
                )}
                <Pressable
                  onPress={() => setPlanKey(key)}
                  style={[styles.segmentItem, isSelected && styles.segmentItemSelected]}
                >
                  <Text
                    style={[styles.segmentLabel, isSelected && styles.segmentLabelSelected]}
                    numberOfLines={1}
                  >
                    {PLAN_TIERS[key].label}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </View>

        <View style={styles.card}>
          <Text variant="h3">{plan.label}</Text>
          <Text style={styles.cardSubtitle}>Benefits</Text>
          <View style={styles.divider} />

          <View style={styles.featureList}>
            {plan.features.map(feature => (
              <View key={feature} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Icon name="checkmark" size={12} tintColor={colors.light.primary[600]} weight="bold" />
                </View>
                <Text style={styles.featureLabel}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.pricingRow}>
          <Pressable
            onPress={() => setCycle('monthly')}
            style={[styles.pricingCard, cycle === 'monthly' && styles.pricingCardSelected]}
          >
            <View style={styles.pricingHeader}>
              <Text style={styles.pricingLabel}>Monthly</Text>
              <View style={[styles.radio, cycle === 'monthly' && styles.radioSelected]}>
                {cycle === 'monthly' && <View style={styles.radioDot} />}
              </View>
            </View>
            <Text style={styles.pricingPrice}>{formatNaira(plan.monthly)}/mo</Text>
            <Text style={styles.pricingCaption}>Billed monthly</Text>
          </Pressable>

          <Pressable
            onPress={() => setCycle('yearly')}
            style={[styles.pricingCard, cycle === 'yearly' && styles.pricingCardSelected]}
          >
            <View style={styles.pricingHeader}>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save 20%</Text>
              </View>
              <View style={[styles.radio, cycle === 'yearly' && styles.radioSelected]}>
                {cycle === 'yearly' && <View style={styles.radioDot} />}
              </View>
            </View>
            <Text style={styles.pricingStrike}>{formatNaira(plan.monthly * 12)}</Text>
            <Text style={styles.pricingPrice}>{formatNaira(yearlyMonthlyEquivalent)}/mo</Text>
            <Text style={styles.pricingCaption}>
              {formatNaira(yearly)}/mo · Billed annually
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Continue with ${plan.label}`}
          size="lg"
          style={styles.cta}
          onPress={() => setSheetVisible(true)}
        />
        <Text style={styles.legal}>Cancel anytime. Plans auto-renew until cancelled.</Text>
      </View>

      <PlanChangeSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        plan={plan}
        cycle={cycle}
        amount={amount}
        isCurrentPlan={isCurrentPlan}
        onConfirmed={methodLabel =>
          router.push({
            pathname: '/(account)/change-plan-success',
            params: {
              planLabel: plan.label,
              amount: String(amount),
              cycle,
              methodLabel,
            },
          })
        }
      />
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: colors.light.neutral.surface,
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
  },
  segmentItemWrapper: {
    flex: 1,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    backgroundColor: colors.light.primary[500],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  segmentItem: {
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentItemSelected: {
    backgroundColor: colors.light.neutral.white,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
  segmentLabelSelected: {
    color: colors.light.text,
  },
  card: {
    backgroundColor: colors.light.neutral.white,
    borderRadius: 20,
    padding: 18,
  },
  cardSubtitle: {
    color: colors.light.textMuted,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 16,
  },
  featureList: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.light.text,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  pricingCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.light.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  pricingCardSelected: {
    borderColor: colors.light.primary[500],
    backgroundColor: colors.light.primary[50],
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricingLabel: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  saveBadge: {
    backgroundColor: colors.light.semantic.successBg,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.semantic.success,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  radioSelected: {
    borderColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.primary[500],
  },
  pricingStrike: {
    fontSize: 12,
    color: colors.light.textSoft,
    textDecorationLine: 'line-through',
    marginTop: 10,
  },
  pricingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 2,
  },
  pricingCaption: {
    fontSize: 11,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  cta: {
    borderRadius: 999,
  },
  legal: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.light.textSoft,
    marginTop: 10,
  },
})
