import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { findMember } from '@/components/members/members.data'
import { findThread, GROUP_MEMBERS } from '@/components/chat'
import { colors } from '@/theme/colors'

function formatJoined(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

const QUICK_ACTIONS: { icon: SymbolViewProps['name']; label: string }[] = [
  { icon: 'person', label: 'Profile' },
  { icon: 'magnifyingglass', label: 'Search' },
  { icon: 'bell.slash', label: 'Mute' },
  { icon: 'clock.arrow.circlepath', label: 'Call history' },
]

const PERSONAL_MEDIA_ROWS: { icon: SymbolViewProps['name']; label: string; description: string; tab: string }[] = [
  { icon: 'photo.on.rectangle', label: 'Gallery', description: 'View Images', tab: 'gallery' },
  { icon: 'doc.text', label: 'Docs', description: 'View images and videos', tab: 'docs' },
  { icon: 'link', label: 'Links', description: 'View images and videos', tab: 'links' },
]

const GROUP_MEDIA_ROWS: { icon: SymbolViewProps['name']; label: string; description: string; tab: string }[] = [
  ...PERSONAL_MEDIA_ROWS,
  { icon: 'calendar', label: 'Events', description: 'Manage events and conferences online', tab: 'events' },
]

export default function ChatProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const thread = findThread(id)
  const member = thread?.memberId ? findMember(thread.memberId) : undefined
  const isGroup = thread?.kind === 'group'
  const roster = thread ? GROUP_MEMBERS[thread.id] ?? [] : []
  const [showAllMembers, setShowAllMembers] = useState(false)
  const visibleRoster = showAllMembers ? roster : roster.slice(0, 5)
  const remainingCount = Math.max((thread?.memberCount ?? roster.length) - roster.length, 0)

  if (!thread) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.emptyRoute}>This conversation is no longer available.</Text>
      </SafeAreaView>
    )
  }

  const mediaRows = isGroup ? GROUP_MEDIA_ROWS : PERSONAL_MEDIA_ROWS
  const bio = isGroup ? thread.circle?.bio : member?.bio

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topCard}>
          <Icon name="waveform" size={140} tintColor="rgba(0,0,0,0.03)" style={styles.watermark} />

          <View style={styles.navRow}>
            <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
              <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
            </Pressable>
            <Text variant="h3" style={styles.navTitle}>
              {isGroup ? 'Group info' : 'Profile'}
            </Text>
            <View style={styles.callButtons}>
              <Pressable style={styles.callButton} onPress={() => router.push(`/(chat)/call/${thread.id}?kind=video`)} hitSlop={6}>
                <Icon name="video.fill" size={15} tintColor={colors.light.text} />
              </Pressable>
              <Pressable style={styles.callButton} onPress={() => router.push(`/(chat)/call/${thread.id}?kind=audio`)} hitSlop={6}>
                <Icon name="phone.fill" size={15} tintColor={colors.light.text} />
              </Pressable>
            </View>
          </View>

          {isGroup && thread.memberAvatars ? (
            <View style={styles.groupAvatarStack}>
              {thread.memberAvatars.slice(0, 3).map((uri, i) => (
                <View key={uri + i} style={[styles.groupAvatarWrap, i > 0 && styles.groupAvatarOverlap]}>
                  <Avatar uri={uri} size="lg" />
                  {i === thread.memberAvatars!.length - 1 && thread.isOnline && (
                    <View style={styles.groupAvatarOnlineDot} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Avatar uri={thread.avatarUrl} initials={thread.title.slice(0, 2)} size="xl" />
          )}

          <Text variant="h2" style={styles.name}>
            {thread.title}
          </Text>
          {!!bio && (
            <Text style={styles.bio}>
              <Text style={styles.bioLabel}>About</Text> · {bio}
            </Text>
          )}

          {isGroup ? (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{thread.memberCount}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{thread.activeCount}</Text>
                <Text style={styles.statLabel}>Online</Text>
              </View>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              {QUICK_ACTIONS.map(action => (
                <Pressable
                  key={action.label}
                  style={styles.actionItem}
                  onPress={action.label === 'Call history' ? () => router.push('/(chat)/calls') : undefined}
                >
                  <Icon name={action.icon} size={20} tintColor={colors.light.text} />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text variant="label" style={styles.sectionLabel}>
            Media
          </Text>
          <View style={styles.card}>
            {mediaRows.map((row, i) => (
              <Pressable
                key={row.label}
                style={[styles.row, i > 0 && styles.rowDivider]}
                onPress={() => router.push(`/(chat)/media/${thread.id}?tab=${row.tab}`)}
              >
                <View style={styles.rowIconWrap}>
                  <Icon name={row.icon} size={16} tintColor={colors.light.primary[500]} />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowDescription}>{row.description}</Text>
                </View>
                <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />
              </Pressable>
            ))}
          </View>

          {isGroup && roster.length > 0 && (
            <>
              <Text variant="label" style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                Members
              </Text>
              <View style={styles.card}>
                {visibleRoster.map((entry, i) => (
                  <View key={entry.memberId} style={[styles.memberRow, i > 0 && styles.rowDivider]}>
                    <Avatar uri={entry.avatarUrl} initials={entry.name.slice(0, 2)} size="md" />
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowLabel}>{entry.name}</Text>
                      {!!entry.role && <Text style={styles.rowDescription}>{entry.role}</Text>}
                    </View>
                    <Pressable hitSlop={6} style={styles.memberActionButton}>
                      <Icon name="bubble.left" size={15} tintColor={colors.light.textMuted} />
                    </Pressable>
                    <Pressable hitSlop={6} style={styles.memberActionButton}>
                      <Icon name="person.badge.plus" size={15} tintColor={colors.light.textMuted} />
                    </Pressable>
                  </View>
                ))}
                {!showAllMembers && remainingCount > 0 && (
                  <Pressable style={styles.viewAllRow} onPress={() => setShowAllMembers(true)}>
                    <Text style={styles.viewAllText}>(View All) {remainingCount} Members</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {!isGroup && (
            <>
              <Text variant="label" style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                Account Actions
              </Text>
              <View style={styles.card}>
                <Pressable style={styles.row}>
                  <View style={[styles.rowIconWrap, styles.rowIconWrapWarning]}>
                    <Icon name="hand.raised.slash" size={16} tintColor={colors.light.semantic.warning} />
                  </View>
                  <Text style={styles.rowLabelWarning}>Block {thread.title.split(' ')[0]}</Text>
                </Pressable>
                <Pressable style={[styles.row, styles.rowDivider]} onPress={() => router.replace('/chat')}>
                  <View style={[styles.rowIconWrap, styles.rowIconWrapDanger]}>
                    <Icon name="trash" size={16} tintColor={colors.light.semantic.error} />
                  </View>
                  <Text style={styles.rowLabelDanger}>Delete Conversation</Text>
                </Pressable>
              </View>
            </>
          )}

          <Text style={styles.footer}>
            Member since {formatJoined(member?.joinedAt ?? new Date())} · Dang v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  emptyRoute: {
    padding: 20,
    color: colors.light.textMuted,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.light.surfaceAlt,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: -20,
    left: -30,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: 8,
    marginBottom: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
  },
  callButtons: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.light.bg,
    borderRadius: 999,
    padding: 4,
  },
  callButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupAvatarStack: {
    flexDirection: 'row',
  },
  groupAvatarWrap: {
    position: 'relative',
  },
  groupAvatarOverlap: {
    marginLeft: -18,
  },
  groupAvatarOnlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.light.semantic.success,
    borderWidth: 2,
    borderColor: colors.light.surfaceAlt,
  },
  name: {
    fontSize: 22,
    marginTop: 12,
  },
  bio: {
    fontSize: 13,
    color: colors.light.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  bioLabel: {
    color: colors.light.semantic.success,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 18,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  sectionLabelSpaced: {
    marginTop: 24,
  },
  card: {
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  memberActionButton: {
    padding: 4,
  },
  viewAllRow: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconWrapWarning: {
    backgroundColor: colors.light.semantic.warningBg,
  },
  rowIconWrapDanger: {
    backgroundColor: colors.light.semantic.errorBg,
  },
  rowInfo: {
    flex: 1,
    gap: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  rowDescription: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  rowLabelWarning: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.semantic.warning,
  },
  rowLabelDanger: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.light.textSoft,
    marginTop: 28,
  },
})
