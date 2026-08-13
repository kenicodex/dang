import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Event } from '@/types/events'

interface EventCardProps {
  event: Event
  onPress?: () => void
  onRSVP?: () => void
}

export function EventCard({ event, onPress, onRSVP }: EventCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{event.month}</Text>
          <Text style={styles.dateDay}>{event.day}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.tagRow}>
            {event.isVirtual && <Badge label="Virtual" tone="info" />}
            {event.type && <Badge label={event.type} tone="default" />}
          </View>
          <Text variant="h3" style={styles.title}>{event.title}</Text>
          <Text variant="caption" style={styles.time}>{event.time}</Text>
          <Text variant="caption" style={styles.location}>
            {event.isVirtual ? '🔗 In-Platform Room' : `📍 ${event.venue}`}
          </Text>
          <View style={styles.footer}>
            <Text variant="caption">
              👥 {event.attendeeCount || 0} going
            </Text>
            <Button
              title={event.rsvpStatus === 'yes' ? '✓ Going' : 'RSVP'}
              variant={event.rsvpStatus === 'yes' ? 'secondary' : 'primary'}
              size="sm"
              onPress={onRSVP}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  dateBox: {
    width: 72,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  dateMonth: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateDay: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  body: {
    flex: 1,
    padding: 14,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    marginBottom: 2,
  },
  location: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
