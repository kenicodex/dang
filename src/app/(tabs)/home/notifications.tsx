import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

type NotificationTab = 'all' | 'mentions' | 'updates'
type NotificationDay = 'today' | 'yesterday'

type SocialVariant = 'reply' | 'repost' | 'like' | 'mention'
type UpdateVariant = 'session' | 'course-complete' | 'anon-live' | 'anon-rejected' | 'streak' | 'subscription' | 'drop' | 'tester'
type NotificationVariant = SocialVariant | UpdateVariant | 'follow'

interface NotificationItem {
  id: string
  variant: NotificationVariant
  day: NotificationDay
  timeAgo: string
  unread: boolean
  actorName?: string
  actorAvatarSeed?: string
  title: string
  body?: string
  promoImage?: boolean
}

const SOCIAL_VARIANTS: NotificationVariant[] = ['reply', 'repost', 'like', 'mention']

const SOCIAL_BADGE: Record<SocialVariant, { icon: SymbolViewProps['name']; bg: string }> = {
  reply: { icon: 'bubble.left.fill', bg: colors.light.primary[500] },
  repost: { icon: 'arrow.2.squarepath', bg: colors.light.primary[500] },
  like: { icon: 'heart.fill', bg: colors.light.semantic.error },
  mention: { icon: 'at', bg: colors.light.primary[500] },
}

const UPDATE_ICON: Record<UpdateVariant, { emoji?: string; symbol?: SymbolViewProps['name']; bg: string; tint?: string }> = {
  session: { symbol: 'graduationcap.fill', bg: colors.light.primary[100], tint: colors.light.primary[600] },
  'course-complete': { symbol: 'graduationcap.fill', bg: colors.light.primary[100], tint: colors.light.primary[600] },
  'anon-live': { symbol: 'shield.fill', bg: colors.light.semantic.error, tint: colors.light.neutral.white },
  'anon-rejected': { symbol: 'shield.fill', bg: colors.light.semantic.error, tint: colors.light.neutral.white },
  streak: { emoji: '🔥', bg: colors.light.semantic.warningBg },
  subscription: { emoji: '👑', bg: colors.light.primary[100] },
  drop: { symbol: 'bag.fill', bg: colors.light.primary[100], tint: colors.light.primary[600] },
  tester: { symbol: 'testtube.2', bg: colors.light.primary[100], tint: colors.light.primary[600] },
}

const PROMO_IMAGE_URL = 'https://picsum.photos/seed/dang-lifestyle-perk/600/300'

function initials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const TODAY: NotificationItem[] = [
  {
    id: 'today-reply',
    variant: 'reply',
    day: 'today',
    timeAgo: '2m',
    unread: true,
    actorName: 'Jima Emmanuel',
    actorAvatarSeed: 'jima-emmanuel',
    title: 'Replied to your post',
    body: "This really spoke to me. I've been walking through the same season...",
  },
  {
    id: 'today-repost',
    variant: 'repost',
    day: 'today',
    timeAgo: '2m',
    unread: true,
    actorName: 'Jima Emmanuel',
    actorAvatarSeed: 'jima-emmanuel',
    title: 'Reposted',
    body: "This really spoke to me. I've been walking through the same season...",
  },
  {
    id: 'today-session',
    variant: 'session',
    day: 'today',
    timeAgo: '2m',
    unread: true,
    title: 'Faith at Work live session starts in 15 minutes',
    body: 'Dr. Chiamaka Nwosu • Building Your Personal Brand',
  },
  {
    id: 'today-course-complete',
    variant: 'course-complete',
    day: 'today',
    timeAgo: '2m',
    unread: false,
    title: 'You completed Faith at Work 🎉',
    body: 'Your certificate is ready to download.',
  },
  {
    id: 'today-anon-live',
    variant: 'anon-live',
    day: 'today',
    timeAgo: '2m',
    unread: false,
    title: 'Your anonymous post is now live',
    body: 'Your post has been approved and is visible to the community.',
  },
  {
    id: 'today-streak',
    variant: 'streak',
    day: 'today',
    timeAgo: '2m',
    unread: false,
    title: "You're on a 7-day streak 🔥",
    body: 'Keep showing up. Consistency is its own kind of faith.',
  },
  {
    id: 'today-like',
    variant: 'like',
    day: 'today',
    timeAgo: '2m',
    unread: true,
    actorName: 'Jima Emmanuel',
    actorAvatarSeed: 'jima-emmanuel',
    title: 'liked your post',
    body: "This really spoke to me. I've been walking through the same season...",
  },
  {
    id: 'today-follow',
    variant: 'follow',
    day: 'today',
    timeAgo: '2m',
    unread: true,
    title: 'Started following you',
  },
]

