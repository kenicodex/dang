import React, { useEffect } from 'react'
import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { useCountdown } from '@/hooks/use-countdown'
import { colors } from '@/theme/colors'
import { roomColors } from './RoomChrome'
import { WAITING_ROOM_PREVIEW, type SessionEntry } from './liveSession.data'

interface WaitingRoomViewProps {
  session: SessionEntry
  onLeave: () => void
  onReady: () => void
}

export function WaitingRoomView({ session, onLeave, onReady }: WaitingRoomViewProps) {
  const target = session.startsAt ?? new Date()
  const { minutes, seconds, isDone } = useCountdown(target)

  useEffect(() => {
    if (isDone) onReady()
  }, [isDone, onReady])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable style={styles.closeButton} onPress={onLeave} hitSlop={8}>
          <Icon name="xmark" size={16} tintColor={roomColors.text} />
        </Pressable>
        <View style={styles.timerPill}>
          <Icon name="clock" size={12} tintColor={roomColors.text} />
          <Text style={styles.timerText}>
            Starts in: {minutes}:{String(seconds).padStart(2, '0')}s
          </Text>
        </View>
      </View>

      <View style={styles.center}>
        <View style={styles.cameraCircle}>
          <Icon name="video.fill" size={30} tintColor={roomColors.text} />
        </View>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.subtitle}>
          {session.host} · {session.dateLabel}
        </Text>

        <View style={styles.waitingCard}>
          <Text style={styles.waitingLabel}>ALSO WAITING</Text>
          <View style={styles.waitingRow}>
            {WAITING_ROOM_PREVIEW.map(person =>
              person.avatarUrl ? (
                <Image key={person.id} source={{ uri: person.avatarUrl }} style={styles.waitingAvatar} />
              ) : (
                <View key={person.id} style={[styles.waitingAvatar, styles.waitingAvatarFallback]}>
                  <Text style={styles.waitingInitials}>{person.initials}</Text>
                </View>
              ),
            )}
            <View style={styles.waitingMore}>
              <Text style={styles.waitingMoreText}>+12</Text>
            </View>
            <Text style={styles.waitingNames} numberOfLines={1}>
              {WAITING_ROOM_PREVIEW.map(p => p.name).join(', ')}
            </Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.leaveButton} onPress={onLeave}>
        <Icon name="phone.down.fill" size={16} tintColor={colors.light.primary[500]} />
        <Text style={styles.leaveButtonText}>Leave waiting room</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: roomColors.bg,
    paddingHorizontal: 20,
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
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: roomColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  timerText: {
    color: roomColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cameraCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(102,96,224,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: roomColors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: roomColors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  waitingCard: {
    marginTop: 32,
    backgroundColor: roomColors.surface,
    borderRadius: 18,
    padding: 16,
    width: '100%',
    gap: 10,
  },
  waitingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: roomColors.textSoft,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  waitingAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  waitingAvatarFallback: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingInitials: {
    color: roomColors.text,
    fontSize: 10,
    fontWeight: '700',
  },
  waitingMore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingMoreText: {
    color: roomColors.text,
    fontSize: 10,
    fontWeight: '700',
  },
  waitingNames: {
    color: roomColors.textMuted,
    fontSize: 12,
    flexBasis: '100%',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 16,
    marginBottom: 12,
  },
  leaveButtonText: {
    color: '#6660E0',
    fontSize: 15,
    fontWeight: '700',
  },
})
