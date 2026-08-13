import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { SymbolView } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { PrayerActions, PrayerBackground, type PrayerContent } from './DailyPrayerCard'

interface PrayerStoryViewProps {
  prayer: PrayerContent
  onClose: () => void
}

export function PrayerStoryView({ prayer, onClose }: PrayerStoryViewProps) {
  return (
    <View style={styles.root}>
      <PrayerBackground />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={onClose}>
            <SymbolView name="xmark" size={16} tintColor={colors.light.neutral.white} />
          </Pressable>
          <Image
            source={require('@/assets/images/dang-logo-white.svg')}
            contentFit="contain"
            style={styles.logo}
          />
          <View style={styles.iconButton} />
        </View>

        <View style={styles.content}>
          <View>
            <Text style={styles.eyebrow}>DAILY PRAYER</Text>
            <Text style={styles.verseRef}>{prayer.verseRef}</Text>
            <Text style={styles.verse}>{prayer.verse}</Text>
          </View>
          <PrayerActions likeCount={prayer.likeCount} replyCount={prayer.replyCount} />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 64,
    height: 21,
  },
  content: {
    padding: 24,
    paddingBottom: 32,
    gap: 24,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  verseRef: {
    color: colors.light.neutral.white,
    fontSize: 19,
    fontWeight: '700',
    marginTop: 6,
  },
  verse: {
    color: colors.light.neutral.white,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '500',
    marginTop: 10,
  },
})
