import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

export interface PrayerContent {
  verseRef: string
  verse: string
  likeCount: number
  replyCount: number
}

interface DailyPrayerCardProps {
  prayer: PrayerContent
}

export function DailyPrayerCard({ prayer }: DailyPrayerCardProps) {
  return (
    <View style={styles.card}>
      <PrayerBackground />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>DAILY PRAYER</Text>
        <Text style={styles.verseRef}>{prayer.verseRef}</Text>
        <Text style={styles.verse}>{prayer.verse}</Text>
        <PrayerActions likeCount={prayer.likeCount} replyCount={prayer.replyCount} />
      </View>
    </View>
  )
}

export function PrayerBackground() {
  return (
    <>
      <LinearGradient colors={['#2f3d33', '#141a15', '#0a0c0a']} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)']}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.65, y: 0.55 }}
        style={StyleSheet.absoluteFill}
      />
      <Icon name="leaf.fill" size={220} tintColor="rgba(255,255,255,0.06)" style={styles.leaf} />
      <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
    </>
  )
}

export function PrayerActions({ likeCount, replyCount }: { likeCount: number; replyCount: number }) {
  return (
    <View style={styles.actions}>
      <View style={styles.action}>
        <Icon name="heart" size={16} tintColor={colors.light.neutral.white} />
        <Text style={styles.actionText}>{likeCount}</Text>
      </View>
      <View style={styles.action}>
        <Icon name="bubble.left" size={16} tintColor={colors.light.neutral.white} />
        <Text style={styles.actionText}>{replyCount}</Text>
      </View>
      <View style={styles.action}>
        <Icon name="square.and.arrow.up" size={16} tintColor={colors.light.neutral.white} />
        <Text style={styles.actionText}>Share</Text>
      </View>
      <View style={styles.action}>
        <Icon name="ellipsis" size={16} tintColor={colors.light.neutral.white} />
        <Text style={styles.actionText}>More</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 260,
    justifyContent: 'flex-end',
  },
  leaf: {
    position: 'absolute',
    top: -30,
    right: -40,
  },
  content: {
    padding: 20,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  verseRef: {
    color: colors.light.neutral.white,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 6,
  },
  verse: {
    color: colors.light.neutral.white,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '500',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
  },
})
