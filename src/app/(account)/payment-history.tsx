import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PAYMENT_HISTORY, ReceiptsBanner, formatMoney, formatPlanDate, type PaymentHistoryItem } from '@/components/account'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

export default function PaymentHistoryScreen() {
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)
  const [expandedId, setExpandedId] = useState<string | null>(PAYMENT_HISTORY[0]?.id ?? null)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Payment History
        </Text>
        <Pressable style={styles.iconButton}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ReceiptsBanner />

        <View style={styles.list}>
          {PAYMENT_HISTORY.map(item => (
            <HistoryCard
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId(prev => (prev === item.id ? null : item.id))}
              onDownload={() => showToast('Receipt downloaded.', 'success')}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function HistoryCard({
  item,
  expanded,
  onToggle,
  onDownload,
}: {
  item: PaymentHistoryItem
  expanded: boolean
  onToggle: () => void
  onDownload: () => void
}) {
  return (
    <Pressable style={styles.card} onPress={onToggle}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <Text style={styles.cardDate}>
            {formatPlanDate(item.date)} · {item.processor}
          </Text>
        </View>
        <View style={styles.cardAmountWrap}>
          <Text style={styles.cardAmount}>{formatMoney(item.amount, item.currency)}</Text>
          <Badge label={item.status === 'paid' ? 'Paid' : 'Refunded'} tone={item.status === 'paid' ? 'success' : 'warning'} />
        </View>
      </View>

      {expanded && (
        <View style={styles.details}>
          <View style={styles.divider} />
          <DetailRow label="Transaction ID" value={item.transactionId} />
          <DetailRow label="Payment Method" value={item.paymentMethodLabel} />
          <DetailRow label="Processor" value={item.processor} />
          <DetailRow label="Amount" value={formatMoney(item.amount, item.currency)} />
          <DetailRow label="Status" value={item.status === 'paid' ? 'Paid' : 'Refunded'} />

          <Button
            title="Download Receipt"
            variant="outline"
            onPress={onDownload}
            style={styles.downloadButton}
          />
        </View>
      )}
    </Pressable>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 16,
    ...shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardDescription: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  cardDate: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  cardAmountWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    textDecorationLine: 'line-through',
    textDecorationColor: colors.light.textSoft,
  },
  details: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.text,
  },
  downloadButton: {
    borderRadius: 999,
    marginTop: 6,
  },
})
