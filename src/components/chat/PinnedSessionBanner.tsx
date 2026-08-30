import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { CircleSession } from '@/types/chat'

interface PinnedSessionBannerProps {
  session: CircleSession
  expanded: boolean
  onClose: () => void
  onPress: () => void
  onGoing?: () => void
  onAddToCalendar?: () => void
  onJoin?: () => void
}

const STATUS_COPY: Record<CircleSession['status'], string> = {
  upcoming: 'UPCOMING CIRCLE SESSION',
  starting_soon: 'STARTING SOON',
  live: 'LIVE NOW',
}

export function PinnedSessionBanner({
  session,
  expanded,
  onClose,
  onPress,
  onGoing,
  onAddToCalendar,
  onJoin,
}: PinnedSessionBannerProps) {
  const isLive = session.status === 'live'

  return (
    <View>
      <View style={styles.pinnedBar}>
        <View style={styles.pinnedLabel}>
          <Icon name="pin.fill" size={11} tintColor={colors.light.semantic.error} />
          <Text style={styles.pinnedLabelText}>Pinned</Text>
        </View>
        <Pressable onPress={expanded ? onClose : onPress} hitSlop={8}>
          <Text style={styles.pinnedAction}>{expanded ? 'close' : 'View'}</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.card, isLive && styles.cardLive]}
        onPress={expanded ? undefined : onPress}
      >
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, isLive && styles.iconCircleLive]}>
            <Icon name="phone.fill" size={16} tintColor={isLive ? colors.light.neutral.white : colors.light.primary[600]} />
          </View>
          <View style={styles.headerText}>
            <View style={styles.statusRow}>
              {session.status !== 'upcoming' && (
                <View style={[styles.statusDot, isLive && styles.statusDotLive]} />
              )}
              <Text style={[styles.statusLabel, isLive && styles.statusLabelLive]}>
                {STATUS_COPY[session.status]}
              </Text>
            </View>
            <Text style={styles.title} numberOfLines={expanded ? 2 : 1}>
              {session.title}
            </Text>
          </View>
        </View>

        {expanded && (
          <>
            {session.status === 'upcoming' && (
              <View style={styles.metaRow}>
                <Icon name="calendar" size={13} tintColor={colors.light.textMuted} />
                <Text style={styles.metaText}>
                  {session.date} · {session.time}
                </Text>
              </View>
            )}
            {session.status === 'starting_soon' && (
              <View style={styles.metaRow}>
                <Icon name="clock" size={13} tintColor={colors.light.textMuted} />
                <Text style={styles.metaText}>{session.startsInLabel}</Text>
              </View>
            )}
            {session.status !== 'live' && (
              <View style={styles.metaRow}>
                <Avatar uri={session.host.avatarUrl} initials={session.host.name.slice(0, 2)} size="xs" />
                <Text style={styles.metaText}>Hosted by {session.host.name}</Text>
              </View>
            )}

            {session.status === 'upcoming' && (
              <>
                <View style={styles.metaRow}>
                  <View style={styles.avatarStack}>
                    {session.attendeeAvatars?.slice(0, 2).map((uri, i) => (
                      <Avatar key={uri + i} uri={uri} size="xs" style={[styles.stackAvatar, i > 0 && styles.stackAvatarOverlap]} />
                    ))}
                  </View>
                  <Text style={styles.metaText}>{session.attendeeCount} members attending</Text>
                </View>
                <View style={styles.actionsRow}>
                  <Button
                    title="Going"
                    size="sm"
                    icon={<Icon name="hand.thumbsup.fill" size={13} tintColor={colors.light.neutral.white} />}
                    onPress={onGoing}
                    style={styles.goingButton}
                  />
                  <Button
                    title="Add to calendar"
                    size="sm"
                    variant="secondary"
                    icon={<Icon name="calendar.badge.plus" size={13} tintColor={colors.light.primary[500]} />}
                    onPress={onAddToCalendar}
                    style={styles.calendarButton}
                  />
                </View>
              </>
            )}

            {isLive && (
              <>
                <View style={styles.metaRow}>
                  <View style={styles.avatarStack}>
                    {session.liveAvatars?.slice(0, 2).map((uri, i) => (
                      <Avatar key={uri + i} uri={uri} size="xs" style={[styles.stackAvatar, i > 0 && styles.stackAvatarOverlap]} />
                    ))}
                  </View>
                  <Text style={styles.metaText}>{session.liveLabel}</Text>
                </View>
                <Button title="Join Now" onPress={onJoin} style={styles.joinButton} />
              </>
            )}
          </>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pinnedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pinnedLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pinnedLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
  pinnedAction: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 18,
    padding: 14,
  },
  cardLive: {
    backgroundColor: colors.light.semantic.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleLive: {
    backgroundColor: colors.light.semantic.error,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.primary[500],
  },
  statusDotLive: {
    backgroundColor: colors.light.semantic.error,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.primary[600],
    letterSpacing: 0.4,
  },
  statusLabelLive: {
    color: colors.light.semantic.error,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  metaText: {
    fontSize: 12,
    color: colors.light.textMuted,
    flexShrink: 1,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackAvatar: {
    borderWidth: 1.5,
    borderColor: colors.light.primary[50],
  },
  stackAvatarOverlap: {
    marginLeft: -8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  goingButton: {
    flex: 1,
    borderRadius: 999,
  },
  calendarButton: {
    flex: 1,
    borderRadius: 999,
  },
  joinButton: {
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: colors.light.semantic.error,
  },
})
