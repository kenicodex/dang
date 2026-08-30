import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { LeaderboardEntry } from './leaderboard.data'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  rank: number
}

const RANK_STYLE: Record<number, { gradient: [string, string]; ring: string; medal: string }> = {
  1: { gradient: ['#D9A94F', '#8A661F'], ring: '#F2C86B', medal: '🥇' },
  2: { gradient: ['#6B7684', '#374151'], ring: '#C7CDD6', medal: '🥈' },
  3: { gradient: ['#2E7C7A', '#1D3E56'], ring: '#5FBFB4', medal: '🥉' },
}

const DEFAULT_STYLE = { gradient: ['#6B7280', '#4B5563'] as [string, string], ring: '#9CA3AF' }

export function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  const style = RANK_STYLE[rank] ?? DEFAULT_STYLE

  return (
    <LinearGradient
      colors={style.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.row}
    >
      <View style={[styles.avatarRing, { borderColor: style.ring }]}>
        <Avatar uri={entry.avatarUrl} initials={entry.displayName.slice(0, 2)} size="md" />
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>{entry.points}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.displayName}
        </Text>
        <Text style={styles.dang}>Dang: {entry.points}</Text>
      </View>

      {'medal' in style ? (
        <Text style={styles.medal}>{style.medal}</Text>
      ) : (
        <Text style={styles.rankText}>{ordinal(rank)}</Text>
      )}
    </LinearGradient>
  )
}

function ordinal(n: number) {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' }
  return `${n}${suffixes[n % 10] ?? 'th'}`
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 10,
  },
  avatarRing: {
    borderWidth: 2,
    borderRadius: 999,
    padding: 2,
  },
  pointsBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.light.neutral.white,
    backgroundColor: colors.light.semantic.success,
  },
  pointsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  dang: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  medal: {
    fontSize: 22,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
  },
})
