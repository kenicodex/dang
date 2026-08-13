import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import {
  DailyPrayerCard,
  MoodCheckIn,
  PrayerStoryView,
  SpacesSection,
  StreakCard,
  type PrayerContent,
  type Space,
} from '@/components/home'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'

const FOUNDER_NAME = 'Ifedayo'

const STREAK_DAYS = [true, true, true, true, true, true, false]
const STREAK_TODAY_INDEX = 6

const SISTERS = [
  { name: 'Temi A.', role: 'Product Design', city: 'Lagos', initials: 'TA' },
  { name: 'Amara K.', role: 'Finance', city: 'Lagos', initials: 'AK' },
  { name: 'Fatima O.', role: 'Marketing', city: 'Lagos', initials: 'FO' },
]

const SPACES: Space[] = [
  {
    name: 'Business',
    newPosts: 4,
    active: 12,
    icon: 'briefcase.fill',
    gradient: [colors.light.primary[400], colors.light.primary[700]],
  },
  {
    name: 'Career',
    newPosts: 4,
    active: 12,
    icon: 'chart.line.uptrend.xyaxis',
    gradient: [colors.light.tertiary[400], colors.light.tertiary[800]],
  },
  {
    name: 'Money',
    newPosts: 4,
    active: 12,
    icon: 'dollarsign.circle.fill',
    gradient: [colors.light.secondary[400], colors.light.secondary[700]],
  },
]

const PRAYER: PrayerContent = {
  verseRef: 'Philippians 4:7 KJV',
  verse: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds.',
  likeCount: 124,
  replyCount: 38,
}

function greetingDate() {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
}

export default function HomeScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const [prayerExpanded, setPrayerExpanded] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Avatar initials={firstName.slice(0, 2).toUpperCase()} size="md" />
          <View style={styles.headerText}>
            <Text variant="h3">Good morning, {firstName}</Text>
            <Text style={styles.headerDate}>{greetingDate()}</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <SymbolView name="square.grid.2x2" size={18} tintColor={colors.light.text} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <SymbolView name="bell" size={18} tintColor={colors.light.text} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <Pressable onPress={() => setPrayerExpanded(true)}>
          <DailyPrayerCard prayer={PRAYER} />
        </Pressable>

        <MoodCheckIn />

        <StreakCard days={STREAK_DAYS} todayIndex={STREAK_TODAY_INDEX} />

        <Section title="Sisters near you" onSeeAll={() => {}} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {SISTERS.map(sister => (
            <Card key={sister.name} style={styles.sisterCard}>
              <Avatar initials={sister.initials} size="lg" />
              <Text style={styles.sisterName}>{sister.name}</Text>
              <Text style={styles.sisterRole}>{sister.role}</Text>
              <View style={styles.sisterCity}>
                <SymbolView name="mappin" size={11} tintColor={colors.light.textSoft} />
                <Text style={styles.sisterCityText}>{sister.city}</Text>
              </View>
            </Card>
          ))}
        </ScrollView>

        <Section title={`From ${FOUNDER_NAME}`} />
        <Card padded={false} style={styles.videoCard}>
          <View style={styles.videoInfo}>
            <View style={styles.videoTag}>
              <Text style={styles.videoTagText}>VIDEO • NEW</Text>
            </View>
            <Text style={styles.videoTitle}>What I wish I knew before starting DANG Lifestyle</Text>
            <Text style={styles.videoDuration}>8 min watch</Text>
          </View>
          <View style={styles.videoThumb}>
            <SymbolView name="video.fill" size={22} tintColor={colors.light.neutral.white} />
          </View>
        </Card>

        <Section title="Your spaces" onSeeAll={() => {}} />
        <SpacesSection spaces={SPACES} />
      </ScrollView>

      <Modal visible={prayerExpanded} animationType="slide" presentationStyle="fullScreen">
        <PrayerStoryView prayer={PRAYER} onClose={() => setPrayerExpanded(false)} />
      </Modal>
    </SafeAreaView>
  )
}

function Section({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="h3">{title}</Text>
      {onSeeAll && (
        <Text style={styles.seeAll} onPress={onSeeAll}>
          see all
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  headerText: {
    flex: 1,
  },
  headerDate: {
    color: colors.light.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.light.semantic.error,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -8,
  },
  seeAll: {
    color: colors.light.primary[500],
    fontWeight: '600',
    fontSize: 13,
  },

  hScroll: {
    marginHorizontal: -20,
  },
  sisterCard: {
    alignItems: 'center',
    width: 128,
    marginLeft: 20,
    gap: 4,
  },
  sisterName: {
    fontWeight: '700',
    fontSize: 14,
    marginTop: 8,
  },
  sisterRole: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  sisterCity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  sisterCityText: {
    fontSize: 11,
    color: colors.light.textSoft,
  },

  videoCard: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  videoInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 8,
  },
  videoTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.light.bgSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.textMuted,
    letterSpacing: 0.4,
  },
  videoTitle: {
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  videoDuration: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  videoThumb: {
    width: 110,
    backgroundColor: colors.light.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
})
