import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { colors } from '@/theme/colors'

const FIELDS = [
  { key: 'tech', label: 'Tech', emoji: '💻' },
  { key: 'finance', label: 'Finance', emoji: '📊' },
  { key: 'creative', label: 'Creative', emoji: '🎨' },
  { key: 'media', label: 'Media', emoji: '📱' },
  { key: 'health', label: 'Health', emoji: '💊' },
  { key: 'education', label: 'Education', emoji: '📚' },
  { key: 'law', label: 'Law', emoji: '⚖️' },
  { key: 'real_estate', label: 'Real Estate', emoji: '🏠' },
  { key: 'retail', label: 'Retail', emoji: '🛍️' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'food', label: 'Food', emoji: '🍽️' },
  { key: 'other', label: 'Other', emoji: '📎' },
]

export default function FieldStepScreen() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  const goNext = () => router.push('/(onboarding)/faith')

  return (
    <FlowScreen>
      <StepHeader
        onBack={() => router.back()}
        progress={4 / 5}
        rightSlot={
          <Pressable onPress={goNext}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        }
      />

      <View style={styles.container}>
        <Text style={styles.emoji}>💼</Text>
        <Text variant="h2">What&rsquo;s your world?</Text>
        <Text style={styles.subtitle}>
          Pick the field closest to what you do. We&rsquo;ll match you with women building in the
          same space.
        </Text>

        <View style={styles.grid}>
          {FIELDS.map((field) => {
            const isSelected = selected === field.key
            return (
              <Pressable
                key={field.key}
                onPress={() => setSelected(field.key)}
                style={[styles.pill, isSelected && styles.pillSelected]}
              >
                <Text style={styles.pillEmoji}>{field.emoji}</Text>
                <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                  {field.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View style={styles.fabRow}>
        <NextFab onPress={goNext} />
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  skip: {
    color: colors.light.textMuted,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  pillSelected: {
    backgroundColor: colors.light.primary[50],
    borderColor: colors.light.primary[500],
  },
  pillEmoji: {
    fontSize: 16,
  },
  pillLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  pillLabelSelected: {
    color: colors.light.primary[500],
  },
  fabRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
})
