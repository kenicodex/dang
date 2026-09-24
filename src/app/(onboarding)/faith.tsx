import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { colors } from '@/theme/colors'

type Faith = 'christian' | 'muslim'
type FaithStepParams = {
  email?: string
  password?: string
  name?: string
  city?: string
  industry?: string
}

const OPTIONS: { key: Faith; emoji: string; title: string; description: string }[] = [
  {
    key: 'christian',
    emoji: '✝️',
    title: 'Christian',
    description: 'Bible verses, guided prayers, and daily devotionals',
  },
  {
    key: 'muslim',
    emoji: '☪️',
    title: 'Muslim',
    description: 'Quranic verses, daily prayers, and spiritual reflections',
  },
]

export default function FaithStepScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<FaithStepParams>()
  const [selected, setSelected] = useState<Faith | null>(null)

  const goNext = () =>
    router.push({
      pathname: '/(onboarding)/plan',
      params: { ...params, faithTradition: selected ?? undefined },
    })

  return (
    <FlowScreen>
      <StepHeader
        onBack={() => router.back()}
        progress={5 / 5}
        rightSlot={
          <Pressable onPress={goNext}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        }
      />

      <View style={styles.container}>
        <Text style={styles.emoji}>🙏</Text>
        <Text variant="h2">How do you pray?</Text>
        <Text style={styles.subtitle}>
          This helps us personalise your daily prayer and devotional content.
        </Text>

        <View style={styles.list}>
          {OPTIONS.map((option) => {
            const isSelected = selected === option.key
            return (
              <Pressable
                key={option.key}
                onPress={() => setSelected(option.key)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <View style={styles.iconSquare}>
                  <Text style={styles.iconEmoji}>{option.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {option.title}
                  </Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <FooterNote icon="arrow.triangle.2.circlepath">
          You can change this anytime in settings
        </FooterNote>
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
  list: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  cardSelected: {
    backgroundColor: colors.light.primary[50],
    borderColor: colors.light.primary[500],
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  cardTitleSelected: {
    color: colors.light.primary[500],
  },
  cardDescription: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.light.primary[500],
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.light.primary[500],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
})