const YESTERDAY: NotificationItem[] = [
  {
    id: 'yesterday-subscription',
    variant: 'subscription',
    day: 'yesterday',
    timeAgo: '2m',
    unread: false,
    title: 'Your subscription renews in 7 days',
    body: 'Your DANG Boss membership will renew on 8 July.',
  },
  {
    id: 'yesterday-drop',
    variant: 'drop',
    day: 'yesterday',
    timeAgo: '2m',
    unread: false,
    title: 'New drop: DANG Signature Serum is now available',
    body: 'Members get early access before the public launch.',
    promoImage: true,
  },
  {
    id: 'yesterday-mention',
    variant: 'mention',
    day: 'yesterday',
    timeAgo: '2m',
    unread: false,
    actorName: 'Jima Emmanuel',
    actorAvatarSeed: 'jima-emmanuel',
    title: 'mentioned you in a post',
    body: '...especially what @Amy shared last week about vulnerability.',
  },
  {
    id: 'yesterday-anon-rejected',
    variant: 'anon-rejected',
    day: 'yesterday',
    timeAgo: '2m',
    unread: false,
    title: "Your anonymous post wasn't approved",
    body: 'Contains information that could identify another member. Tap to edit and resubmit.',
  },
  {
    id: 'yesterday-tester',
    variant: 'tester',
    day: 'yesterday',
    timeAgo: '2m',
    unread: false,
    title: "You've been selected to test DANG Glow Oil",
    body: 'Your product tester application was approved.',
  },
]

const MENTIONS: NotificationItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: `mention-${i}`,
  variant: 'mention',
  day: 'today',
  timeAgo: '2m',
  unread: true,
  actorName: 'Jima Emmanuel',
  actorAvatarSeed: 'jima-emmanuel',
  title: 'mentioned you in a post',
  body: '...especially what @Amy shared last week about vulnerability.',
}))

const ALL_NOTIFICATIONS: NotificationItem[] = [...TODAY, ...YESTERDAY]

function renderBody(body: string) {
  const parts = body.split(/(@\w+)/g)
  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <Text key={i} style={styles.bodyMention}>
        {part}
      </Text>
    ) : (
      part
    ),
  )
}

