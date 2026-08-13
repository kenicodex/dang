import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import type { Channel } from '@/types/community'

interface ChannelCardProps {
  channel: Channel
  onPress?: () => void
  isActive?: boolean
}

export function ChannelCard({ channel, onPress, isActive }: ChannelCardProps) {
  return (
    <Pressable
      style={[styles.item, isActive && styles.itemActive]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{channel.emoji || '💬'}</Text>
      <View style={styles.info}>
        <Text variant="h3" style={styles.name}>{channel.name}</Text>
        <Text variant="caption">{channel.description}</Text>
      </View>
      {channel.unreadCount > 0 && (
        <Badge label={String(channel.unreadCount)} tone="danger" />
      )}
    </Pressable>
  )
}

interface ChannelListProps {
  channels: Channel[]
  activeId?: string
  onSelect?: (channel: Channel) => void
}

export function ChannelList({ channels, activeId, onSelect }: ChannelListProps) {
  return (
    <View style={styles.list}>
      {channels.map(ch => (
        <ChannelCard
          key={ch.id}
          channel={ch}
          isActive={activeId === ch.id}
          onPress={() => onSelect?.(ch)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 12,
  },
  itemActive: {
    backgroundColor: '#E6F4FE',
  },
  emoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
  },
})
