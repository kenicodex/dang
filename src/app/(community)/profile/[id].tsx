import { useMemo, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Text } from '@/components/ui/Text'
import { PostCard } from '@/components/community/PostCard'
import { findMember } from '@/components/members/members.data'
import { getProfileMedia, getProfilePosts, getProfileReplies, getProfileReposts } from '@/components/members/profileContent'
import { SPACES } from '@/components/community/spaces.data'
import { useCommunityStore } from '@/store/useCommunityStore'
import { useMembersStore } from '@/store/useMembersStore'
import { colors } from '@/theme/colors'

type ProfileTab = 'posts' | 'replies' | 'media' | 'reposts'

function formatJoined(date: Date) {
  return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const member = findMember(id ?? '')
  const [tab, setTab] = useState<ProfileTab>('posts')

  const followingIds = useMembersStore(s => s.followingIds)
  const toggleFollow = useMembersStore(s => s.toggleFollow)
  const joinedSpaceIds = useCommunityStore(s => s.joinedSpaceIds)

  const isFollowing = member ? followingIds.includes(member.id) : false

  const commonSpaceCount = useMemo(() => {
    if (!member) return 0
    return SPACES.filter(space => joinedSpaceIds.includes(space.id) && !!member.joinedSpaceIds?.includes(space.id))
      .length
  }, [member, joinedSpaceIds])

  const posts = useMemo(() => (member ? getProfilePosts(member) : []), [member])
  const replies = useMemo(() => (member ? getProfileReplies(member) : []), [member])
  const reposts = useMemo(() => (member ? getProfileReposts(member) : []), [member])
  const media = useMemo(() => (member ? getProfileMedia(member) : []), [member])

  if (!member) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.headerButtons}>
          <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
          </Pressable>
        </View>
        <Text style={styles.empty}>This profile is no longer available.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrap}>
          <Image source={{ uri: member.coverImageUrl }} style={styles.cover} contentFit="cover" />
          <LinearGradient
            colors={['rgba(255,255,255,0)', colors.light.bg]}
            style={styles.coverFade}
          />
          <View style={styles.coverHeader}>
            <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
              <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
            </Pressable>
            <View style={styles.coverHeaderRight}>
              <Pressable style={styles.iconButton} onPress={() => router.push('/(community)/sisters-search')}>
                <Icon name="magnifyingglass" size={16} tintColor={colors.light.text} />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Icon name="ellipsis" size={16} tintColor={colors.light.text} />
              </Pressable>
            </View>
          </View>
          <View style={styles.avatarWrap}>
            <Avatar uri={member.avatarUrl} initials={member.displayName.slice(0, 2)} size="xl" ring />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{member.displayName}</Text>
            {member.isVerified && (
              <Icon name="checkmark.seal.fill" size={16} tintColor={colors.light.primary[500]} />
            )}
          </View>
          <Text style={styles.handle}>{member.handle}</Text>

          <View style={styles.statsRow}>
            <Pressable style={styles.statItem} onPress={() => router.push(`/(community)/profile/${member.id}/following`)}>
              <Text style={styles.statCount}>{member.followingCount ?? 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>
            <Pressable style={styles.statItem} onPress={() => router.push(`/(community)/profile/${member.id}/followers`)}>
              <Text style={styles.statCount}>{member.followerCount ?? 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>
          </View>

          {!!member.bio && <Text style={styles.bio}>{member.bio}</Text>}

          <View style={styles.metaRow}>
            {!!member.location && (
              <View style={styles.metaItem}>
                <Icon name="mappin" size={12} tintColor={colors.light.textSoft} />
                <Text style={styles.metaText}>{member.location}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Icon name="calendar" size={12} tintColor={colors.light.textSoft} />
              <Text style={styles.metaText}>{formatJoined(member.joinedAt)}</Text>
            </View>
          </View>

          <View style={styles.commonRow}>
            {!!member.mutualFriendCount && (
              <View style={styles.mutualItem}>
                <View style={styles.mutualAvatars}>
                  {member.mutualFriendAvatars?.slice(0, 3).map((uri, i) => (
                    <Avatar key={uri + i} uri={uri} size="xs" style={styles.mutualAvatar} />
                  ))}
                </View>
                <Text style={styles.commonText}>{member.mutualFriendCount} Mutual friends</Text>
              </View>
            )}
            <Pressable style={styles.spacesItem} onPress={() => router.push(`/(community)/profile/${member.id}/spaces`)}>
              <Icon name="person.2" size={13} tintColor={colors.light.textSoft} />
              <Text style={styles.commonText}>{commonSpaceCount} spaces in common</Text>
              <Icon name="chevron.right" size={13} tintColor={colors.light.textSoft} />
            </Pressable>
          </View>

          {isFollowing ? (
            <View style={styles.actionRow}>
              <Button
                title="Following"
                variant="outline"
                onPress={() => toggleFollow(member.id)}
                style={styles.actionButton}
              />
              <Button title="Message" onPress={() => {}} style={styles.actionButton} />
            </View>
          ) : (
            <Button title="Follow" onPress={() => toggleFollow(member.id)} style={styles.followButton} />
          )}

          <Tabs
            tabs={[
              { value: 'posts', label: 'Posts' },
              { value: 'replies', label: 'Replies' },
              { value: 'media', label: 'Media' },
              { value: 'reposts', label: 'Reposts' },
            ]}
            value={tab}
            onChange={setTab}
            style={styles.tabs}
          />

          <View style={styles.tabContent}>
            {tab === 'posts' &&
              posts.map(post => <PostCard key={post.id} post={post} onLike={() => {}} onReply={() => {}} onRepost={() => {}} onBookmark={() => {}} onShare={() => {}} />)}

            {tab === 'replies' &&
              replies.map(post => <PostCard key={post.id} post={post} onLike={() => {}} onReply={() => {}} onRepost={() => {}} onBookmark={() => {}} onShare={() => {}} />)}

            {tab === 'reposts' &&
              reposts.map(post => (
                <View key={post.id} style={styles.repostWrap}>
                  <View style={styles.repostLabel}>
                    <Icon name="arrow.2.squarepath" size={12} tintColor={colors.light.textSoft} />
                    <Text style={styles.repostLabelText}>Reposted by {member.displayName}</Text>
                  </View>
                  <PostCard post={post} onLike={() => {}} onReply={() => {}} onRepost={() => {}} onBookmark={() => {}} onShare={() => {}} />
                </View>
              ))}

            {tab === 'media' && (
              <View style={styles.mediaGrid}>
                {media.map(item => (
                  <View key={item.id} style={styles.mediaTile}>
                    <Image source={{ uri: item.url }} style={styles.mediaImage} contentFit="cover" />
                    {item.isVideo && (
                      <View style={styles.playButton}>
                        <Icon name="play.fill" size={14} tintColor={colors.light.neutral.white} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const AVATAR_XL = 96

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  headerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  coverWrap: {
    height: 200,
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light.primary[100],
  },
  coverFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  coverHeader: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coverHeaderRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    position: 'absolute',
    left: 20,
    bottom: -AVATAR_XL / 2,
    width: AVATAR_XL,
    height: AVATAR_XL,
    borderRadius: AVATAR_XL / 2,
    backgroundColor: colors.light.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: AVATAR_XL / 2 + 12,
    paddingBottom: 40,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.light.text,
  },
  handle: {
    fontSize: 14,
    color: colors.light.textMuted,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statCount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.light.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textAlt,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
  commonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  mutualItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mutualAvatars: {
    flexDirection: 'row',
  },
  mutualAvatar: {
    marginLeft: -6,
    borderWidth: 1.5,
    borderColor: colors.light.bg,
  },
  spacesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commonText: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
  },
  followButton: {
    borderRadius: 999,
    marginBottom: 20,
  },
  tabs: {
    marginBottom: 16,
  },
  tabContent: {
    gap: 12,
  },
  repostWrap: {
    gap: 6,
  },
  repostLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  repostLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textSoft,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  mediaTile: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -14,
    marginLeft: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
    paddingHorizontal: 20,
  },
})
