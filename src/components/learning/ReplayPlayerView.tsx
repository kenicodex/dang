import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { RoomChatPanel, RoomControlButton, RoomPeoplePanel, RoomVideoTile, roomColors } from './RoomChrome'
import { ROOM_ATTENDEE_LIST, ROOM_CHAT, REPLAY_TILES, type SessionEntry } from './liveSession.data'

function parseDurationSeconds(duration?: string) {
  const minutes = parseInt(duration ?? '0', 10)
  return Number.isNaN(minutes) ? 0 : minutes * 60
}

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = Math.floor(clamped % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

interface ReplayPlayerViewProps {
  session: SessionEntry
  onClose: () => void
}

export function ReplayPlayerView({ session, onClose }: ReplayPlayerViewProps) {
  const totalSeconds = parseDurationSeconds(session.duration)
  const [elapsed, setElapsed] = useState(Math.round(totalSeconds * 0.35))
  const [playing, setPlaying] = useState(false)
  const [panel, setPanel] = useState<'chat' | 'people' | null>(null)

  const host = ROOM_ATTENDEE_LIST[0]
  const progress = totalSeconds > 0 ? Math.min(1, elapsed / totalSeconds) : 0

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
          <Icon name="xmark" size={16} tintColor={roomColors.text} />
        </Pressable>
        <View style={styles.topRight}>
          <Text style={styles.dateText}>{session.dateLabel}</Text>
          <View style={styles.recPill}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sessionTitle}>{session.title}</Text>

      <View style={styles.grid}>
        <RoomVideoTile participant={host} size="main" />
        <View style={styles.gridRow}>
          {REPLAY_TILES.slice(0, 2).map(p => (
            <RoomVideoTile key={p.id} participant={p} />
          ))}
        </View>
      </View>

      <View style={styles.scrubberRow}>
        <Text style={styles.timeText}>{formatTime(elapsed)}</Text>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.scrubDot, { left: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.timeText}>{session.duration ?? formatTime(totalSeconds)}</Text>
      </View>

      <View style={styles.controlBar}>
        <RoomControlButton icon="gobackward.15" label="-15s" onPress={() => setElapsed(v => Math.max(0, v - 15))} />
        <RoomControlButton icon={playing ? 'pause.fill' : 'play.fill'} label={playing ? 'Pause' : 'Play'} active={playing} onPress={() => setPlaying(v => !v)} />
        <RoomControlButton icon="goforward.15" label="+15s" onPress={() => setElapsed(v => Math.min(totalSeconds, v + 15))} />
        <RoomControlButton icon="speedometer" label="Speed" />
        <RoomControlButton icon="bubble.left.fill" label="Chat" onPress={() => setPanel('chat')} />
        <RoomControlButton icon="person.2.fill" label="People" onPress={() => setPanel('people')} />
      </View>

      {panel === 'chat' && <RoomChatPanel messages={ROOM_CHAT} onClose={() => setPanel(null)} />}
      {panel === 'people' && <RoomPeoplePanel participants={ROOM_ATTENDEE_LIST} onClose={() => setPanel(null)} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: roomColors.bg,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: roomColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: roomColors.textMuted,
    fontSize: 13,
  },
  recPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: roomColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  recText: {
    color: roomColors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  sessionTitle: {
    color: roomColors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 14,
  },
  grid: {
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  timeText: {
    color: roomColors.textMuted,
    fontSize: 11,
    minWidth: 34,
  },
  track: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: roomColors.surface,
  },
  trackFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.light.primary[500],
  },
  scrubDot: {
    position: 'absolute',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#FFFFFF',
    marginLeft: -5.5,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
})
