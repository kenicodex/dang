import { useState } from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { GlassView } from '@/components/ui/GlassView'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostCard } from '@/components/community'
import { MOCK_PROFILE, PROFILE_MEDIA, PROFILE_POSTS, PROFILE_REPOSTS } from '@/components/account/profile.data'
import { useMe } from '@/api/hooks/users.hooks'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { Post } from '@/types/community'

type ProfileTab = 'posts' | 'reposts' | 'media'

const COVER_HEIGHT = 300
const AVATAR_OVERLAP = 48

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function formatJoined(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

export default function ProfileScreen() {
  useMe()
  const authUser = useAuthStore(s => s.user)
  const profile = authUser ?? MOCK_PROFILE
  const [tab, setTab] = useState<ProfileTab>('posts')

  const handlePostPress = (post: Post) => router.push(`/(community)/thread/${post.id}`)

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverWrap}>
          <Image source={{ uri: profile.coverImageUrl }} style={styles.cover} contentFit="cover" />
          <LinearGradient colors={['rgba(255,255,255,0)', colors.light.bg]} style={styles.coverFade} />

          <SafeAreaView edges={['top']} style={styles.coverBar}>
            <GlassView style={styles.circleButtonGlass} radius="full" glassEffectStyle="clear" isInteractive>
              <Pressable style={styles.circleButtonInner} onPress={() => router.back()}>
                <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
              </Pressable>
            </GlassView>
            <GlassView style={styles.circleButtonGlass} radius="full" glassEffectStyle="clear" isInteractive>
              <Pressable style={styles.circleButtonInner} onPress={() => router.push('/(community)/search')}>
                <Icon name="magnifyingglass" size={16} tintColor={colors.light.neutral.white} />
              </Pressable>
            </GlassView>
          </SafeAreaView>

          <View style={styles.avatarWrap}>
            <Avatar uri={profile.avatarUrl} initials={profile.displayName.slice(0, 2).toUpperCase()} size="xl" />
          </View>
        </View>

        <View style={styles.body}>
          <Text variant="h2" style={styles.name}>
            {profile.displayName}
          </Text>
          <Text style={styles.handle}>{profile.handle}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statAvatars}>
                <Avatar uri={`https://picsum.photos/seed/${profile.id}-following-1/80/80`} size="xs" style={styles.statAvatar} />
                <Avatar
                  uri={`https://picsum.photos/seed/${profile.id}-following-2/80/80`}
                  size="xs"
                  style={[styles.statAvatar, styles.statAvatarOverlap]}
                />
              </View>
              <Text style={styles.statText}>
                <Text style={styles.statNumber}>{formatCount(profile.followingCount ?? 0)}</Text> Following
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statAvatars}>
                <Avatar uri={`https://picsum.photos/seed/${profile.id}-follower-1/80/80`} size="xs" style={styles.statAvatar} />
                <Avatar
                  uri={`https://picsum.photos/seed/${profile.id}-follower-2/80/80`}
                  size="xs"
                  style={[styles.statAvatar, styles.statAvatarOverlap]}
                />
              </View>
              <Text style={styles.statText}>
                <Text style={styles.statNumber}>{formatCount(profile.followerCount ?? 0)}</Text> Followers
              </Text>
            </View>
          </View>

          {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          <View style={styles.metaRow}>
            {!!profile.website && (
              <View style={styles.metaItem}>
                <Icon name="link" size={13} tintColor={colors.light.textSoft} />
                <Text style={styles.metaText}>{profile.website}</Text>
              </View>
            )}
            {!!profile.location && (
              <View style={styles.metaItem}>
                <Icon name="mappin" size={13} tintColor={colors.light.textSoft} />
                <Text style={styles.metaText}>{profile.location}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Icon name="calendar" size={13} tintColor={colors.light.textSoft} />
              <Text style={styles.metaText}>Joined {formatJoined(profile.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Button
              title="Edit Profile"
              icon={<Icon name="pencil" size={15} tintColor={colors.light.neutral.white} />}
              style={styles.editButton}
              onPress={() => router.push('/(account)/profile/edit')}
            />
            <Pressable style={styles.shareButton}>
              <Icon name="paperplane" size={17} tintColor={colors.light.text} />
            </Pressable>
          </View>
        </View>

        <Tabs
          tabs={[
            { value: 'posts', label: 'Posts', icon: 'pencil' },
            { value: 'reposts', label: 'Reposts', icon: 'arrow.2.squarepath' },
            { value: 'media', label: 'Media', icon: 'photo.on.rectangle' },
          ]}
          value={tab}
          onChange={setTab}
          style={styles.tabsRow}
        />

        <View style={styles.tabContent}>
          {tab === 'posts' &&
            (PROFILE_POSTS.length === 0 ? (
              <EmptyState title="No post yet 🌱" />
            ) : (
              PROFILE_POSTS.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPress={() => handlePostPress(post)}
                  onLike={() => {}}
                  onReply={() => {}}
                  onRepost={() => {}}
                  onBookmark={() => {}}
                  onShare={() => {}}
                />
              ))
            ))}

          {tab === 'reposts' &&
            (PROFILE_REPOSTS.length === 0 ? (
              <EmptyState title="No reposts yet" />
            ) : (
              PROFILE_REPOSTS.map(post => (
                <View key={post.id} style={styles.repostWrap}>
                  <View style={styles.repostLabelRow}>
                    <Icon name="arrow.2.squarepath" size={13} tintColor={colors.light.textSoft} />
                    <Text style={styles.repostLabel}>Reposted</Text>
                  </View>
                  <PostCard
                    post={post}
                    onPress={() => handlePostPress(post)}
                    onLike={() => {}}
                    onReply={() => {}}
                    onRepost={() => {}}
                    onBookmark={() => {}}
                    onShare={() => {}}
                  />
                </View>
              ))
            ))}

          {tab === 'media' &&
            (PROFILE_MEDIA.length === 0 ? (
              <EmptyState title="No media yet" />
            ) : (
              <View style={styles.mediaGrid}>
                {PROFILE_MEDIA.map(item => (
                  <View key={item.id} style={styles.mediaTile}>
                    <Image source={{ uri: item.url }} style={styles.mediaImage} contentFit="cover" />
                    {item.type === 'video' && (
                      <View style={styles.mediaPlayBadge}>
                        <Icon name="play.fill" size={12} tintColor={colors.light.neutral.white} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/(community)/create-post')}>
        <Icon name="plus" size={22} tintColor={colors.light.neutral.white} weight="bold" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverWrap: {
    height: COVER_HEIGHT + AVATAR_OVERLAP,
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COVER_HEIGHT,
  },
  coverFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: AVATAR_OVERLAP,
    height: 110,
  },
  coverBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  circleButtonGlass: {
    width: 36,
    height: 36,
  },
  circleButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    position: 'absolute',
    left: 20,
    top: COVER_HEIGHT - AVATAR_OVERLAP,
    padding: 4,
    backgroundColor: colors.light.bg,
    borderRadius: 999,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  name: {
    fontSize: 22,
  },
  handle: {
    fontSize: 14,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 14,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statAvatars: {
    flexDirection: 'row',
  },
  statAvatar: {
    borderWidth: 1.5,
    borderColor: colors.light.bg,
  },
  statAvatarOverlap: {
    marginLeft: -8,
  },
  statText: {
    fontSize: 14,
    color: colors.light.textMuted,
  },
  statNumber: {
    fontWeight: '700',
    color: colors.light.text,
  },
  bio: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.light.textAlt,
    marginTop: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  editButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 4,
  },
  repostWrap: {
    marginBottom: 4,
  },
  repostLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
    marginBottom: 6,
  },
  repostLabel: {
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
    width: '32.5%',
    aspectRatio: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceAlt,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlayBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
})
