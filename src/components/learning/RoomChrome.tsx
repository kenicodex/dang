import React, { ReactNode } from 'react'
import { Image } from 'expo-image'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { ChatMessage, RoomParticipant } from './liveSession.data'

export const roomColors = {
  bg: '#120B21',
  panel: '#1B1330',
  surface: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.14)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.65)',
  textSoft: 'rgba(255,255,255,0.4)',
}

interface RoomVideoTileProps {
  participant: RoomParticipant
  size?: 'main' | 'grid'
  selfLabel?: string
}

export function RoomVideoTile({ participant, size = 'grid', selfLabel }: RoomVideoTileProps) {
  const label = selfLabel ?? participant.name

  return (
    <View style={[styles.tile, size === 'main' && styles.tileMain]}>
      {participant.cameraOn && participant.avatarUrl ? (
        <Image source={{ uri: participant.avatarUrl }} style={styles.tileImage} contentFit="cover" />
      ) : (
        <View style={[styles.tileFallback, { backgroundColor: participant.tileColor }]}>
          <Text style={styles.tileInitials}>{participant.initials}</Text>
        </View>
      )}

      <View style={styles.tileLabelRow}>
        <View style={styles.tileLabel}>
          {participant.isHost && <View style={styles.hostDot} />}
          <Text style={styles.tileLabelText} numberOfLines={1}>
            {label}
            {participant.isHost ? ' · Host' : ''}
          </Text>
        </View>
        <View style={styles.micBadge}>
          <Icon
            name={participant.micOn ? 'mic.fill' : 'mic.slash.fill'}
            size={11}
            tintColor={participant.micOn ? roomColors.text : colors.light.semantic.error}
          />
        </View>
      </View>
    </View>
  )
}

interface ControlButtonProps {
  icon: SymbolViewProps['name']
  label: string
  active?: boolean
  danger?: boolean
  badge?: boolean
  onPress?: () => void
}

export function RoomControlButton({ icon, label, active, danger, badge, onPress }: ControlButtonProps) {
  return (
    <Pressable style={styles.controlButton} onPress={onPress}>
      <View style={[styles.controlCircle, active && styles.controlCircleActive, danger && styles.controlCircleDanger]}>
        <Icon name={icon} size={18} tintColor={danger ? '#FFFFFF' : roomColors.textMuted} />
        {badge && <View style={styles.controlBadge} />}
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  )
}

interface RoomControlBarProps {
  micOn: boolean
  cameraOn: boolean
  handRaised: boolean
  hasUnreadChat?: boolean
  onToggleMic: () => void
  onToggleCamera: () => void
  onToggleHand: () => void
  onOpenChat: () => void
  onOpenPeople: () => void
  onLeave: () => void
}

export function RoomControlBar({
  micOn,
  cameraOn,
  handRaised,
  hasUnreadChat,
  onToggleMic,
  onToggleCamera,
  onToggleHand,
  onOpenChat,
  onOpenPeople,
  onLeave,
}: RoomControlBarProps) {
  return (
    <View style={styles.controlBar}>
      <RoomControlButton icon={micOn ? 'mic.fill' : 'mic.slash.fill'} label={micOn ? 'Mute' : 'Unmute'} active={micOn} onPress={onToggleMic} />
      <RoomControlButton icon={cameraOn ? 'video.fill' : 'video.slash.fill'} label="Camera" active={cameraOn} onPress={onToggleCamera} />
      <RoomControlButton icon="hand.raised.fill" label="Hand" active={handRaised} onPress={onToggleHand} />
      <RoomControlButton icon="bubble.left.fill" label="Chat" badge={hasUnreadChat} onPress={onOpenChat} />
      <RoomControlButton icon="person.2.fill" label="People" onPress={onOpenPeople} />
      <RoomControlButton icon="phone.down.fill" label="Leave" danger onPress={onLeave} />
    </View>
  )
}

interface RoomPanelProps {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function RoomPanel({ title, onClose, children, footer }: RoomPanelProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.panel}>
      <View style={styles.panelHandle} />
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>{title}</Text>
        <Pressable hitSlop={8} onPress={onClose}>
          <Icon name="xmark" size={16} tintColor={roomColors.textMuted} />
        </Pressable>
      </View>
      <View style={styles.panelDivider} />
      <ScrollView style={styles.panelBody} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  )
}

interface RoomChatPanelProps {
  messages: ChatMessage[]
  onClose: () => void
}

