import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { colors } from '@/theme/colors'
import type { Space } from '@/api/services/spaces.service'
import { CATEGORY_STYLE } from './spaces.data'

function formatMemberCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

interface SpaceCardProps {
  space: Space
  newCount?: number
  onPress?: () => void
}

export function SpaceCard({ space, newCount, onPress }: SpaceCardProps) {
  const style = CATEGORY_STYLE[space.category ?? ''] ?? {
    gradient: [colors.light.primary[300], colors.light.primary[700]] as [string, string],
    emoji: space.emoji ?? '💬',
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {space.coverImageUrl ? (
        <Image source={{ uri: space.coverImageUrl }} style={styles.thumb} contentFit="cover" />
      ) : (
        <LinearGradient colors={style.gradient} style={styles.thumb}>
          <Text style={styles.thumbEmoji}>{style.emoji}</Text>
        </LinearGradient>
      )}

      <View style={styles.info}>
        <Text variant="h3" style={styles.name}>
          {space.name}
        </Text>
        <Text style={styles.members}>{formatMemberCount(space.memberCount)} members</Text>
        <Text style={styles.category}>{space.category}</Text>

        <View style={styles.avatarRow}>
          {(space.memberAvatars ?? []).slice(0, 4).map((initials, i) => (
            <View key={initials + i} style={[styles.avatarWrap, i > 0 && styles.avatarOverlap]}>
              <Avatar initials={initials} size="xs" />
            </View>
          ))}
        </View>
      </View>

      {!!newCount && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>{newCount} NEW</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  thumb: {
    width: 88,
    height: 108,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.surfaceAlt,
  },
  thumbEmoji: {
    fontSize: 30,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  name: {
    fontSize: 18,
  },
  members: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  category: {
    fontSize: 13,
    color: colors.light.textSoft,
    marginBottom: 6,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatarWrap: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.light.surface,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.light.primary[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.primary[700],
  },
})
