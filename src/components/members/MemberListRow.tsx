import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { MemberProfile } from '@/types/members'

interface MemberListRowProps {
  member: MemberProfile
  showLocation?: boolean
  isFollowing?: boolean
  onPress?: () => void
  onToggleFollow?: () => void
}

export function MemberListRow({ member, showLocation, isFollowing, onPress, onToggleFollow }: MemberListRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="lg" />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {member.displayName}
          </Text>
          <Text style={styles.handle} numberOfLines={1}>
            {member.handle}
          </Text>
        </View>
        {!!member.occupation && <Text style={styles.occupation}>{member.occupation}</Text>}
        {showLocation && !!member.location && (
          <View style={styles.locationRow}>
            <Icon name="mappin" size={11} tintColor={colors.light.primary[500]} />
            <Text style={styles.locationText}>{member.location}</Text>
          </View>
        )}
        {!!member.mutualFriendCount && (
          <View style={styles.mutualRow}>
            <View style={styles.mutualAvatars}>
              {member.mutualFriendAvatars?.slice(0, 3).map((uri, i) => (
                <Avatar key={uri + i} uri={uri} size="xs" style={styles.mutualAvatar} />
              ))}
            </View>
            <Text style={styles.mutualText}>{member.mutualFriendCount} mutual friends</Text>
          </View>
        )}
      </View>

      <Button
        title={isFollowing ? 'Following' : 'Follow'}
        size="sm"
        variant={isFollowing ? 'primary' : 'secondary'}
        onPress={onToggleFollow}
        style={styles.followButton}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  handle: {
    fontSize: 13,
    color: colors.light.primary[400],
    flexShrink: 1,
  },
  occupation: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  mutualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  mutualAvatars: {
    flexDirection: 'row',
  },
  mutualAvatar: {
    marginLeft: -6,
    borderWidth: 1.5,
    borderColor: colors.light.surface,
  },
  mutualText: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  followButton: {
    borderRadius: 999,
    paddingHorizontal: 16,
  },
})
