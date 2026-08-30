import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { GlassView } from '@/components/ui/GlassView'
import { Text } from '@/components/ui/Text'
import { findCircleSession } from '@/components/chat'
import { colors } from '@/theme/colors'

export default function CircleSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const session = findCircleSession(id)

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.emptyRoute}>This session is no longer available.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#423BD9', '#231D95']} style={styles.banner}>
          <SafeAreaView edges={['top']} style={styles.bannerBar}>
            <GlassView style={styles.circleButtonGlass} radius="full" glassEffectStyle="clear" isInteractive>
              <Pressable style={styles.circleButtonInner} onPress={() => router.back()}>
                <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
              </Pressable>
            </GlassView>
          </SafeAreaView>

          <View style={styles.bannerText}>
            <Text style={styles.bannerEyebrow}>Upcoming Circle Session</Text>
            <Text style={styles.bannerTitle}>{session.title}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {!!session.privateTag && (
            <View style={styles.privateTag}>
              <Icon name="lock.fill" size={11} tintColor={colors.light.primary[600]} />
              <Text style={styles.privateTagText}>{session.privateTag}</Text>
            </View>
          )}

          <View style={styles.cardsRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Date</Text>
              <View style={styles.infoValueRow}>
                <Icon name="calendar" size={13} tintColor={colors.light.primary[500]} />
                <Text style={styles.infoValue}>{session.date}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Time</Text>
              <View style={styles.infoValueRow}>
                <Icon name="clock" size={13} tintColor={colors.light.primary[500]} />
                <Text style={styles.infoValue}>{session.time}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionHeading}>Hosted by</Text>
          <View style={styles.hostRow}>
            <Avatar uri={session.host.avatarUrl} initials={session.host.name.slice(0, 2)} size="md" />
            <View>
              <Text style={styles.hostName}>{session.host.name}</Text>
              {!!session.host.title && <Text style={styles.hostTitle}>{session.host.title}</Text>}
            </View>
          </View>

          {!!session.description && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionHeading}>About this session</Text>
              <Text style={styles.description}>{session.description}</Text>
            </>
          )}

          <View style={styles.divider} />
          <Text style={styles.sectionHeading}>{session.attendeeCount} Going</Text>
          <View style={styles.avatarStack}>
            {session.attendeeAvatars?.slice(0, 3).map((uri, i) => (
              <Avatar key={uri + i} uri={uri} size="sm" style={[styles.stackAvatar, i > 0 && styles.stackAvatarOverlap]} />
            ))}
            {session.attendeeCount > (session.attendeeAvatars?.length ?? 0) && (
              <View style={[styles.stackAvatar, styles.stackAvatarOverlap, styles.overflowBadge]}>
                <Text style={styles.overflowBadgeText}>
                  +{session.attendeeCount - (session.attendeeAvatars?.length ?? 0)}
                </Text>
              </View>
            )}
          </View>

          {!!session.reminderLabel && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionHeading}>Reminder</Text>
              <Pressable style={styles.reminderRow}>
                <View style={styles.reminderLeft}>
                  <Icon name="alarm" size={15} tintColor={colors.light.textMuted} />
                  <Text style={styles.reminderText}>{session.reminderLabel}</Text>
                </View>
                <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={session.isGoing ? 'Going' : 'RSVP'}
          icon={<Icon name="hand.thumbsup.fill" size={15} tintColor={colors.light.neutral.white} />}
          style={styles.goingButton}
        />
        <Button
          title="Add to calendar"
          variant="secondary"
          icon={<Icon name="calendar.badge.plus" size={15} tintColor={colors.light.primary[500]} />}
          style={styles.calendarButton}
        />
      </View>
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
    paddingBottom: 20,
  },
  banner: {
    minHeight: 200,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  bannerBar: {
    flexDirection: 'row',
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
  bannerText: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  bannerEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.light.neutral.white,
    marginTop: 6,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.light.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  privateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.light.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  privateTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.primary[600],
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 18,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  hostTitle: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.light.textMuted,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackAvatar: {
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  stackAvatarOverlap: {
    marginLeft: -10,
  },
  overflowBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 14,
    padding: 14,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reminderText: {
    fontSize: 14,
    color: colors.light.textAlt,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  goingButton: {
    flex: 1,
    borderRadius: 999,
  },
  calendarButton: {
    flex: 1,
    borderRadius: 999,
  },
})