function NotificationLeading({ item }: { item: NotificationItem }) {
  if (item.variant === 'follow') {
    return (
      <View style={styles.followAvatars}>
        <View style={styles.followAvatarWrap}>
          <Avatar initials="JE" size="sm" />
        </View>
        <View style={[styles.followAvatarWrap, styles.followAvatarOverlap]}>
          <Avatar initials="AB" size="sm" />
        </View>
      </View>
    )
  }

  if (SOCIAL_VARIANTS.includes(item.variant)) {
    const badge = SOCIAL_BADGE[item.variant as SocialVariant]
    return (
      <View style={styles.avatarWrap}>
        <Avatar initials={item.actorName ? initials(item.actorName) : '?'} size="md" />
        <View style={[styles.socialBadge, { backgroundColor: badge.bg }]}>
          <Icon name={badge.icon} size={9} tintColor={colors.light.neutral.white} />
        </View>
      </View>
    )
  }

  const cfg = UPDATE_ICON[item.variant as UpdateVariant]
  return (
    <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
      {cfg.emoji ? (
        <Text style={styles.iconEmoji}>{cfg.emoji}</Text>
      ) : (
        <Icon name={cfg.symbol!} size={18} tintColor={cfg.tint} />
      )}
    </View>
  )
}

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <View style={[styles.row, item.unread && styles.rowUnread]}>
      <NotificationLeading item={item} />
      <View style={styles.rowContent}>
        <View style={styles.rowTopLine}>
          <Text style={styles.rowTitle}>
            {item.actorName && <Text style={styles.rowActor}>{item.actorName} </Text>}
            {item.title}
          </Text>
          <Text style={styles.rowTime}>{item.timeAgo}</Text>
        </View>

        {item.body && (
          <Text style={styles.rowBody} numberOfLines={2}>
            {renderBody(item.body)}
          </Text>
        )}

        {item.variant === 'follow' && (
          <Button title="Follow Back" size="sm" style={styles.followBackButton} />
        )}

        {item.promoImage && (
          <View style={styles.promoCard}>
            <Image source={{ uri: PROMO_IMAGE_URL }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(15,23,42,0.8)', 'rgba(15,23,42,0.3)', 'rgba(15,23,42,0)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0.9, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.promoText}>10% off,{'\n'}always on</Text>
          </View>
        )}
      </View>
    </View>
  )
}

function NotificationGroup({ label, items }: { label: string; items: NotificationItem[] }) {
  if (items.length === 0) return null
  return (
    <View>
      <Text variant="label" style={styles.groupLabel}>
        {label}
      </Text>
      {items.map(item => (
        <NotificationRow key={item.id} item={item} />
      ))}
    </View>
  )
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS)
  const [mentions, setMentions] = useState(MENTIONS)
  const [tab, setTab] = useState<NotificationTab>('all')

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    setMentions(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const today = notifications.filter(n => n.day === 'today')
  const yesterday = notifications.filter(n => n.day === 'yesterday')
  const updatesToday = today.filter(n => !SOCIAL_VARIANTS.includes(n.variant) && n.variant !== 'follow')
  const updatesYesterday = yesterday.filter(n => !SOCIAL_VARIANTS.includes(n.variant) && n.variant !== 'follow')

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notification</Text>
        <Pressable onPress={markAllRead} hitSlop={8}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'mentions', label: 'Mentions' },
          { value: 'updates', label: 'Updates' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'all' && (
          <>
            <NotificationGroup label="Today" items={today} />
            <NotificationGroup label="Yesterday" items={yesterday} />
          </>
        )}
        {tab === 'mentions' && <NotificationGroup label="Today" items={mentions} />}
        {tab === 'updates' && (
          <>
            <NotificationGroup label="Today" items={updatesToday} />
            <NotificationGroup label="Yesterday" items={updatesYesterday} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.light.text,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  tabsRow: {
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 120,
  },
  groupLabel: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  rowUnread: {
    backgroundColor: colors.light.primary[50],
  },
  avatarWrap: {
    position: 'relative',
  },
  socialBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.light.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followAvatars: {
    flexDirection: 'row',
    width: 44,
  },
  followAvatarWrap: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  followAvatarOverlap: {
    marginLeft: -14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  rowContent: {
    flex: 1,
  },
  rowTopLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
    lineHeight: 19,
  },
  rowActor: {
    fontWeight: '700',
    color: colors.light.text,
  },
  rowTime: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
  rowBody: {
    fontSize: 13,
    color: colors.light.textMuted,
    lineHeight: 18,
    marginTop: 4,
  },
  bodyMention: {
    color: colors.light.primary[500],
    fontWeight: '600',
  },
  followBackButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: colors.light.primary[500],
    borderRadius: 999,
  },
  promoCard: {
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
    marginTop: 10,
  },
  promoText: {
    color: colors.light.neutral.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 19,
  },
})
