import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui'
import { findMember } from '@/components/members/members.data'
import { CALL_LOG, contactDisplayName } from '@/components/chat'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'
import type { CallKind } from '@/types/chat'

type CallsTab = 'audio' | 'video'

function directionIcon(direction: 'incoming' | 'outgoing', missed?: boolean): { icon: SymbolViewProps['name']; color: string } {
  if (missed) return { icon: 'arrow.down.left', color: colors.light.semantic.error }
  if (direction === 'incoming') return { icon: 'arrow.down.left', color: colors.light.semantic.success }
  return { icon: 'arrow.up.right', color: colors.light.textMuted }
}

export default function CallsScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const [tab, setTab] = useState<CallsTab>('audio')

  const entries = CALL_LOG.filter(c => c.kind === (tab as CallKind))
  const audioCount = CALL_LOG.filter(c => c.kind === 'audio').length

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.title}>
          Calls
        </Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={() => router.push('/(chat)/new')}>
            <Icon name="square.and.pencil" size={17} tintColor={colors.light.text} />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push('/(chat)/new')}>
            <Icon name="magnifyingglass" size={17} tintColor={colors.light.text} />
          </Pressable>
        </View>
      </View>

      <Tabs
        tabs={[
          { value: 'audio', label: 'Audio Calls', badge: audioCount },
          { value: 'video', label: 'Video calls' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {entries.map(entry => {
          const member = findMember(entry.memberId)
          const { icon, color } = directionIcon(entry.direction, entry.missed)
          return (
            <View key={entry.id} style={styles.row}>
              <View style={styles.avatarWrap}>
                <Avatar uri={member?.avatarUrl} initials={member?.displayName.slice(0, 2) ?? '??'} size="lg" />
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{member ? contactDisplayName(member.id, member.displayName) : ''}</Text>
                <View style={styles.metaRow}>
                  <Icon name={icon} size={11} tintColor={color} />
                  <Text style={[styles.timeAgo, entry.missed && styles.timeAgoMissed]}>{entry.timeAgo}</Text>
                </View>
              </View>

              <View style={styles.right}>
                <Text style={styles.duration}>{entry.duration}</Text>
                <Pressable hitSlop={8}>
                  <Icon
                    name={entry.kind === 'video' ? 'video.fill' : 'phone.fill'}
                    size={16}
                    tintColor={colors.light.secondary[500]}
                  />
                </Pressable>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    padding: 4,
  },
  headerButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderAlt,
  },
  avatarWrap: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.semantic.success,
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
  timeAgoMissed: {
    color: colors.light.semantic.error,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  duration: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
})
