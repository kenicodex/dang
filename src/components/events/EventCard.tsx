import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import { seatsUrgent } from './events.data'
import type { Event } from '@/types/events'

interface EventCardProps {
  event: Event
  saved?: boolean
  onPress?: () => void
  onToggleSave?: () => void
  onRSVP?: () => void
}

export function EventCard({ event, saved, onPress, onToggleSave, onRSVP }: EventCardProps) {
  const urgent = seatsUrgent(event)

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: event.coverUrl }} style={styles.image} contentFit="cover" />

        <View style={styles.topRow}>
          <View style={styles.badgeRow}>
            {event.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{event.category}</Text>
              </View>
            )}
            {event.isVirtual && (
              <View style={styles.virtualBadge}>
                <Icon name="video.fill" size={11} tintColor={colors.light.neutral.white} />
                <Text style={styles.virtualBadgeText}>Virtual</Text>
              </View>
            )}
          </View>
          <Pressable style={styles.saveButton} onPress={onToggleSave} hitSlop={8}>
            <Icon
              name={saved ? 'bookmark.fill' : 'bookmark'}
              size={14}
              tintColor={colors.light.neutral.white}
            />
          </Pressable>
        </View>

        {event.seatsRemaining != null && (
          <View style={styles.seatsRow}>
            <View style={[styles.seatsDot, { backgroundColor: urgent ? '#F87171' : '#34D399' }]} />
            <Text style={styles.seatsText}>{event.seatsRemaining} seats left</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Icon name="calendar" size={13} tintColor={colors.light.primary[500]} />
          <Text style={styles.metaText}>
            {event.date} · {event.time}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="mappin" size={13} tintColor={colors.light.primary[500]} />
          <Text style={styles.metaText}>{event.isVirtual ? 'Virtual' : event.venue}</Text>
        </View>
        {event.host && (
          <View style={styles.metaRow}>
            <Icon name="person.2" size={13} tintColor={colors.light.primary[500]} />
            <Text style={styles.metaText}>{event.host}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.price, event.priceLabel === 'Free' && styles.priceFree]}>
            {event.priceLabel ?? 'Free'}
          </Text>
          <Button title="RSVP" size="sm" onPress={onRSVP} style={styles.rsvpButton} />
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.sm,
  },
  imageWrap: {
    height: 170,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  virtualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.light.primary[500],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  virtualBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  saveButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatsRow: {
    position: 'absolute',
    left: 12,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatsDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  seatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.light.text,
  },
  priceFree: {
    color: colors.light.semantic.success,
  },
  rsvpButton: {
    borderRadius: 999,
    paddingHorizontal: 20,
  },
})
