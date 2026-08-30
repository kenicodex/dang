import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { addMonths, formatPlanDate, PAUSE_DURATIONS } from './billing.data'
import { useBillingStore } from '@/store'
import { colors } from '@/theme/colors'

interface PauseSubscriptionSheetProps {
  visible: boolean
  onClose: () => void
}

export function PauseSubscriptionSheet({ visible, onClose }: PauseSubscriptionSheetProps) {
  const pauseSubscription = useBillingStore(s => s.pauseSubscription)
  const [months, setMonths] = useState(1)
  const [confirmed, setConfirmed] = useState(false)

  const resumesAt = addMonths(new Date(), months)

  const handlePause = () => {
    pauseSubscription(months, resumesAt)
    setConfirmed(true)
  }

  const handleClose = () => {
    setConfirmed(false)
    onClose()
  }

  return (
    <Sheet visible={visible} onClose={handleClose} snapPoint={520}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {confirmed ? (
          <View style={styles.section}>
            <Text variant="h2" style={styles.title}>
              Subscription paused
            </Text>
            <Text style={styles.description}>
              Billing paused for {months} month{months > 1 ? 's' : ''}. Access continues through{' '}
              {formatPlanDate(resumesAt)}.
            </Text>

            <Button title="Done" onPress={handleClose} style={styles.primaryButton} />
            <Pressable style={styles.cancelLink} onPress={handleClose}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.section}>
            <Text variant="h2" style={styles.title}>
              Pause Subscription
            </Text>
            <Text style={styles.description}>Billing stops but you keep access for the rest of this period.</Text>

            <Text style={styles.label}>Pause duration</Text>
            <View style={styles.chipRow}>
              {PAUSE_DURATIONS.map(value => {
                const active = months === value
                return (
                  <Pressable
                    key={value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setMonths(value)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{value} mo</Text>
                  </Pressable>
                )
              })}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                Access continues until <Text style={styles.infoHighlight}>{formatPlanDate(resumesAt)}</Text>
              </Text>
              <Text style={styles.infoSubtitle}>Billing resumes automatically after {months} month{months > 1 ? 's' : ''}.</Text>
            </View>

            <Button
              title={`Pause for ${months} month${months > 1 ? 's' : ''}`}
              onPress={handlePause}
              style={styles.primaryButton}
            />
            <Pressable style={styles.cancelLink} onPress={handleClose}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 4,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textMuted,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.light.textSoft,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  chipActive: {
    borderColor: colors.light.primary[500],
    backgroundColor: colors.light.primary[50],
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.textAlt,
  },
  chipTextActive: {
    color: colors.light.primary[600],
  },
  infoBox: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  infoHighlight: {
    color: colors.light.primary[600],
  },
  infoSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 4,
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
})
