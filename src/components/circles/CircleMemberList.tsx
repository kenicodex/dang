import React from 'react'
import { View, Pressable, StyleSheet, FlatList, FlatListProps } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { CircleMember } from '@/types/circles'

interface CircleMemberItemProps {
  member: CircleMember
  onPress?: () => void
}

export function CircleMemberItem({ member, onPress }: CircleMemberItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Avatar uri={member.avatarUrl} initials={member.displayName?.slice(0, 2)} size="md" />
      <View style={styles.info}>
        <Text variant="h3" style={styles.name}>{member.displayName}</Text>
        <Text variant="caption">{member.joinedAt}</Text>
      </View>
      {member.role === 'leader' && <Badge label="Leader" tone="success" />}
      {member.role === 'moderator' && <Badge label="Mod" tone="info" />}
    </Pressable>
  )
}

interface CircleMemberListProps extends Partial<FlatListProps<CircleMember>> {
  data: CircleMember[]
  onMemberPress?: (member: CircleMember) => void
}

export function CircleMemberList({ data, onMemberPress, ...props }: CircleMemberListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <CircleMemberItem member={item} onPress={() => onMemberPress?.(item)} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
})
