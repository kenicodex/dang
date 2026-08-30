import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { MOODS, type MoodKey } from './moods'

interface MoodCheckInProps {
  points?: number
  onCheckIn?: (mood: MoodKey) => void
}

export function MoodCheckIn({ points = 5, onCheckIn }: MoodCheckInProps) {
  const [selected, setSelected] = useState<MoodKey | null>(null)

  const handleSelect = (mood: MoodKey) => {
    setSelected(mood)
    onCheckIn?.(mood)
  }

  if (selected) {
    const mood = MOODS.find(m => m.key === selected)!
    return (
      <Card style={styles.card}>
        <View style={styles.confirmedRow}>
          <View style={styles.leftRow}>
            <Icon name="checkmark.circle.fill" size={20} tintColor={colors.light.tertiary[600]} />
            <Text style={styles.confirmedText}>checked in today</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsBadgeText}>+{points} points</Text>
          </View>
        </View>
        <Text style={styles.confirmedEmoji}>{mood.emoji}</Text>
        <Text style={styles.confirmedHint}>{mood.message}</Text>
      </Card>
    )
  }

  return (
    <Card style={styles.card}>
      <Text variant="h3" style={styles.title}>
        How are you feeling today?
      </Text>
      <View style={styles.optionsRow}>
        {MOODS.map(mood => (
          <Pressable
            key={mood.key}
            style={styles.option}
            onPress={() => handleSelect(mood.key)}
            hitSlop={6}
          >
            <Text style={styles.optionEmoji}>{mood.emoji}</Text>
            <Text style={styles.optionLabel}>{mood.label}</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    gap: 6,
  },
  optionEmoji: {
    fontSize: 30,
    lineHeight: 36,
  },
  optionLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmedText: {
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  pointsBadge: {
    backgroundColor: colors.light.tertiary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pointsBadgeText: {
    color: colors.light.tertiary[600],
    fontSize: 12,
    fontWeight: '700',
  },
  confirmedEmoji: {
    fontSize: 40,
    lineHeight: 48,
    marginTop: 16,
  },
  confirmedHint: {
    color: colors.light.primary[500],
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
})
