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

interface NearbyMemberCardProps {
  member: MemberProfile
  onPress?: () => void
  onDismiss?: () => void
  onToggleFollow?: () => void
}

export function NearbyMemberCard({ member, onPress, onDismiss, onToggleFollow }: NearbyMemberCardProps) {
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
      </View>

      <View style={styles.avatarRing}>
        <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="lg" />
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
          <View style={styles.locationPill}>
            <Icon name="mappin" size={10} tintColor={colors.light.primary[600]} />
            <Text style={styles.locationText}>{member.location}</Text>
          </View>
        )}

        <Button
          title={member.isFollowing ? 'Following' : 'Follow'}
          size="sm"
          variant={member.isFollowing ? 'outline' : 'primary'}
          onPress={onToggleFollow}
          style={[styles.followButtonBase, !member.isFollowing && styles.followButtonActive]}
        />
      </View>
    </Pressable>
  )
}

const AVATAR_SIZE = 64
const RING_SIZE = AVATAR_SIZE + 6

const styles = StyleSheet.create({
  card: {
    width: 152,
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    ...shadows.sm,
  },
  coverWrap: {
    height: 88,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    position: 'absolute',
    top: 88 - RING_SIZE / 2,
    left: '50%',
    marginLeft: -RING_SIZE / 2,
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 14,
    paddingTop: RING_SIZE / 2 + 6,
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
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.light.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.primary[600],
  },
  followButtonBase: {
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  followButtonActive: {
    backgroundColor: colors.light.primary[500],
  },
})
