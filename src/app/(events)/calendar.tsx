import { useMemo, useState } from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { EVENTS, MOCK_NOW } from '@/components/events'
import { useEventsStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { Event } from '@/types/events'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function eventsOnDay(month: number, year: number, day: number) {
  return EVENTS.filter(e => {
    const eventMonth = MONTH_NAMES.findIndex(m => m.slice(0, 3).toUpperCase() === e.month)
    return eventMonth === month && year === MOCK_NOW.getFullYear() && parseInt(e.day, 10) === day
  })
}

export default function EventCalendarScreen() {
  const rsvpedEventIds = useEventsStore(s => s.rsvpedEventIds)
  const [viewDate, setViewDate] = useState(new Date(MOCK_NOW.getFullYear(), MOCK_NOW.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState(24)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const weeks = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    const rows: (number | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
    return rows
  }, [year, month])

  const dayStatus = (day: number) => {
    const dayEvents = eventsOnDay(month, year, day)
    const isRegistered = dayEvents.some(e => rsvpedEventIds.includes(e.id))
    const isPast = new Date(year, month, day) < new Date(MOCK_NOW.getFullYear(), MOCK_NOW.getMonth(), MOCK_NOW.getDate())
    if (isRegistered) return 'registered'
    if (dayEvents.length > 0) return 'available'
    if (isPast) return 'past'
    return 'none'
  }

  const selectedEvents = eventsOnDay(month, year, selectedDay)

  const changeMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1))
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.circleButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Event Calendar
        </Text>
        <View style={styles.circleButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.monthNav}>
          <Pressable style={styles.navButton} onPress={() => changeMonth(-1)}>
            <Icon name="chevron.left" size={16} tintColor={colors.light.text} />
          </Pressable>
          <Text variant="h3">
            {MONTH_NAMES[month]} {year}
          </Text>
          <Pressable style={styles.navButton} onPress={() => changeMonth(1)}>
            <Icon name="chevron.right" size={16} tintColor={colors.light.text} />
          </Pressable>
        </View>

        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((w, i) => (
            <Text key={i} style={styles.weekdayText}>
              {w}
            </Text>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((day, di) => {
              if (!day) return <View key={di} style={styles.dayCell} />
              const status = dayStatus(day)
              const isSelected = day === selectedDay
              return (
                <Pressable key={di} style={styles.dayCell} onPress={() => setSelectedDay(day)}>
                  <View
                    style={[
                      styles.dayCircle,
                      status === 'available' && styles.dayAvailable,
                      status === 'past' && styles.dayPast,
                      isSelected && styles.daySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        status === 'available' && styles.dayTextAvailable,
                        status === 'past' && styles.dayTextPast,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </View>
        ))}

        <View style={styles.legendRow}>
          <LegendDot color={colors.light.primary[500]} label="Registered" />
          <LegendDot color="#F7B98C" label="Available" />
          <LegendDot color={colors.light.semantic.error} label="Full" />
          <LegendDot color={colors.light.textSoft} label="Past" />
        </View>

        <Text variant="h3" style={styles.sectionTitle}>
          Events on {MONTH_NAMES[month]} {selectedDay}
        </Text>

        {selectedEvents.length > 0 ? (
          selectedEvents.map(event => <CalendarEventRow key={event.id} event={event} />)
        ) : (
          <View style={styles.emptyCard}>
            <Icon name="calendar" size={22} tintColor={colors.light.textSoft} />
            <Text style={styles.emptyText}>No Events on this Date</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  )
}

function CalendarEventRow({ event }: { event: Event }) {
  return (
    <Pressable style={styles.eventRow} onPress={() => router.push(`/(events)/${event.id}`)}>
      <Image source={{ uri: event.coverUrl }} style={styles.eventThumb} contentFit="cover" />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.eventMeta}>
          {event.startTime} · {event.durationLabel}
        </Text>
        <Text style={styles.eventType}>{event.isVirtual ? 'Virtual' : 'In Person'}</Text>
      </View>
      <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />
    </Pressable>
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
    paddingBottom: 40,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.textSoft,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayAvailable: {
    backgroundColor: 'rgba(247,185,140,0.35)',
  },
  dayPast: {
    backgroundColor: 'transparent',
  },
  daySelected: {
    backgroundColor: colors.light.primary[600],
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  dayTextAvailable: {
    color: '#C2661C',
    fontWeight: '700',
  },
  dayTextPast: {
    color: colors.light.textSoft,
  },
  dayTextSelected: {
    color: colors.light.neutral.white,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    ...shadows.sm,
  },
  eventThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  eventMeta: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  eventType: {
    fontSize: 12,
    color: colors.light.primary[500],
    fontWeight: '600',
    marginTop: 1,
  },
  emptyCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
})
