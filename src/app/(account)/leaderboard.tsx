import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { LeaderboardRow, LEADERBOARD, YOUR_MEMBER_ID, TOTAL_MEMBERS } from '@/components/leaderboard'
import { colors } from '@/theme/colors'
import { useAuthStore } from '@/store/useAuthStore'

const PODIUM_ORDER = [
  { rank: 3, ringColor: '#F9D6DE' },
  { rank: 1, ringColor: '#F6F1B7' },
  { rank: 2, ringColor: '#CFF3E0' },
]

export default function LeaderboardScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const podium = LEADERBOARD.slice(0, 3)
  const yourRank = LEADERBOARD.findIndex(entry => entry.id === YOUR_MEMBER_ID) + 1

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.title}>
          Leaderboard
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.podiumSection}>
        <View style={styles.podiumTopRow}>
          {PODIUM_ORDER.map(({ rank, ringColor }) => {
            const entry = podium[rank - 1]
            if (!entry) return <View key={rank} style={styles.podiumSlot} />
            return (
              <View key={entry.id} style={styles.podiumSlot}>
                <View style={[styles.podiumAvatarRing, { backgroundColor: ringColor }]}>
                  <Avatar uri={entry.avatarUrl} initials={entry.displayName.slice(0, 2)} size="lg" />
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {entry.displayName.split(' ')[0]}
                </Text>
                <View style={styles.podiumPtsPill}>
                  <Text style={styles.podiumPtsText}>{entry.points} pts</Text>
                </View>
              </View>
            )
          })}
        </View>

        <View style={styles.podiumBlocks}>
          <View style={[styles.podiumBlock, styles.podiumBlockSide]}>
            <Text style={styles.podiumBlockNumber}>3</Text>
          </View>
          <View style={[styles.podiumBlock, styles.podiumBlockCenter]}>
            <Text style={styles.podiumBlockNumber}>1</Text>
          </View>
          <View style={[styles.podiumBlock, styles.podiumBlockSide]}>
            <Text style={styles.podiumBlockNumber}>2</Text>
          </View>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text variant="h3" style={styles.sheetTitle}>
          Leaderboard
        </Text>
        <View style={styles.positionPill}>
          <Text style={styles.positionPillText}>
            Your Position: {yourRank} / {TOTAL_MEMBERS}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {LEADERBOARD.map((entry, i) => (
            <LeaderboardRow key={entry.id} entry={entry} rank={i + 1} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.primary[50],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  podiumSection: {
    paddingTop: 24,
  },
  podiumTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  podiumSlot: {
    alignItems: 'center',
    width: 96,
    gap: 6,
  },
  podiumAvatarRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  podiumPtsPill: {
    backgroundColor: colors.light.neutral.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  podiumPtsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  podiumBlocks: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  podiumBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    height: 90,
  },
  podiumBlockSide: {
    backgroundColor: colors.light.primary[300],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 8,
    borderTopColor: colors.light.primary[200],
  },
  podiumBlockCenter: {
    backgroundColor: colors.light.primary[600],
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 10,
    borderTopColor: colors.light.primary[400],
    zIndex: 1,
  },
  podiumBlockNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.light.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    paddingTop: 24,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
  },
  positionPill: {
    marginTop: 10,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  positionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },
})
