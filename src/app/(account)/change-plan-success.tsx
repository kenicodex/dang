import { useLocalSearchParams, useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { CURRENT_PLAN, formatNaira, formatPlanDate } from '@/components/account'
import { useAuthStore } from '@/store'
import { colors } from '@/theme/colors'

export default function ChangePlanSuccessScreen() {
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const { planLabel, amount, cycle, methodLabel } = useLocalSearchParams<{
    planLabel: string
    amount: string
    cycle: string
    methodLabel: string
  }>()

  const isRenewal = planLabel === CURRENT_PLAN.name

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={[styles.dot, styles.dotTopLeft]} />
          <View style={[styles.dot, styles.dotBottomRight]} />
          <Icon name="plus" size={12} tintColor={colors.light.primary[300]} style={styles.crossTopRight} />
          <Icon name="plus" size={10} tintColor={colors.light.primary[300]} style={styles.crossBottomLeft} />

          <View style={styles.badge}>
            <Icon name="checkmark" size={36} tintColor={colors.light.primary[600]} weight="bold" />
          </View>
        </View>

        <Text variant="h2" style={styles.title}>
          {isRenewal ? 'Plan renewed!' : 'Plan changed!'}
        </Text>
        <Text style={styles.subtitle}>
          Billing confirmed via {methodLabel}.{' '}
          <Text style={styles.subtitleStrong}>
            Next renewal: {formatPlanDate(CURRENT_PLAN.renewalDate)}.
          </Text>
        </Text>

        <View style={styles.receiptCard}>
          <Text style={styles.receiptText}>
            Receipt sent to <Text style={styles.receiptEmail}>{user?.email ?? 'amara@email.com'}</Text>
          </Text>
        </View>

        {!!amount && (
          <Text style={styles.amountText}>
            {planLabel} · {formatNaira(Number(amount))}/{cycle === 'yearly' ? 'yr' : 'mo'}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <LinearGradient
          colors={[colors.light.primary[500], colors.light.primary[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.doneGradient}
        >
          <Button
            title="Done"
            onPress={() => router.replace('/(account)/subscription')}
            style={styles.doneButton}
          />
        </LinearGradient>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 20,
    marginTop: 8,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustration: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.light.primary[100],
    borderWidth: 2,
    borderColor: colors.light.primary[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.primary[200],
  },
  dotTopLeft: {
    top: 12,
    left: 20,
  },
  dotBottomRight: {
    bottom: 20,
    right: 10,
  },
  crossTopRight: {
    position: 'absolute',
    top: 20,
    right: 16,
  },
  crossBottomLeft: {
    position: 'absolute',
    bottom: 30,
    left: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textMuted,
    marginBottom: 20,
  },
  subtitleStrong: {
    fontWeight: '700',
    color: colors.light.textAlt,
  },
  receiptCard: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  receiptText: {
    fontSize: 13,
    color: colors.light.textAlt,
  },
  receiptEmail: {
    fontWeight: '700',
    color: colors.light.text,
  },
  amountText: {
    marginTop: 16,
    fontSize: 13,
    color: colors.light.textSoft,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  doneGradient: {
    borderRadius: 999,
  },
  doneButton: {
    backgroundColor: 'transparent',
    borderRadius: 999,
  },
})
