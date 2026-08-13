import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { Circle } from '@/types/circles'

interface CircleCardProps {
  circle: Circle
  onPress?: () => void
}

export function CircleCard({ circle, onPress }: CircleCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.cover}>
            <Text style={styles.coverEmoji}>{circle.emoji || '🔒'}</Text>
          </View>
          <View style={styles.headerText}>
            <Text variant="h3" style={styles.name}>{circle.name}</Text>
            <Text variant="caption">{circle.memberCount} members</Text>
          </View>
          {circle.isLeader && <Badge label="Leader" tone="success" />}
        </View>
        {circle.description && (
          <Text variant="body" style={styles.description} numberOfLines={2}>
            {circle.description}
          </Text>
        )}
        <View style={styles.members}>
          {circle.memberAvatars?.slice(0, 5).map((uri, i) => (
            <Avatar key={i} uri={uri} size="xs" style={styles.stackAvatar} />
          ))}
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
  },
  description: {
    color: '#6B7280',
    marginBottom: 12,
  },
  members: {
    flexDirection: 'row',
  },
  stackAvatar: {
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
})
