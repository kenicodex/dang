import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import type { Invite } from '@/types/circles'

interface CircleInviteCardProps {
  invite: Invite
  onAccept?: () => void
  onDecline?: () => void
}

export function CircleInviteCard({ invite, onAccept, onDecline }: CircleInviteCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar
          uri={invite.invitedBy?.avatarUrl}
          initials={invite.invitedBy?.displayName?.slice(0, 2)}
          size="md"
        />
        <View style={styles.info}>
          <Text variant="h3" style={styles.circleName}>{invite.circleName}</Text>
          <Text variant="caption">
            Invited by {invite.invitedBy?.displayName} · {invite.sentAt}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="Decline" variant="ghost" size="sm" onPress={onDecline} style={styles.declineBtn} />
        <Button title="Accept" variant="primary" size="sm" onPress={onAccept} />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  info: {
    flex: 1,
  },
  circleName: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  declineBtn: {
    color: '#6B7280',
  },
})
