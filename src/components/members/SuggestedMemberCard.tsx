import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { MemberProfile } from '@/types/members'

interface SuggestedMemberCardProps {
  member: MemberProfile
  onPress?: () => void
  onDismiss?: () => void
  onToggleFollow?: () => void
}

export function SuggestedMemberCard({ member, onPress, onDismiss, onToggleFollow }: SuggestedMemberCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.coverWrap}>
        {member.coverImageUrl ? (
          <Image source={{ uri: member.coverImageUrl }} style={styles.cover} contentFit="cover" />
        ) : (
          <View style={[styles.cover, styles.coverFallback]} />
        )}
        <Pressable style={styles.dismissButton} onPress={onDismiss} hitSlop={6}>
          <Icon name="xmark" size={11} tintColor={colors.light.neutral.white} weight="bold" />
        </Pressable>
        <View style={styles.avatarRing}>
          <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="md" />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {member.displayName}
        </Text>
        {member.occupation && (
          <Text style={styles.occupation} numberOfLines={1}>
            {member.occupation}
          </Text>
        )}
        {member.location && (
          <View style={styles.locationRow}>
            <Icon name="mappin" size={11} tintColor={colors.light.primary[500]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {member.location}
            </Text>
          </View>
        )}

        {!!member.mutualFriendCount && (
          <View style={styles.mutualRow}>
            <View style={styles.mutualAvatars}>
              {member.mutualFriendAvatars?.slice(0, 3).map((uri, i) => (
                <Avatar key={uri + i} uri={uri} size="xs" style={styles.mutualAvatar} />
              ))}
            </View>
            <Text style={styles.mutualText} numberOfLines={2}>
              {member.mutualFriendCount} mutual friends
            </Text>
          </View>
        )}

        <Button
          title={member.isFollowing ? 'Following' : 'Follow'}
          size="sm"
          variant={member.isFollowing ? 'primary' : 'secondary'}
          onPress={onToggleFollow}
          style={[styles.followButtonBase, member.isFollowing && styles.followButtonActive]}
        />
      </View>
    </Pressable>
  )
}

const AVATAR_SIZE = 44
const RING_SIZE = AVATAR_SIZE + 6

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    ...shadows.sm,
  },
  coverWrap: {
    height: 76,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    backgroundColor: colors.light.primary[100],
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    position: 'absolute',
    bottom: -RING_SIZE / 2,
    left: 10,
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: RING_SIZE / 2 + 8,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  occupation: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  mutualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
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
    flex: 1,
    fontSize: 10.5,
    lineHeight: 13,
    color: colors.light.textMuted,
  },
  followButtonBase: {
    alignSelf: 'stretch',
    borderRadius: 999,
    marginTop: 4,
  },
  followButtonActive: {
    backgroundColor: colors.light.primary[500],
  },
})