export function RoomChatPanel({ messages, onClose }: RoomChatPanelProps) {
  return (
    <RoomPanel
      title="Chat"
      onClose={onClose}
      footer={
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Message everyone..."
            placeholderTextColor={roomColors.textSoft}
          />
          <Pressable style={styles.chatSendButton} hitSlop={8}>
            <Icon name="paperplane.fill" size={16} tintColor={roomColors.text} />
          </Pressable>
        </View>
      }
    >
      <View style={styles.chatList}>
        {messages.map(message => (
          <View key={message.id} style={styles.chatRow}>
            {message.avatarUrl ? (
              <Image source={{ uri: message.avatarUrl }} style={styles.chatAvatar} />
            ) : (
              <View style={[styles.chatAvatar, styles.chatAvatarFallback]} />
            )}
            <View style={styles.chatBody}>
              <Text style={styles.chatName}>{message.name}</Text>
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>{message.text}</Text>
              </View>
              <Text style={styles.chatTime}>{message.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </RoomPanel>
  )
}

interface RoomPeoplePanelProps {
  participants: RoomParticipant[]
  onClose: () => void
}

export function RoomPeoplePanel({ participants, onClose }: RoomPeoplePanelProps) {
  return (
    <RoomPanel title="Participants" onClose={onClose}>
      <View style={styles.peopleList}>
        {participants.map(person => (
          <View key={person.id} style={styles.peopleRow}>
            {person.avatarUrl ? (
              <Image source={{ uri: person.avatarUrl }} style={styles.peopleAvatar} />
            ) : (
              <View style={[styles.peopleAvatar, styles.chatAvatarFallback]}>
                <Text style={styles.tileInitials}>{person.initials}</Text>
              </View>
            )}
            <View style={styles.peopleInfo}>
              <Text style={styles.peopleName}>{person.name}</Text>
              {person.isHost && <Text style={styles.peopleRole}>Host</Text>}
            </View>
            <Icon
              name={person.micOn ? 'mic.fill' : 'mic.slash.fill'}
              size={16}
              tintColor={person.micOn ? colors.light.semantic.success : colors.light.semantic.error}
            />
            <Icon
              name={person.cameraOn ? 'video.fill' : 'video.slash.fill'}
              size={16}
              tintColor={person.cameraOn ? roomColors.textMuted : roomColors.textSoft}
            />
          </View>
        ))}
      </View>
    </RoomPanel>
  )
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: roomColors.surface,
    position: 'relative',
  },
  tileMain: {
    aspectRatio: 16 / 11,
  },
  tileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  tileFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileInitials: {
    color: roomColors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  tileLabelRow: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  tileLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 1,
  },
  hostDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.light.semantic.success,
  },
  tileLabelText: {
    color: roomColors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  micBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBar: {
    flexDirection: 'row',
    backgroundColor: roomColors.panel,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  controlButton: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  controlCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: roomColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  controlCircleDanger: {
    backgroundColor: colors.light.semantic.error,
  },
  controlBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.primary[400],
  },
  controlLabel: {
    fontSize: 10,
    color: roomColors.textMuted,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: roomColors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingHorizontal: 20,
    ...shadows.xl,
  },
  panelHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: roomColors.border,
    marginTop: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: roomColors.text,
  },
  panelDivider: {
    height: 1,
    backgroundColor: roomColors.border,
  },
  panelBody: {
    paddingVertical: 12,
  },
  chatList: {
    gap: 16,
    paddingBottom: 8,
  },
  chatRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chatAvatarFallback: {
    backgroundColor: roomColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBody: {
    flex: 1,
  },
  chatName: {
    fontSize: 12,
    fontWeight: '700',
    color: roomColors.textMuted,
    marginBottom: 4,
  },
  chatBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 19,
  },
  chatTime: {
    fontSize: 10,
    color: roomColors.textSoft,
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  chatInput: {
    flex: 1,
    backgroundColor: roomColors.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: roomColors.text,
    fontSize: 14,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  peopleList: {
    gap: 18,
    paddingBottom: 12,
  },
  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  peopleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  peopleInfo: {
    flex: 1,
  },
  peopleName: {
    fontSize: 15,
    fontWeight: '600',
    color: roomColors.text,
  },
  peopleRole: {
    fontSize: 12,
    color: roomColors.textMuted,
    marginTop: 1,
  },
})
