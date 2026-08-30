import { useState } from 'react'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { getEventById } from '@/components/events'
import { colors } from '@/theme/colors'
import type { EventParticipant } from '@/types/events'

type RoomState = 'waiting' | 'live' | 'ended'

const DEFAULT_PARTICIPANTS: EventParticipant[] = [
  { id: 'p-host', name: 'Host', initials: 'HO', color: '#6EA88B', isHost: true },
  { id: 'p-you', name: 'You', initials: 'ME', color: '#8B7FD6' },
]

export default function EventRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const event = getEventById(id)
  const [state, setState] = useState<RoomState>('waiting')
  const [muted, setMuted] = useState(true)
  const [cameraOn, setCameraOn] = useState(false)
  const [handRaised, setHandRaised] = useState(false)

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.whiteText}>Event not found.</Text>
      </SafeAreaView>
    )
  }

  const participants = event.participants ?? DEFAULT_PARTICIPANTS
  const host = participants.find(p => p.isHost) ?? participants[0]
  const others = participants.filter(p => p.id !== host.id)
  const joinedCount = participants.length

  if (state === 'live') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.liveTopBar}>
          <Pressable
            style={styles.circleButtonDark}
            onPress={() => setState('ended')}
          >
            <Icon name="xmark" size={16} tintColor={colors.light.neutral.white} />
          </Pressable>
          <View style={styles.liveTopRight}>
            <View style={styles.countPill}>
              <Icon name="person.2.fill" size={11} tintColor={colors.light.neutral.white} />
              <Text style={styles.countPillText}>{joinedCount}</Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>LIVE</Text>
            </View>
          </View>
        </View>

        <Text style={styles.liveTitle}>{event.title}</Text>

        <View style={styles.grid}>
          <ParticipantTile participant={host} big />
          {others.map(p => (
            <ParticipantTile key={p.id} participant={p} />
          ))}
        </View>

        <View style={styles.toolbar}>
          <ToolbarButton
            icon={muted ? 'mic.slash.fill' : 'mic.fill'}
            label={muted ? 'Unmute' : 'Mute'}
            active={muted}
            onPress={() => setMuted(v => !v)}
          />
          <ToolbarButton
            icon={cameraOn ? 'video.fill' : 'video.slash.fill'}
            label="Camera"
            active={!cameraOn}
            onPress={() => setCameraOn(v => !v)}
          />
          <ToolbarButton
            icon="hand.raised.fill"
            label="Hand"
            active={handRaised}
            onPress={() => setHandRaised(v => !v)}
          />
          <ToolbarButton icon="bubble.left.fill" label="Chat" />
          <ToolbarButton icon="person.2.fill" label="People" />
          <ToolbarButton icon="phone.down.fill" label="Leave" danger onPress={() => setState('ended')} />
        </View>
      </SafeAreaView>
    )
  }

  if (state === 'ended') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.topBarSimple}>
          <Pressable style={styles.circleButtonDark} onPress={() => router.back()}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
          </Pressable>
        </View>

        <View style={styles.centerBody}>
          <View style={styles.iconCircle}>
            <Icon name="video.fill" size={30} tintColor={colors.light.primary[300]} />
          </View>
          <Text variant="h2" style={styles.whiteTitle}>
            Session Ended
          </Text>
          <Text style={styles.mutedTitle}>{event.title}</Text>
          <Text style={styles.mutedSubtitle}>
            {event.date} · {event.time}
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Host</Text>
            <View style={styles.hostRow}>
              <Avatar initials={host.initials} size="sm" />
              <View>
                <Text style={styles.whiteBold}>{event.host ?? host.name}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.endedDot} />
                  <Text style={styles.endedText}>Ended</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.participantsHeaderRow}>
              <Text style={styles.infoCardLabel}>Participants</Text>
              <Text style={styles.infoCardValue}>{joinedCount + 12} attended</Text>
            </View>
            <ParticipantAvatarRow participants={participants} />
          </View>
        </View>

        <View style={styles.endedFooter}>
          <Button title="Watch Recording" variant="outline" style={styles.leaveButton} textStyle={styles.whiteText} />
          <Button title="View Discussion" style={styles.joinButton} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBarSimple}>
        <Pressable style={styles.circleButtonDark} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
        </Pressable>
      </View>

      <View style={styles.centerBody}>
        <View style={styles.iconCircle}>
          <Icon name="video.fill" size={30} tintColor={colors.light.primary[300]} />
        </View>
        <Text variant="h2" style={styles.whiteTitle}>
          Waiting Room
        </Text>
        <Text style={styles.mutedTitle}>{event.title}</Text>
        <Text style={styles.mutedSubtitle}>The host will let you in shortly</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Host</Text>
          <View style={styles.hostRow}>
            <Avatar initials={host.initials} size="sm" />
            <View>
              <Text style={styles.whiteBold}>{event.host ?? host.name}</Text>
              <View style={styles.statusRow}>
                <View style={styles.liveDotSmall} />
                <Text style={styles.liveNowText}>Live now</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.participantsHeaderRow}>
            <Text style={styles.infoCardLabel}>Participants</Text>
            <Text style={styles.infoCardValue}>{joinedCount + 12} joined</Text>
          </View>
          <ParticipantAvatarRow participants={participants} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Leave" style={styles.leaveButton} onPress={() => router.back()} />
        <Button
          title="▷ Join Now"
          style={styles.joinButton}
          onPress={() => setState('live')}
        />
      </View>
    </SafeAreaView>
  )
}

