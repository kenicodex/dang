import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import {
  CURRENT_PLAN,
  SAVED_PAYMENT_METHOD,
  PAYMENT_HISTORY,
  RemovePaymentSheet,
  formatMoney,
  formatNaira,
  formatPlanDate,
} from '@/components/account'
import { useBillingStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

export default function BillingScreen() {
  const router = useRouter()
  const paymentMethodRemoved = useBillingStore(s => s.paymentMethodRemoved)
  const [removeVisible, setRemoveVisible] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Manage Billing
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="label" style={styles.sectionLabel}>
          Payment method
        </Text>
        {paymentMethodRemoved ? (
          <View style={styles.emptyMethodCard}>
            <Text style={styles.emptyMethodText}>No payment method saved.</Text>
          </View>
        ) : (
          <View style={styles.methodCard}>
            <View style={styles.methodRow}>
              <Text style={styles.methodProvider}>{SAVED_PAYMENT_METHOD.provider}</Text>
              <Badge label="Currently saved" tone="success" />
            </View>
            <Text style={styles.methodMeta}>
              •••• {SAVED_PAYMENT_METHOD.last4} · {CURRENT_PLAN.name} · {formatNaira(CURRENT_PLAN.monthlyPrice)}/mo
            </Text>
            <Pressable style={styles.removeLink} onPress={() => setRemoveVisible(true)}>
              <Text style={styles.removeLinkText}>Remove payment plan</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.historyHeaderRow}>
          <Text variant="label" style={styles.sectionLabelInline}>
            Payment history
          </Text>
          <Pressable onPress={() => router.push('/(account)/payment-history')} hitSlop={8}>
            <Text style={styles.viewAllLink}>View full history</Text>
          </Pressable>
        </View>
        <View style={styles.historyList}>
          {PAYMENT_HISTORY.slice(0, 3).map(item => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Icon name="receipt" size={16} tintColor={colors.light.primary[500]} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDescription}>{item.description}</Text>
                <Text style={styles.historyDate}>{formatPlanDate(item.date)}</Text>
              </View>
              <View style={styles.historyAmountWrap}>
                <Text style={styles.historyAmount}>{formatMoney(item.amount, item.currency)}</Text>
                <Badge label={item.status === 'paid' ? 'Paid' : 'Refunded'} tone={item.status === 'paid' ? 'success' : 'warning'} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <RemovePaymentSheet visible={removeVisible} onClose={() => setRemoveVisible(false)} />
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
  sectionLabel: {
    marginTop: 20,
    marginBottom: 12,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionLabelInline: {
    marginTop: 0,
    marginBottom: 0,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  methodCard: {
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.primary[100],
    borderRadius: 18,
    padding: 16,
    ...shadows.sm,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  methodProvider: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  methodMeta: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  removeLink: {
    marginTop: 12,
  },
  removeLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
  emptyMethodCard: {
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  emptyMethodText: {
    fontSize: 14,
    color: colors.light.textMuted,
  },
  historyList: {
    gap: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 14,
    ...shadows.sm,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  historyDate: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  historyAmountWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
})
