import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { GlassView } from '@/components/ui/GlassView'
import { Tabs } from '@/components/ui/Tabs'
import { PostCard } from '@/components/community/PostCard'
import { JoinSpaceModal } from '@/components/community/JoinSpaceModal'
import { LeaveSpaceSheet } from '@/components/community/LeaveSpaceSheet'
import { CATEGORY_STYLE, SPACES, SPACE_POSTS } from '@/components/community/spaces.data'
import { useCommunityStore } from '@/store'
import { colors } from '@/theme/colors'
import type { ChannelMember } from '@/types/community'

type DetailTab = 'trending' | 'media' | 'about'

function formatMemberCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

function MemberRow({ member, bio }: { member: ChannelMember; bio?: string }) {
  return (
    <View style={styles.memberListRow}>
      <Avatar initials={member.initials} size="md" />
      <View style={styles.memberInfo}>
        <View style={styles.memberTopRow}>
          <View style={styles.memberNames}>
            <Text style={styles.memberName}>{member.displayName}</Text>
            <Text style={styles.memberHandle}>{member.handle}</Text>
          </View>
          <Button title="Follow" size="sm" style={styles.followButton} />
        </View>
        {bio && (
          <Text style={styles.memberBio} numberOfLines={1}>
            {bio}
          </Text>
        )}
      </View>
    </View>
  )
}

export default function SpaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const space = useMemo(() => SPACES.find(s => s.id === id), [id])

  const joinedSpaceIds = useCommunityStore(s => s.joinedSpaceIds)
  const joinSpace = useCommunityStore(s => s.joinSpace)
  const leaveSpace = useCommunityStore(s => s.leaveSpace)
  const isJoined = !!space && joinedSpaceIds.includes(space.id)

  const [tab, setTab] = useState<DetailTab>('trending')
  const [rulesVisible, setRulesVisible] = useState(false)
  const [leaveVisible, setLeaveVisible] = useState(false)
  const [showAllMembers, setShowAllMembers] = useState(false)
  const posts = space ? SPACE_POSTS[space.id] ?? [] : []

  if (!space) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Space not found.</Text>
      </SafeAreaView>
    )
  }

  const style = CATEGORY_STYLE[space.category ?? ''] ?? {
    gradient: [colors.light.primary[300], colors.light.primary[700]] as [string, string],
    emoji: space.emoji ?? '💬',
  }

  const onComposePress = () => {
    if (!isJoined) {
      setRulesVisible(true)
      return
    }
    router.push({ pathname: '/create-post', params: { slug: space.id } })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={style.gradient} style={styles.banner}>
          <SafeAreaView edges={['top']} style={styles.bannerBar}>
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
          <Text style={styles.bannerEmoji}>{style.emoji}</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Text variant="h1" style={styles.name}>
            {space.name}
          </Text>

          <View style={styles.categoryRow}>
            <View style={[styles.dot, { backgroundColor: style.gradient[1] }]} />
            <Text style={styles.categoryText}>{space.category}</Text>
          </View>

          <View style={styles.memberRow}>
            <View style={styles.avatarRow}>
              {(space.memberAvatars ?? []).slice(0, 3).map((initials, i) => (
                <View key={initials + i} style={[styles.avatarWrap, i > 0 && styles.avatarOverlap]}>
                  <Avatar initials={initials} size="xs" />
                </View>
              ))}
            </View>
            <Text style={styles.memberCount}>{formatMemberCount(space.memberCount)} Members</Text>
          </View>

          <Text style={styles.tagline}>{space.tagline}</Text>

          <View style={styles.actionsRow}>
            <Button title="Share" variant="outline" style={styles.actionButton} />
            {isJoined ? (
              <Button
                title="Joined"
                variant="outline"
                style={styles.actionButton}
                onPress={() => setLeaveVisible(true)}
              />
            ) : (
              <Button
                title="Join Space"
                style={[styles.actionButton, styles.joinButton]}
                onPress={() => setRulesVisible(true)}
              />
            )}
          </View>

          <Tabs
            tabs={[
              { value: 'trending', label: 'Trending' },
              { value: 'media', label: 'Media' },
              { value: 'about', label: 'About' },
            ]}
            value={tab}
            onChange={setTab}
            style={styles.tabRow}
          />

          <View style={styles.tabContent}>
            {(tab === 'trending' || tab === 'media') &&
              (posts.length > 0 ? (
                posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPress={() => router.push(`/(community)/thread/${post.id}`)}
                />
              ))
              ) : (
                <Text style={styles.empty}>No posts yet. Be the first to share something.</Text>
              ))}

            {tab === 'about' && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutHeading}>About this space</Text>
                <Text style={styles.aboutText}>{space.description}</Text>

                <View style={styles.aboutDivider} />

                <Text style={styles.aboutHeading}>Space Guidelines</Text>
                {(space.guidelines ?? []).map((rule, i) => (
                  <View key={rule} style={styles.guidelineRow}>
                    <View style={styles.guidelineBubble}>
                      <Text style={styles.guidelineNumber}>{i + 1}</Text>
                    </View>
                    <Text style={styles.aboutRule}>{rule}</Text>
                  </View>
                ))}

                {space.moderator && (
                  <>
                    <View style={styles.aboutDivider} />
                    <Text style={styles.aboutHeading}>Moderated by</Text>
                    <MemberRow member={space.moderator} />
                  </>
                )}

                {!!space.members?.length && (
                  <>
                    <View style={styles.aboutDivider} />
                    <Text style={styles.aboutHeading}>Members</Text>
                    {(showAllMembers ? space.members : space.members.slice(0, 2)).map(member => (
                      <MemberRow key={member.id} member={member} bio={member.bio} />
                    ))}
                    {space.members.length > 2 && (
                      <Pressable onPress={() => setShowAllMembers(v => !v)}>
                        <Text style={styles.seeMore}>{showAllMembers ? 'see less' : 'see more'}</Text>
                      </Pressable>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={onComposePress}>
        <Icon name="plus" size={22} tintColor={colors.light.neutral.white} weight="bold" />
      </Pressable>

      <JoinSpaceModal
        visible={rulesVisible}
        space={space}
        onClose={() => setRulesVisible(false)}
        onAgree={() => {
          joinSpace(space.id)
          setRulesVisible(false)
        }}
      />

      <LeaveSpaceSheet
        visible={leaveVisible}
        spaceName={space.name}
        onClose={() => setLeaveVisible(false)}
        onConfirmLeave={() => leaveSpace(space.id)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  banner: {
    height: 220,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bannerBar: {
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
  bannerEmoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  name: {
    fontSize: 26,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colors.light.textMuted,
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatarWrap: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  memberCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  tagline: {
    fontSize: 15,
    color: colors.light.textMuted,
    marginTop: 12,
    lineHeight: 21,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
  },
  joinButton: {
    backgroundColor: colors.light.primary[500],
  },
  tabRow: {
    marginTop: 24,
  },
  tabContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
  aboutSection: {
    gap: 12,
  },
  aboutText: {
    fontSize: 15,
    color: colors.light.textAlt,
    lineHeight: 22,
  },
  aboutHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 8,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 4,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  guidelineBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  guidelineNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  aboutRule: {
    flex: 1,
    fontSize: 15,
    color: colors.light.textAlt,
    lineHeight: 21,
  },
  memberListRow: {
    flexDirection: 'row',
    gap: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  memberNames: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  memberHandle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  followButton: {
    borderRadius: 999,
  },
  memberBio: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 4,
  },
  seeMore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.primary[500],
    textAlign: 'center',
    marginTop: 4,
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
})
