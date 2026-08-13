import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { SymbolView } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Sheet } from '@/components/ui/Sheet'
import { PostCard } from '@/components/community/PostCard'
import { PostComposer } from '@/components/community/PostComposer'
import { JoinSpaceModal } from '@/components/community/JoinSpaceModal'
import { CATEGORY_STYLE, SPACES, SPACE_POSTS } from '@/components/community/spaces.data'
import { useCommunityStore } from '@/store'
import { colors } from '@/theme/colors'
import type { Post } from '@/types/community'

type DetailTab = 'trending' | 'media' | 'about'

function formatMemberCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

export default function SpaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const space = useMemo(() => SPACES.find(s => s.id === id), [id])

  const joinedSpaceIds = useCommunityStore(s => s.joinedSpaceIds)
  const joinSpace = useCommunityStore(s => s.joinSpace)
  const isJoined = !!space && joinedSpaceIds.includes(space.id)

  const [tab, setTab] = useState<DetailTab>('trending')
  const [rulesVisible, setRulesVisible] = useState(false)
  const [composerVisible, setComposerVisible] = useState(false)
  const [posts, setPosts] = useState<Post[]>(space ? SPACE_POSTS[space.id] ?? [] : [])

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
    setComposerVisible(true)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={style.gradient} style={styles.banner}>
          <SafeAreaView edges={['top']} style={styles.bannerBar}>
            <Pressable style={styles.circleButton} onPress={() => router.back()}>
              <SymbolView name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
            </Pressable>
            <Pressable style={styles.circleButton} onPress={() => router.push('/(community)/search')}>
              <SymbolView name="magnifyingglass" size={16} tintColor={colors.light.neutral.white} />
            </Pressable>
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
              <Button title="Joined" variant="outline" style={styles.actionButton} />
            ) : (
              <Button
                title="Join Space"
                style={[styles.actionButton, styles.joinButton]}
                onPress={() => setRulesVisible(true)}
              />
            )}
          </View>

          <View style={styles.tabRow}>
            <Pressable style={styles.tabItem} onPress={() => setTab('trending')}>
              <View style={styles.tabLabelRow}>
                <Text style={[styles.tabLabel, tab === 'trending' && styles.tabLabelActive]}>Trending</Text>
                <SymbolView
                  name="chevron.down"
                  size={12}
                  tintColor={tab === 'trending' ? colors.light.text : colors.light.textSoft}
                />
              </View>
              {tab === 'trending' && <View style={styles.tabIndicator} />}
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => setTab('media')}>
              <Text style={[styles.tabLabel, tab === 'media' && styles.tabLabelActive]}>Media</Text>
              {tab === 'media' && <View style={styles.tabIndicator} />}
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => setTab('about')}>
              <Text style={[styles.tabLabel, tab === 'about' && styles.tabLabelActive]}>About</Text>
              {tab === 'about' && <View style={styles.tabIndicator} />}
            </Pressable>
          </View>

          <View style={styles.tabContent}>
            {tab === 'trending' &&
              (posts.length > 0 ? (
                posts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <Text style={styles.empty}>No posts yet. Be the first to share something.</Text>
              ))}

            {tab === 'media' && <Text style={styles.empty}>No media shared in this space yet.</Text>}

            {tab === 'about' && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutText}>{space.description}</Text>
                <Text style={styles.aboutSubtitle}>Space Guidelines</Text>
                {(space.guidelines ?? []).map((rule, i) => (
                  <Text key={rule} style={styles.aboutRule}>
                    {i + 1}. {rule}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={onComposePress}>
        <SymbolView name="plus" size={22} tintColor={colors.light.neutral.white} weight="bold" />
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

      <Sheet visible={composerVisible} onClose={() => setComposerVisible(false)} title="New post">
        <PostComposer
          onSubmit={(content, isAnonymous) => {
            setPosts(prev => [
              {
                id: `local-${prev.length + 1}`,
                channelId: space.id,
                channelName: space.name,
                author: { id: 'me', displayName: 'You', handle: '@me' },
                content,
                isAnonymous,
                isPinned: false,
                likeCount: 0,
                replyCount: 0,
                repostCount: 0,
                timeAgo: 'now',
                moderationStatus: 'approved',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              ...prev,
            ])
            setComposerVisible(false)
          }}
        />
      </Sheet>
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
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
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
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tabItem: {
    paddingBottom: 12,
  },
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textSoft,
  },
  tabLabelActive: {
    color: colors.light.text,
  },
  tabIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.light.primary[500],
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
  aboutSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 8,
  },
  aboutRule: {
    fontSize: 14,
    color: colors.light.textMuted,
    lineHeight: 20,
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