function ParticipantAvatarRow({ participants }: { participants: EventParticipant[] }) {
  const visible = participants.slice(0, 4)
  return (
    <View style={styles.avatarRow}>
      {visible.map((p, i) => (
        <View key={p.id} style={[styles.avatarWrap, i > 0 && styles.avatarOverlap, { backgroundColor: p.color }]}>
          <Text style={styles.avatarInitials}>{p.initials}</Text>
        </View>
      ))}
      <View style={[styles.avatarWrap, styles.avatarOverlap, styles.avatarOverflow]}>
        <Text style={styles.avatarOverflowText}>+12</Text>
      </View>
    </View>
  )
}

function ParticipantTile({ participant, big }: { participant: EventParticipant; big?: boolean }) {
  return (
    <View style={[styles.tile, big && styles.tileBig]}>
      {participant.avatarUrl ? (
        <Image source={{ uri: participant.avatarUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.tileFallback, { backgroundColor: participant.color }]}>
          <Text style={styles.tileInitials}>{participant.initials}</Text>
        </View>
      )}
      <View style={styles.tileNameBadge}>
        <Text style={styles.tileNameText} numberOfLines={1}>
          {participant.name}
          {participant.isHost ? ' · Host' : ''}
        </Text>
      </View>
      <View style={styles.tileMicBadge}>
        <Icon name="mic.slash.fill" size={11} tintColor={colors.light.semantic.error} />
      </View>
    </View>
  )
}

function ToolbarButton({
  icon,
  label,
  active,
  danger,
  onPress,
}: {
  icon: SymbolViewProps['name']
  label: string
  active?: boolean
  danger?: boolean
  onPress?: () => void
}) {
  return (
    <Pressable style={styles.toolbarButton} onPress={onPress}>
      <View style={[styles.toolbarIconWrap, danger && styles.toolbarIconDanger, active && !danger && styles.toolbarIconActive]}>
        <Icon name={icon} size={17} tintColor={colors.light.neutral.white} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B14',
  },
  whiteText: {
    color: colors.light.neutral.white,
  },
  topBarSimple: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  circleButtonDark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(139,127,214,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(139,127,214,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  whiteTitle: {
    color: colors.light.neutral.white,
    marginBottom: 6,
  },
  mutedTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 2,
  },
  mutedSubtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    marginBottom: 28,
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  infoCardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 10,
  },
  infoCardValue: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whiteBold: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveNowText: {
    fontSize: 12,
    color: '#34D399',
  },
  endedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F87171',
  },
  endedText: {
    fontSize: 12,
    color: '#F87171',
  },
  participantsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0B0B14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  avatarInitials: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  avatarOverflow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarOverflowText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  endedFooter: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  leaveButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: colors.light.neutral.white,
  },
  joinButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  liveTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 12,
  },
  liveTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.neutral.white,
  },
  livePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  liveTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.light.neutral.white,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A24',
  },
  tileBig: {
    width: '100%',
    aspectRatio: 1.6,
  },
  tileFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  tileNameBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tileNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  tileMicBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  toolbarButton: {
    alignItems: 'center',
  },
  toolbarIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarIconActive: {
    backgroundColor: 'rgba(239,68,68,0.25)',
  },
  toolbarIconDanger: {
    backgroundColor: '#EF4444',
  },
})
