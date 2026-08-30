import { useState } from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui/Tabs'
import { EventCard, FeaturedEventCard, MyEventsView, EVENTS, HOME_CATEGORIES } from '@/components/events'
import { useAuthStore, useEventsStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

type DiscoverTab = 'discover' | 'myEvents'

const [FEATURED, UPCOMING_1, UPCOMING_2, GRID_1, GRID_2] = EVENTS

export default function EventsScreen() {
  const user = useAuthStore(s => s.user)
  const openDrawer = useUIStore(s => s.openDrawer)
  const savedEventIds = useEventsStore(s => s.savedEventIds)
  const toggleSave = useEventsStore(s => s.toggleSave)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'

  const [tab, setTab] = useState<DiscoverTab>('discover')
  const [category, setCategory] = useState('All')

  const upcoming = [UPCOMING_1, UPCOMING_2].filter(
    e => category === 'All' || e.category?.toLowerCase() === category.replace(/s$/, '').toLowerCase(),
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={openDrawer} hitSlop={8}>
          <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Events
        </Text>
        <View style={styles.headerIconsGroup}>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/(events)/calendar')}>
            <Icon name="calendar" size={16} tintColor={colors.light.text} />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/(events)/search')}>
            <Icon name="magnifyingglass" size={16} tintColor={colors.light.text} />
          </Pressable>
        </View>
      </View>

      <Tabs
        tabs={[
          { value: 'discover', label: 'Discover' },
          { value: 'myEvents', label: 'My Events' },
        ]}
        value={tab}
        onChange={setTab}
        stretch={false}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'discover' ? (
          <>
            <Pressable style={styles.featuredCard} onPress={() => router.push(`/(events)/${FEATURED.id}`)}>
              <Image source={{ uri: FEATURED.coverUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient
                colors={['rgba(15,23,42,0.85)', 'rgba(15,23,42,0.25)', 'rgba(15,23,42,0)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.7, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.featuredEyebrow}>FEATURED</Text>
              <Text style={styles.featuredTitle}>{FEATURED.title}</Text>
              <View style={styles.featuredBottomRow}>
                <Text style={styles.featuredMeta}>
                  {FEATURED.month} {FEATURED.day} · {FEATURED.venue}.
                </Text>
                <Button
                  title="View"
                  size="sm"
                  onPress={() => router.push(`/(events)/${FEATURED.id}`)}
                  style={styles.featuredButton}
                />
              </View>
            </Pressable>

            <View style={styles.sectionHeaderRow}>
              <Text variant="h3">Upcoming Events</Text>
              <Pressable onPress={() => router.push('/(events)/search')} hitSlop={8}>
                <Text style={styles.seeAllLink}>See all ›</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {HOME_CATEGORIES.map(c => (
                <Pressable
                  key={c}
                  style={[styles.categoryChip, category === c && styles.categoryChipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {upcoming.map(event => (
              <EventCard
                key={event.id}
                event={event}
                saved={savedEventIds.includes(event.id)}
                onPress={() => router.push(`/(events)/${event.id}`)}
                onToggleSave={() => toggleSave(event.id)}
                onRSVP={() => router.push(`/(events)/${event.id}/rsvp`)}
              />
            ))}
            {upcoming.length === 0 && <Text style={styles.emptyText}>No events in this category yet.</Text>}

            <View style={styles.sectionHeaderRow}>
              <Text variant="h3">Featured Events</Text>
              <Pressable onPress={() => router.push('/(events)/search')} hitSlop={8}>
                <Text style={styles.seeAllLink}>See all ›</Text>
              </Pressable>
            </View>
            <View style={styles.gridRow}>
              <FeaturedEventCard event={GRID_1} onPress={() => router.push(`/(events)/${GRID_1.id}`)} />
              <FeaturedEventCard event={GRID_2} onPress={() => router.push(`/(events)/${GRID_2.id}`)} />
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text variant="h3">Past Events</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.seeAllLink}>See all ›</Text>
              </Pressable>
            </View>
            <View style={styles.pastEmptyCard}>
              <Icon name="star" size={26} tintColor={colors.light.textSoft} />
              <Text style={styles.pastEmptyText}>Your past events will appear here</Text>
            </View>
          </>
        ) : (
          <MyEventsView onBrowseEvents={() => setTab('discover')} />
        )}
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerIconsGroup: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    padding: 3,
    gap: 2,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  featuredCard: {
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
    ...shadows.md,
  },
  featuredEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.primary[300],
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.neutral.white,
    marginBottom: 10,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  featuredButton: {
    borderRadius: 999,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 12,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.light.primary[500],
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  categoryChipTextActive: {
    color: colors.light.neutral.white,
  },
  emptyText: {
    fontSize: 14,
    color: colors.light.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pastEmptyCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 10,
  },
  pastEmptyText: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
})
