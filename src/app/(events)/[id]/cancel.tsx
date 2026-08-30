import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { getEventById } from '@/components/events'
import { useEventsStore } from '@/store'
import { colors } from '@/theme/colors'

const REASONS = [
  'Schedule conflict',
  "Can't attend in person",
  'Found a better event',
  'Personal emergency',
  'Other',
]

export default function CancelRSVPScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const event = getEventById(id)
  const cancelRsvp = useEventsStore(s => s.cancelRsvp)
  const [reason, setReason] = useState<string | null>(null)

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Event not found.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.circleButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Cancel RSVP
        </Text>
        <View style={styles.circleButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBanner}>
          <Icon name="info.circle.fill" size={18} tintColor={colors.light.semantic.error} />
          <View style={styles.warningTextWrap}>
            <Text style={styles.warningTitle}>Are you sure?</Text>
            <Text style={styles.warningBody}>This will cancel your registration for {event.title}</Text>
          </View>
        </View>

        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Reason for Cancelling</Text>
          {REASONS.map(r => {
            const selected = reason === r
            return (
              <Pressable key={r} style={styles.reasonRow} onPress={() => setReason(r)}>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.reasonLabel}>{r}</Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Keep Registration" variant="outline" style={styles.keepButton} onPress={() => router.back()} />
        <Button
          title="✕ Confirm Cancel"
          disabled={!reason}
          onPress={() => {
            cancelRsvp(event.id, reason ?? 'Other')
            router.replace('/(events)')
          }}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
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
  circleButton: {
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
    paddingBottom: 20,
  },
  warningBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.light.semantic.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  warningTextWrap: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.semantic.error,
    marginBottom: 2,
  },
  warningBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.text,
  },
  reasonCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 16,
  },
  reasonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 14,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.light.primary[500],
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.light.primary[500],
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  keepButton: {
    flex: 1,
    borderRadius: 999,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: colors.light.semantic.error,
  },
  cancelButtonText: {
    color: colors.light.neutral.white,
  },
})
