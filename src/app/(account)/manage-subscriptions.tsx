import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import {
  PauseSubscriptionSheet,
  CancelSubscriptionSheet,
  RemovePaymentSheet,
  ReceiptsBanner,
} from '@/components/account'
import { useBillingStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

interface ActionRow {
  key: string
  icon: SymbolViewProps['name']
  iconTint: string
  iconBg: string
  title: string
  titleColor?: string
  subtitle: string
  onPress: () => void
}

export default function ManageSubscriptionsScreen() {
  const router = useRouter()
  const status = useBillingStore(s => s.status)
  const cancelAtPeriodEnd = useBillingStore(s => s.cancelAtPeriodEnd)
  const resumeSubscription = useBillingStore(s => s.resumeSubscription)
  const keepSubscription = useBillingStore(s => s.keepSubscription)

  const [pauseVisible, setPauseVisible] = useState(false)
  const [cancelVisible, setCancelVisible] = useState(false)
  const [removeVisible, setRemoveVisible] = useState(false)

  const isPaused = status === 'paused'

  const rows: ActionRow[] = [
    isPaused
      ? {
          key: 'resume',
          icon: 'play.fill',
          iconTint: colors.light.primary[600],
          iconBg: colors.light.primary[100],
          title: 'Resume Subscription',
          subtitle: 'Restart billing now',
          onPress: resumeSubscription,
        }
      : {
          key: 'pause',
          icon: 'pause.fill',
          iconTint: colors.light.primary[600],
          iconBg: colors.light.primary[100],
          title: 'Pause Subscription',
          subtitle: 'Pause payment for a period',
          onPress: () => setPauseVisible(true),
        },
    cancelAtPeriodEnd
      ? {
          key: 'keep',
          icon: 'arrow.uturn.left',
          iconTint: colors.light.semantic.success,
          iconBg: colors.light.semantic.successBg,
          title: 'Keep My Subscription',
          subtitle: 'Undo the scheduled cancellation',
          onPress: keepSubscription,
        }
      : {
          key: 'cancel',
          icon: 'xmark',
          iconTint: colors.light.semantic.error,
          iconBg: colors.light.semantic.errorBg,
          title: 'Cancel Subscription',
          titleColor: colors.light.semantic.error,
          subtitle: 'Access continues until period ends',
          onPress: () => setCancelVisible(true),
        },
    {
      key: 'remove',
      icon: 'pause.fill',
      iconTint: colors.light.primary[600],
      iconBg: colors.light.primary[100],
      title: 'Remove payment plan',
      subtitle: 'Remove saved plan',
      onPress: () => setRemoveVisible(true),
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Manage subscriptions
        </Text>
        <Pressable style={styles.iconButton}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ReceiptsBanner />

        <View style={styles.rowList}>
          {rows.map(row => (
            <Pressable key={row.key} style={styles.row} onPress={row.onPress}>
              <View style={[styles.rowIcon, { backgroundColor: row.iconBg }]}>
                <Icon name={row.icon} size={16} tintColor={row.iconTint} />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, row.titleColor && { color: row.titleColor }]}>{row.title}</Text>
                <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
              </View>
              <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <PauseSubscriptionSheet visible={pauseVisible} onClose={() => setPauseVisible(false)} />
      <CancelSubscriptionSheet
        visible={cancelVisible}
        onClose={() => setCancelVisible(false)}
        onPauseInstead={() => {
          setCancelVisible(false)
          setPauseVisible(true)
        }}
      />
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
  rowList: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 14,
    ...shadows.sm,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  rowSubtitle: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
})
