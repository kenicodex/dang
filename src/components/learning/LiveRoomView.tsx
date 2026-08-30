import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { useAuthStore } from '@/store'
import { RoomChatPanel, RoomControlBar, RoomPeoplePanel, RoomVideoTile, roomColors } from './RoomChrome'
import { ROOM_ATTENDEE_LIST, ROOM_CHAT, REPLAY_TILES, type SessionEntry } from './liveSession.data'

interface LiveRoomViewProps {
  session: SessionEntry
  onLeave: () => void
}

export function LiveRoomView({ session, onLeave }: LiveRoomViewProps) {
  const user = useAuthStore(s => s.user)
  const [micOn, setMicOn] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [panel, setPanel] = useState<'chat' | 'people' | null>(null)

  const host = ROOM_ATTENDEE_LIST[0]
  const self = {
    id: 'self',
    name: `${user?.displayName ?? 'Amy Johnson'} (You)`,
    initials: (user?.displayName ?? 'Amy Johnson').slice(0, 2).toUpperCase(),
    micOn,
    cameraOn,
    tileColor: '#5B8C7E',
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable style={styles.closeButton} onPress={onLeave} hitSlop={8}>
          <Icon name="xmark" size={16} tintColor={roomColors.text} />
        </Pressable>
        <View style={styles.topRight}>
          <View style={styles.countPill}>
            <Icon name="person.2.fill" size={12} tintColor={roomColors.text} />
            <Text style={styles.countText}>{session.participantCount}</Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sessionTitle}>{session.title}</Text>

      <ScrollView style={styles.grid} contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
        <RoomVideoTile participant={host} size="main" />
        <View style={styles.gridRow}>
          <RoomVideoTile participant={self} selfLabel={self.name} />
          {REPLAY_TILES.slice(0, 1).map(p => (
            <RoomVideoTile key={p.id} participant={p} />
          ))}
        </View>
        <View style={styles.gridRow}>
          {REPLAY_TILES.slice(1, 3).map(p => (
            <RoomVideoTile key={p.id} participant={p} />
          ))}
        </View>
      </ScrollView>

      <RoomControlBar
        micOn={micOn}
        cameraOn={cameraOn}
        handRaised={handRaised}
        hasUnreadChat
        onToggleMic={() => setMicOn(v => !v)}
        onToggleCamera={() => setCameraOn(v => !v)}
        onToggleHand={() => setHandRaised(v => !v)}
        onOpenChat={() => setPanel('chat')}
        onOpenPeople={() => setPanel('people')}
        onLeave={onLeave}
      />

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
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: roomColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  countText: {
    color: roomColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E11D48',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  sessionTitle: {
    color: roomColors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 14,
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    gap: 10,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
})
