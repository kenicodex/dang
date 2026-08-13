import { StyleSheet, View } from 'react-native'
import { SymbolView } from 'expo-symbols'

import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

interface StreakCardProps {
  days: boolean[]
  todayIndex: number
  points?: number
}

export function StreakCard({ days, todayIndex, points = 15 }: StreakCardProps) {
  const streakCount = days.filter(Boolean).length

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <Text style={styles.emoji}>🔥</Text>
          <Text variant="h3">{streakCount} days</Text>
          <Text style={styles.label}>streak</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>+{points} pts</Text>
        </View>
      </View>
      <View style={styles.daysRow}>
        {WEEKDAYS.map((day, i) => (
          <View key={day} style={styles.day}>
            <Text style={styles.dayLabel}>{day}</Text>
            <View
              style={[
                styles.dot,
                days[i] && styles.dotDone,
                i === todayIndex && !days[i] && styles.dotToday,
              ]}
            >
              {days[i] ? (
                <SymbolView name="checkmark" size={13} tintColor={colors.light.neutral.white} weight="bold" />
              ) : (
                <Text style={styles.dotIndex}>{i + 1}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  label: {
    color: colors.light.textMuted,
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
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    color: colors.light.textMuted,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.light.primary[500],
    borderColor: colors.light.primary[500],
  },
  dotToday: {
    borderColor: colors.light.primary[500],
  },
  dotIndex: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.textMuted,
  },
})
