import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { CANCELLATION_LOSSES, CURRENT_PLAN, formatPlanDate } from './billing.data'
import { useBillingStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'

interface CancelSubscriptionSheetProps {
  visible: boolean
  onClose: () => void
  onPauseInstead: () => void
}

export function CancelSubscriptionSheet({ visible, onClose, onPauseInstead }: CancelSubscriptionSheetProps) {
  const cancelSubscription = useBillingStore(s => s.cancelSubscription)
  const showToast = useUIStore(s => s.showToast)

  const confirmCancellation = () => {
    cancelSubscription()
    onClose()
    showToast(`Your subscription will cancel on ${formatPlanDate(CURRENT_PLAN.renewalDate)}.`, 'info')
  }

  return (
    <Sheet visible={visible} onClose={onClose} snapPoint={560}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.title}>
          Cancel Subscription?
        </Text>
        <Text style={styles.description}>
          You&rsquo;ll keep {CURRENT_PLAN.name} access until {formatPlanDate(CURRENT_PLAN.renewalDate)}. After that
          you&rsquo;ll move to Essential (free tier).
        </Text>

        <View style={styles.lossCard}>
          <Text style={styles.lossTitle}>You&rsquo;ll lose access to:</Text>
          {CANCELLATION_LOSSES.map(item => (
            <View key={item} style={styles.lossRow}>
              <Icon name="xmark" size={12} tintColor={colors.light.semantic.error} weight="bold" />
              <Text style={styles.lossText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.hint}>Instead of cancelling, you can pause your subscription for 1—3 months.</Text>

        <Button title="Pause Instead" onPress={onPauseInstead} style={styles.pauseButton} textStyle={styles.pauseButtonText} />
        <Button title="Confirm Cancellation" onPress={confirmCancellation} style={styles.cancelButton} textStyle={styles.cancelButtonText} />

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
  lossCard: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  lossTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 2,
  },
  lossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lossText: {
    fontSize: 14,
    color: colors.light.semantic.error,
  },
  hint: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginBottom: 20,
  },
  pauseButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[50],
    marginBottom: 10,
  },
  pauseButtonText: {
    color: colors.light.primary[600],
  },
  cancelButton: {
    borderRadius: 999,
    backgroundColor: colors.light.semantic.errorBg,
  },
  cancelButtonText: {
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
