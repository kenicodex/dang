import { useState } from 'react'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui/Tabs'
import { getEventById, seatsUrgent } from '@/components/events'
import { useEventsStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

type DetailTab = 'about' | 'agenda' | 'speakers' | 'requirements' | 'faq'

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const event = getEventById(id)
  const rsvpedEventIds = useEventsStore(s => s.rsvpedEventIds)
  const [tab, setTab] = useState<DetailTab>('about')

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Event not found.</Text>
      </SafeAreaView>
    )
  }

  const isGoing = rsvpedEventIds.includes(event.id)
  const capacity = event.capacity ?? 0
  const remaining = event.seatsRemaining ?? 0
  const progress = capacity > 0 ? Math.min(1, remaining / capacity) : 0
  const urgent = seatsUrgent(event)

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: event.coverUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <SafeAreaView edges={['top']} style={styles.heroTopBar}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
            </Pressable>
          </SafeAreaView>
          <View style={styles.heroBottomBar}>
            {event.category && (
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{event.category}</Text>
              </View>
            )}
            <View style={[styles.heroBadge, styles.heroBadgePrimary]}>
              <Icon
                name={event.isVirtual ? 'video.fill' : 'person.fill'}
                size={11}
                tintColor={colors.light.neutral.white}
              />
              <Text style={styles.heroBadgeText}>{event.isVirtual ? 'Virtual' : 'In-person'}</Text>
            </View>
            <View style={styles.heroSpacer} />
            {event.goingLabel && (
              <View style={styles.goingBadge}>
                <Icon name="person.2.fill" size={11} tintColor={colors.light.primary[500]} />
                <Text style={styles.goingBadgeText}>{event.goingLabel}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <Text variant="h2" style={styles.title}>
            {event.title}
          </Text>
          {event.host && (
            <Text style={styles.hostText}>
              Hosted by <Text style={styles.hostName}>{event.host}</Text>
            </Text>
          )}

          <View style={styles.detailGrid}>
            <DetailPill icon="calendar" label="Date" value={event.date} />
            <DetailPill icon="clock" label="Time" value={event.startTime} />
            <DetailPill icon="clock" label="Duration" value={event.durationLabel ?? '—'} />
            <DetailPill icon="person.2" label="Capacity" value={capacity ? `${capacity} total` : '—'} />
            <DetailPill icon="mappin" label="Location" value={event.isVirtual ? 'Virtual' : event.venue ?? '—'} />
            <DetailPill icon="dollarsign" label="Price" value={event.priceLabel ?? 'Free'} />
          </View>

          {capacity > 0 && (
            <View style={[styles.seatsCard, urgent && styles.seatsCardUrgent]}>
              <View style={styles.seatsRow}>
                <Icon
                  name="person.2.fill"
                  size={14}
                  tintColor={urgent ? colors.light.semantic.error : colors.light.semantic.success}
                />
                <Text style={[styles.seatsLabel, urgent && styles.seatsLabelUrgent]}>{remaining} seats remaining</Text>
              </View>
              <View style={styles.seatsBarRow}>
                <View style={[styles.seatsBarTrack, urgent && styles.seatsBarTrackUrgent]}>
                  <View style={[styles.seatsBarFill, urgent && styles.seatsBarFillUrgent, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.seatsTotal}>{capacity}</Text>
              </View>
            </View>
          )}

          {!!event.tags?.length && (
            <View style={styles.tagRow}>
              {event.tags.map(tag => (
                <View key={tag} style={styles.tagChip}>
                  <Icon name="tag" size={11} tintColor={colors.light.primary[500]} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <Tabs
              tabs={[
                { value: 'about', label: 'About' },
                { value: 'agenda', label: `Agenda ${event.agenda?.length ?? 0}` },
                { value: 'speakers', label: `Speakers ${event.speakers?.length ?? 0}` },
                { value: 'requirements', label: `Requirements ${event.requirements?.length ?? 0}` },
                { value: 'faq', label: `FAQ ${event.faqs?.length ?? 0}` },
              ]}
              value={tab}
              onChange={setTab}
              stretch={false}
            />
          </ScrollView>

          <View style={styles.tabContent}>
            {tab === 'about' && <Text style={styles.description}>{event.description}</Text>}

            {tab === 'agenda' &&
              (event.agenda ?? []).map((item, i) => (
                <View key={item.time + i} style={styles.listRow}>
                  <View style={styles.stepBubble}>
                    <Text style={styles.stepBubbleText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.listRowText}>
                    {item.time} — {item.label}
                  </Text>
                </View>
              ))}

            {tab === 'speakers' &&
              (event.speakers ?? []).map(speaker => (
                <View key={speaker.name} style={styles.speakerRow}>
                  <Avatar initials={speaker.name.slice(0, 2).toUpperCase()} size="sm" />
                  <View>
                    <Text style={styles.speakerName}>{speaker.name}</Text>
                    <Text style={styles.speakerRole}>{speaker.role}</Text>
                  </View>
                </View>
              ))}

            {tab === 'requirements' &&
              (event.requirements && event.requirements.length > 0 ? (
                event.requirements.map(req => (
                  <View key={req} style={styles.listRow}>
                    <Icon name="checkmark" size={14} tintColor={colors.light.semantic.success} weight="bold" />
                    <Text style={styles.listRowText}>{req}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>No requirements — just show up!</Text>
              ))}

            {tab === 'faq' &&
              (event.faqs ?? []).map(faq => (
                <View key={faq.question} style={styles.faqCard}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isGoing ? "✓ You're Going" : 'RSVP Now'}
          variant={isGoing ? 'outline' : 'primary'}
          style={styles.footerButton}
          onPress={() => router.push(`/(events)/${event.id}/rsvp`)}
        />
        <Pressable
          style={styles.locationButton}
          onPress={() =>
            router.push(event.isVirtual ? `/(events)/${event.id}/room` : `/(events)/${event.id}/venue`)
          }
        >
          <Icon
            name={event.isVirtual ? 'video.fill' : 'mappin'}
            size={18}
            tintColor={colors.light.primary[500]}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

function DetailPill({ icon, label, value }: { icon: SymbolViewProps['name']; label: string; value: string }) {
  return (
    <View style={styles.detailPill}>
      <Icon name={icon} size={14} tintColor={colors.light.primary[500]} />
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  hero: {
    height: 280,
    justifyContent: 'space-between',
  },
  heroTopBar: {
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  heroBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroBadgePrimary: {
    backgroundColor: colors.light.primary[500],
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  heroSpacer: {
    flex: 1,
  },
  goingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  goingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.text,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginBottom: 6,
  },
  hostText: {
    fontSize: 14,
    color: colors.light.textMuted,
    marginBottom: 20,
  },
  hostName: {
    color: colors.light.primary[500],
    fontWeight: '700',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  detailPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 1,
  },
  seatsCard: {
    backgroundColor: colors.light.semantic.successBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  seatsCardUrgent: {
    backgroundColor: colors.light.semantic.errorBg,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  seatsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.semantic.success,
  },
  seatsLabelUrgent: {
    color: colors.light.semantic.error,
  },
  seatsBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seatsBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(16,185,129,0.2)',
    overflow: 'hidden',
  },
  seatsBarTrackUrgent: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  seatsBarFill: {
    height: '100%',
    backgroundColor: colors.light.semantic.success,
    borderRadius: 3,
  },
  seatsBarFillUrgent: {
    backgroundColor: colors.light.semantic.error,
  },
  seatsTotal: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.light.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    color: colors.light.primary[600],
  },
  tabsScroll: {
    marginBottom: 16,
  },
  tabContent: {
    paddingBottom: 110,
    gap: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textAlt,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  stepBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBubbleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  listRowText: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    padding: 12,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  speakerRole: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 1,
  },
  faqCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    padding: 14,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.light.textMuted,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.light.bg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  footerButton: {
    flex: 1,
    borderRadius: 999,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.light.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
})
