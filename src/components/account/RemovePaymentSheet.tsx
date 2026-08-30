import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { Badge } from '@/components/ui/Badge'
import { CURRENT_PLAN, SAVED_PAYMENT_METHOD, formatNaira, formatPlanDate } from './billing.data'
import { useBillingStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'

interface RemovePaymentSheetProps {
  visible: boolean
  onClose: () => void
}

export function RemovePaymentSheet({ visible, onClose }: RemovePaymentSheetProps) {
  const removePaymentMethod = useBillingStore(s => s.removePaymentMethod)
  const showToast = useUIStore(s => s.showToast)

  const confirmRemoval = () => {
    removePaymentMethod()
    onClose()
    showToast('Payment plan removed.', 'info')
  }

  return (
    <Sheet visible={visible} onClose={onClose} snapPoint={520}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.title}>
          Remove Payment Plan
        </Text>
        <Text style={styles.description}>
          This removes your saved recurring payment plan. Your subscription remains active until{' '}
          {formatPlanDate(CURRENT_PLAN.renewalDate)}.
        </Text>

        <View style={styles.methodCard}>
          <View style={styles.methodRow}>
            <Text style={styles.methodProvider}>{SAVED_PAYMENT_METHOD.provider}</Text>
            <Badge label="Currently saved" tone="success" />
          </View>
          <Text style={styles.methodMeta}>
            •••• {SAVED_PAYMENT_METHOD.last4} · {CURRENT_PLAN.name} · {formatNaira(CURRENT_PLAN.monthlyPrice)}/mo
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Icon name="exclamationmark.circle" size={16} tintColor={colors.light.semantic.warning} />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Warning</Text>
            <Text style={styles.warningBody}>Your subscription will not renew automatically after removal.</Text>
          </View>
        </View>

        <Button title="Confirm Removal" onPress={confirmRemoval} style={styles.removeButton} textStyle={styles.removeButtonText} />

        <Pressable style={styles.keepLink} onPress={onClose}>
          <Text style={styles.keepLinkText}>Keep my subscription</Text>
        </Pressable>
      </ScrollView>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textMuted,
    marginBottom: 20,
  },
  methodCard: {
    borderWidth: 1.5,
    borderColor: colors.light.primary[500],
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  warningBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.light.semantic.warningBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 2,
  },
  warningBody: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.light.textAlt,
  },
  removeButton: {
    borderRadius: 999,
    backgroundColor: colors.light.semantic.errorBg,
  },
  removeButtonText: {
    color: colors.light.semantic.error,
  },
  keepLink: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  keepLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
})
