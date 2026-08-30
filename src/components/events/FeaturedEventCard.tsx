import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { Event } from '@/types/events'

interface FeaturedEventCardProps {
  event: Event
  onPress?: () => void
  style?: object
}

export function FeaturedEventCard({ event, onPress, style }: FeaturedEventCardProps) {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: event.coverUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        {event.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{event.category}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.date}>
          {event.date} · {event.time}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageWrap: {
    height: 100,
  },
  badge: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
})
