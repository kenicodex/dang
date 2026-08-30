import { useState } from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { Pressable, StyleSheet, View } from 'react-native'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { useAuthStore, useEventsStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import { EVENTS, PAST_EVENTS, daysRemaining } from './events.data'
import { TicketSheet } from './TicketSheet'
import type { Event } from '@/types/events'

type MySubTab = 'upcoming' | 'saved' | 'completed' | 'cancelled'

const SUB_TABS: { value: MySubTab; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'saved', label: 'Saved' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function MyEventsView({ onBrowseEvents }: { onBrowseEvents: () => void }) {
  const user = useAuthStore(s => s.user)
  const rsvpedEventIds = useEventsStore(s => s.rsvpedEventIds)
  const savedEventIds = useEventsStore(s => s.savedEventIds)
  const cancelledEventIds = useEventsStore(s => s.cancelledEventIds)
  const reminderEnabled = useEventsStore(s => s.reminderEnabled)
  const toggleReminder = useEventsStore(s => s.toggleReminder)
  const toggleSave = useEventsStore(s => s.toggleSave)

  const [subTab, setSubTab] = useState<MySubTab>('upcoming')
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null)

  const upcoming = EVENTS.filter(e => rsvpedEventIds.includes(e.id))
  const saved = EVENTS.filter(e => savedEventIds.includes(e.id))
  const cancelled = EVENTS.filter(e => cancelledEventIds.includes(e.id))

  return (
    <View>
      <View style={styles.subTabsRow}>
        {SUB_TABS.map(t => {
          const active = subTab === t.value
          return (
            <Pressable
              key={t.value}
              style={[styles.subTabChip, active && styles.subTabChipActive]}
              onPress={() => setSubTab(t.value)}
            >
              <Text style={[styles.subTabText, active && styles.subTabTextActive]}>{t.label}</Text>
            </Pressable>
          )
        })}
      </View>

      {subTab === 'upcoming' &&
        (upcoming.length > 0 ? (
          upcoming.map(event => (
            <UpcomingCard
              key={event.id}
              event={event}
              reminderOn={reminderEnabled[event.id] ?? true}
              onToggleReminder={() => toggleReminder(event.id)}
              onViewTicket={() => setTicketEvent(event)}
            />
          ))
        ) : (
          <EmptyBlock icon="calendar" text="Events you RSVP to will show up here." />
        ))}

      {subTab === 'saved' &&
        (saved.length > 0 ? (
          saved.map(event => (
            <SavedCard key={event.id} event={event} onRemove={() => toggleSave(event.id)} />
          ))
        ) : (
          <EmptyBlock icon="bookmark" text="Events you save will show up here." />
        ))}

      {subTab === 'completed' &&
        (PAST_EVENTS.length > 0 ? (
          PAST_EVENTS.map(pe => (
            <View key={pe.id} style={styles.completedCard}>
              <Text style={styles.completedEyebrow}>Session Ended</Text>
              <Text style={styles.completedTitle}>{pe.title}</Text>
              <View style={styles.completedMetaRow}>
                <Icon name="calendar" size={12} tintColor={colors.light.primary[500]} />
                <Text style={styles.completedMetaText}>
                  {pe.date} · {pe.time}
                </Text>
              </View>
              <View style={styles.completedHostRow}>
                <Avatar uri={pe.hostAvatarUrl} initials={pe.host.slice(0, 2).toUpperCase()} size="xs" />
                <Text style={styles.completedHostText}>Hosted by {pe.host}</Text>
              </View>
              <View style={styles.completedAttendeesRow}>
                <Icon name="person.2.fill" size={12} tintColor={colors.light.textMuted} />
                <Text style={styles.completedMetaText}>{pe.attendeeCount} members attended</Text>
              </View>
              {pe.recordingAvailable && (
                <Button title="Watch Recording" variant="outline" style={styles.watchButton} />
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <EmptyIllustration />
            <Text style={styles.emptyTitle}>No completed events yet</Text>
            <Pressable onPress={onBrowseEvents} hitSlop={8}>
              <Text style={styles.browseLink}>Browse Events →</Text>
            </Pressable>
          </View>
        ))}

      {subTab === 'cancelled' &&
        (cancelled.length > 0 ? (
          cancelled.map(event => <SavedCard key={event.id} event={event} />)
        ) : (
          <EmptyBlock icon="xmark.circle" text="Events you cancel will show up here." />
        ))}

      {ticketEvent && (
        <TicketSheet
          visible
          onClose={() => setTicketEvent(null)}
          event={ticketEvent}
          attendeeName={user?.displayName ?? 'Amara Johnson'}
        />
      )}
    </View>
  )
}

function UpcomingCard({
  event,
  reminderOn,
  onToggleReminder,
  onViewTicket,
}: {
  event: Event
  reminderOn: boolean
  onToggleReminder: () => void
  onViewTicket: () => void
}) {
  const remaining = daysRemaining(event)
  return (
    <View style={styles.upcomingCard}>
      <View style={styles.upcomingImageWrap}>
        <Image source={{ uri: event.coverUrl }} style={styles.upcomingImage} contentFit="cover" />
        <View style={styles.registeredBadge}>
          <Icon name="checkmark" size={10} tintColor={colors.light.neutral.white} weight="bold" />
          <Text style={styles.registeredBadgeText}>Registered</Text>
        </View>
        <View style={styles.countdownBadge}>
          <Icon name="clock" size={10} tintColor={colors.light.neutral.white} />
          <Text style={styles.countdownBadgeText}>{remaining} Days Remaining</Text>
        </View>
      </View>

      <View style={styles.upcomingBody}>
        <Text style={styles.upcomingTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.upcomingMetaRow}>
          <Icon name="calendar" size={13} tintColor={colors.light.primary[500]} />
          <Text style={styles.upcomingMetaText}>
            {event.date} · {event.time}
          </Text>
        </View>

        <Pressable style={styles.reminderRow} onPress={onToggleReminder}>
          <Icon
            name={reminderOn ? 'bell.fill' : 'bell.slash'}
            size={12}
            tintColor={reminderOn ? colors.light.semantic.success : colors.light.textSoft}
          />
          <Text style={styles.reminderText}>
            {reminderOn ? 'Reminder set · 24h before' : 'Reminder off'}
          </Text>
        </Pressable>

        <View style={styles.upcomingActionsRow}>
          <Pressable style={styles.ticketButton} onPress={onViewTicket}>
            <Icon name="square.grid.2x2" size={13} tintColor={colors.light.text} />
            <Text style={styles.ticketButtonText}>View Ticket</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => router.push(`/(events)/${event.id}/cancel`)}
          >
            <Icon name="xmark" size={12} tintColor={colors.light.semantic.error} />
            <Text style={styles.cancelButtonText}>Cancel RSVP</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

function SavedCard({ event, onRemove }: { event: Event; onRemove?: () => void }) {
  return (
    <Pressable style={styles.savedCard} onPress={() => router.push(`/(events)/${event.id}`)}>
      <Image source={{ uri: event.coverUrl }} style={styles.savedThumb} contentFit="cover" />
      <View style={styles.savedInfo}>
        <Text style={styles.savedTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.savedMetaRow}>
          <Icon name="calendar" size={11} tintColor={colors.light.primary[500]} />
          <Text style={styles.savedMetaText}>
            {event.date} · {event.time}
          </Text>
        </View>
        <Text style={[styles.savedPrice, event.priceLabel === 'Free' && styles.savedPriceFree]}>
          {event.priceLabel ?? 'Free'}
        </Text>
      </View>
      <View style={styles.savedActions}>
        <Pressable style={styles.savedRsvpButton} onPress={() => router.push(`/(events)/${event.id}/rsvp`)}>
          <Text style={styles.savedRsvpButtonText}>RSVP</Text>
        </Pressable>
        {onRemove && (
          <Pressable style={styles.savedRemoveButton} onPress={onRemove}>
            <Icon name="xmark" size={12} tintColor={colors.light.semantic.error} />
          </Pressable>
        )}
      </View>
    </Pressable>
  )
}

function EmptyBlock({ icon, text }: { icon: SymbolViewProps['name']; text: string }) {
  return (
    <View style={styles.pastEmptyCard}>
      <Icon name={icon} size={26} tintColor={colors.light.textSoft} />
      <Text style={styles.pastEmptyText}>{text}</Text>
    </View>
  )
}

function EmptyIllustration() {
  return (
    <View style={styles.illustrationWrap}>
      <Icon name="doc.text" size={40} tintColor={colors.light.primary[300]} />
      <Icon name="xmark" size={9} tintColor={colors.light.primary[200]} style={styles.illustrationX} />
      <Icon name="circle" size={7} tintColor={colors.light.primary[200]} style={styles.illustrationDot} />
    </View>
  )
}

const styles = StyleSheet.create({
  subTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  subTabChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
  },
  subTabChipActive: {
    backgroundColor: colors.light.primary[500],
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  subTabTextActive: {
    color: colors.light.neutral.white,
  },
  upcomingCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.sm,
  },
  upcomingImageWrap: {
    height: 150,
  },
  upcomingImage: {
    ...StyleSheet.absoluteFillObject,
  },
  registeredBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.light.semantic.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  registeredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  countdownBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  countdownBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  upcomingBody: {
    padding: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  upcomingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  upcomingMetaText: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  reminderText: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  upcomingActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ticketButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 999,
    paddingVertical: 11,
  },
  ticketButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.text,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.light.semantic.errorBg,
    borderRadius: 999,
    paddingVertical: 11,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.semantic.error,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...shadows.sm,
  },
  savedThumb: {
    width: 72,
    height: 72,
  },
  savedInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  savedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  savedMetaText: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  savedPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
  },
  savedPriceFree: {
    color: colors.light.semantic.success,
  },
  savedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  savedRsvpButton: {
    backgroundColor: colors.light.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  savedRsvpButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  savedRemoveButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.light.semantic.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCard: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  completedEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.light.primary[500],
    marginBottom: 6,
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  completedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  completedMetaText: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  completedHostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  completedHostText: {
    fontSize: 12,
    color: colors.light.textAlt,
  },
  completedAttendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  watchButton: {
    borderRadius: 999,
    backgroundColor: colors.light.neutral.white,
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  illustrationWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  illustrationX: {
    position: 'absolute',
    top: 4,
    right: 8,
  },
  illustrationDot: {
    position: 'absolute',
    bottom: 6,
    left: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  browseLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
})
