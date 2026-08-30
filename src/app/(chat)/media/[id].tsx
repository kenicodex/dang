import { useState } from 'react'
import { Image } from 'expo-image'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui'
import { Text } from '@/components/ui/Text'
import { MEDIA_ITEMS, findCircleSession } from '@/components/chat'
import { colors } from '@/theme/colors'
import type { MediaItem } from '@/types/chat'

type MediaTab = 'gallery' | 'docs' | 'links' | 'events'

function groupByDate<T extends { dateGroup: string }>(items: T[]) {
  const groups: Record<string, T[]> = {}
  for (const item of items) {
    groups[item.dateGroup] = groups[item.dateGroup] ?? []
    groups[item.dateGroup].push(item)
  }
  return groups
}

const FILE_ICONS: Record<string, SymbolViewProps['name']> = {
  doc: 'doc.text.fill',
  link: 'link',
}

export default function ChatMediaScreen() {
  const { id, tab: initialTab } = useLocalSearchParams<{ id: string; tab?: string }>()
  const [tab, setTab] = useState<MediaTab>((initialTab as MediaTab) ?? 'gallery')
  const session = findCircleSession(id)
  const items = MEDIA_ITEMS[id] ?? []

  const galleryItems = items.filter(i => i.kind === 'image' || i.kind === 'video')
  const docsItems = groupByDate(items.filter(i => i.kind === 'doc'))
  const linksItems = groupByDate(items.filter(i => i.kind === 'link' || i.kind === 'doc'))

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.title}>
          Media
        </Text>
        <Pressable style={styles.iconButton} hitSlop={8}>
          <Icon name="magnifyingglass" size={17} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: 'gallery', label: 'Gallery' },
          { value: 'docs', label: 'Docs' },
          { value: 'links', label: 'Links' },
          { value: 'events', label: 'Events' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabsRow}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'gallery' && (
          <View style={styles.grid}>
            {galleryItems.map(item => (
              <View key={item.id} style={styles.gridTile}>
                <Image source={{ uri: item.imageUrl }} style={styles.gridImage} contentFit="cover" />
                {item.kind === 'video' && (
                  <View style={styles.playOverlay}>
                    <Icon name="play.fill" size={20} tintColor={colors.light.neutral.white} />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {tab === 'docs' &&
          Object.entries(docsItems).map(([group, groupItems]) => (
            <View key={group}>
              <Text variant="label" style={styles.groupLabel}>
                {group}
              </Text>
              {groupItems.map(item => (
                <FileRow key={item.id} item={item} />
              ))}
            </View>
          ))}

        {tab === 'links' &&
          Object.entries(linksItems).map(([group, groupItems]) => (
            <View key={group}>
              <Text variant="label" style={styles.groupLabel}>
                {group}
              </Text>
              {groupItems.map(item =>
                item.kind === 'link' && item.imageUrl ? (
                  <LinkPreviewCard key={item.id} item={item} />
                ) : (
                  <FileRow key={item.id} item={item} />
                ),
              )}
            </View>
          ))}

        {tab === 'events' && session && (
          <>
            {session.upcomingEvent && (
              <>
                <Text variant="label" style={styles.groupLabel}>
                  Upcoming
                </Text>
                <View style={styles.upcomingCard}>
                  <Avatar uri={session.upcomingEvent.hostAvatarUrl} initials="EV" size="md" />
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTitle}>{session.upcomingEvent.title}</Text>
                    <View style={styles.upcomingDateRow}>
                      <Icon name="calendar" size={11} tintColor={colors.light.textSoft} />
                      <Text style={styles.upcomingDate}>{session.upcomingEvent.date}</Text>
                    </View>
                  </View>
                  <Button
                    title="Going"
                    size="sm"
                    icon={<Icon name="paperplane.fill" size={11} tintColor={colors.light.neutral.white} />}
                    style={styles.upcomingGoingButton}
                  />
                  <Pressable style={styles.upcomingCancelButton} hitSlop={6}>
                    <Icon name="xmark" size={13} tintColor={colors.light.semantic.error} />
                  </Pressable>
                </View>
              </>
            )}

            {!!session.pastRecordings?.length && (
              <>
                <View style={styles.pastHeaderRow}>
                  <Text variant="label" style={styles.groupLabelNoMargin}>
                    Past
                  </Text>
                  <Icon name="chevron.right" size={13} tintColor={colors.light.textSoft} />
                </View>
                {session.pastRecordings.map(rec => (
                  <View key={rec.id} style={styles.recordingCard}>
                    <Text style={styles.recordingBadge}>Session Ended</Text>
                    <View style={styles.recordingHeaderRow}>
                      <Avatar uri={rec.hostAvatarUrl} initials={rec.hostName.slice(0, 2)} size="md" />
                      <View style={styles.recordingInfo}>
                        <Text style={styles.recordingTitle}>{rec.title}</Text>
                        <View style={styles.upcomingDateRow}>
                          <Icon name="calendar" size={11} tintColor={colors.light.textSoft} />
                          <Text style={styles.upcomingDate}>{rec.date}</Text>
                        </View>
                        <Text style={styles.recordingHost}>
                          Hosted by <Text style={styles.recordingHostBold}>{rec.hostName}</Text>
                        </Text>
                        <Text style={styles.recordingAttendees}>{rec.attendeeCount} members attended</Text>
                      </View>
                    </View>
                    <Button title="Watch Recording" variant="secondary" style={styles.watchButton} />
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function FileRow({ item }: { item: MediaItem }) {
  return (
    <View style={[styles.fileRow, !item.fromMe && styles.fileRowFilled]}>
      <View style={styles.fileRowTop}>
        <Icon
          name={FILE_ICONS[item.kind] ?? 'doc.text.fill'}
          size={18}
          tintColor={item.fromMe ? colors.light.primary[500] : colors.light.neutral.white}
        />
        <View style={styles.fileInfo}>
          <Text style={item.fromMe ? styles.fileTitle : styles.fileTitleInverse}>{item.title}</Text>
          <Text style={item.fromMe ? styles.fileSubtitle : styles.fileSubtitleInverse}>
            {item.subtitle ?? item.sizeLabel}
          </Text>
        </View>
        {item.kind === 'doc' && (
          <Icon
            name="arrow.down.circle"
            size={16}
            tintColor={item.fromMe ? colors.light.textMuted : 'rgba(255,255,255,0.8)'}
          />
        )}
      </View>
      {!!item.url && item.kind === 'link' && (
        <Text style={item.fromMe ? styles.fileUrl : styles.fileUrlInverse} numberOfLines={1}>
          {item.url}
        </Text>
      )}
      <View style={styles.fileFooterRow}>
        <Text style={item.fromMe ? styles.fileSender : styles.fileSenderInverse}>{item.senderName}</Text>
        <Icon
          name="checkmark"
          size={11}
          tintColor={item.fromMe ? colors.light.textSoft : 'rgba(255,255,255,0.7)'}
        />
      </View>
    </View>
  )
}

function LinkPreviewCard({ item }: { item: MediaItem }) {
  return (
    <View style={styles.linkPreviewCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.linkPreviewImage} contentFit="cover" />
      <Text style={styles.fileTitle}>{item.title}</Text>
      <Text style={styles.fileUrl}>{item.url}</Text>
    </View>
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
  },
  title: {
    fontSize: 18,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridTile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.primary[400],
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  groupLabel: {
    marginBottom: 8,
    marginTop: 16,
  },
  groupLabelNoMargin: {
    marginBottom: 0,
  },
  fileRow: {
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  fileRowFilled: {
    backgroundColor: colors.light.primary[500],
  },
  fileRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileInfo: {
    flex: 1,
    gap: 1,
  },
  fileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  fileTitleInverse: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  fileSubtitle: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  fileSubtitleInverse: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  fileUrl: {
    fontSize: 12,
    color: colors.light.primary[500],
    marginTop: 6,
  },
  fileUrlInverse: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  fileFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  fileSender: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  fileSenderInverse: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  linkPreviewCard: {
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  linkPreviewImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    marginBottom: 6,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 14,
    padding: 12,
  },
  upcomingInfo: {
    flex: 1,
    gap: 3,
  },
  upcomingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
  },
  upcomingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upcomingDate: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  upcomingGoingButton: {
    borderRadius: 999,
  },
  upcomingCancelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.semantic.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  recordingCard: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  recordingBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.primary[500],
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  recordingHeaderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  recordingInfo: {
    flex: 1,
    gap: 3,
  },
  recordingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  recordingHost: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  recordingHostBold: {
    fontWeight: '700',
    color: colors.light.textAlt,
  },
  recordingAttendees: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  watchButton: {
    borderRadius: 999,
    backgroundColor: colors.light.bg,
  },
})
