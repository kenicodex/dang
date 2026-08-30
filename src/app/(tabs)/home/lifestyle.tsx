import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { FEATURED_DROP, RADIANCE_SET_PRODUCT, formatNaira } from '@/components/commerce'
import { useCountdown } from '@/hooks/use-countdown'
import { useAuthStore, useLifestyleStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { TesterStatus } from '@/types/commerce'

const PERK_IMAGE_URL = 'https://picsum.photos/seed/dang-lifestyle-perk/800/900'

const TESTER_CARD_HREF: Record<TesterStatus, string> = {
  none: `/(lifestyle)/tester/apply?dropId=${FEATURED_DROP.id}`,
  pending: `/(lifestyle)/tester/pending?dropId=${FEATURED_DROP.id}`,
  selected: `/(lifestyle)/tester/selected?dropId=${FEATURED_DROP.id}`,
  rejected: `/(lifestyle)/tester/rejected?dropId=${FEATURED_DROP.id}`,
  completed: `/(lifestyle)/tester/feedback?dropId=${FEATURED_DROP.id}`,
}

function formatCountdown(hours: number, minutes: number, seconds: number) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function LifestyleScreen() {
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'
  const openDrawer = useUIStore(s => s.openDrawer)
  const testerStatus = useLifestyleStore(s => s.testerStatus[FEATURED_DROP.id] ?? 'none')
  const { hours, minutes, seconds } = useCountdown(FEATURED_DROP.publicStartsAt)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={openDrawer} hitSlop={8}>
          <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="md" />
        </Pressable>
        <Text style={styles.headerTitle}>Dang Lifestyle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.perkBanner}>
          <Image source={{ uri: PERK_IMAGE_URL }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(15,23,42,0.8)', 'rgba(15,23,42,0.35)', 'rgba(15,23,42,0)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.9, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.perkBadge}>
            <Icon name="checkmark.seal.fill" size={12} tintColor={colors.light.neutral.white} />
            <Text style={styles.perkBadgeText}>Member perk</Text>
          </View>
          <Text style={styles.perkTitle}>10% off,{'\n'}always on</Text>
          <Text style={styles.perkSubtitle}>Your discount is applied automatically at checkout.</Text>
        </Pressable>

        <Text variant="label" style={styles.sectionLabel}>
          Happening now
        </Text>

        <Pressable style={styles.dropCard} onPress={() => router.push(`/(lifestyle)/drop/${FEATURED_DROP.id}`)}>
          <View style={styles.dropImageWrap}>
            <Image source={{ uri: FEATURED_DROP.coverUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.membersOnlyBadge}>
              <Icon name="lock.fill" size={10} tintColor={colors.light.neutral.white} />
              <Text style={styles.membersOnlyText}>members only</Text>
            </View>
            <View style={styles.countdownPill}>
              <Text style={styles.countdownText}>{formatCountdown(hours, minutes, seconds)} left</Text>
            </View>
          </View>

          <View style={styles.dropBody}>
            <Text style={styles.dropName}>{RADIANCE_SET_PRODUCT.name}</Text>
            <View style={styles.dropPriceRow}>
              <Text style={styles.dropPrice}>{formatNaira(RADIANCE_SET_PRODUCT.price)}</Text>
              {!!RADIANCE_SET_PRODUCT.compareAtPrice && (
                <Text style={styles.dropPriceStrike}>{formatNaira(RADIANCE_SET_PRODUCT.compareAtPrice)}</Text>
              )}
            </View>
            <View style={styles.dropLinkRow}>
              <Text style={styles.dropLinkText}>Early access drop</Text>
              <Icon name="arrow.right" size={12} tintColor={colors.light.primary[500]} />
            </View>
          </View>
        </Pressable>

        <Text variant="label" style={styles.sectionLabel}>
          More
        </Text>

        <View style={styles.moreRow}>
          <Pressable
            style={[styles.moreCard, styles.moreCardPurple]}
            onPress={() => router.push(`/(lifestyle)/drop/${FEATURED_DROP.id}`)}
          >
            <View style={styles.moreIconBadge}>
              <Text style={styles.moreIconEmoji}>🛍️</Text>
            </View>
            <View>
              <Text style={styles.moreCardTitle}>Shop now</Text>
              <View style={styles.moreCardFooterRow}>
                <Text style={styles.moreCardSubtitlePurple}>Discount already on</Text>
                <Icon name="arrow.right" size={11} tintColor={colors.light.primary[600]} />
              </View>
            </View>
          </Pressable>

          <Pressable
            style={[styles.moreCard, styles.moreCardGreen]}
            onPress={() => router.push(TESTER_CARD_HREF[testerStatus] as any)}
          >
            <View style={styles.moreIconBadge}>
              <Text style={styles.moreIconEmoji}>🧪</Text>
            </View>
            <View style={styles.moreCardTitleRow}>
              <Text style={styles.moreCardTitle}>Become{'\n'}a tester</Text>
              <Icon name="arrow.right" size={14} tintColor={colors.light.tertiary[600]} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.light.text,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  perkBanner: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    justifyContent: 'flex-end',
    ...shadows.sm,
  },
  perkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  perkBadgeText: {
    color: colors.light.neutral.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  perkTitle: {
    color: colors.light.neutral.white,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 8,
  },
  perkSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: '70%',
  },
  sectionLabel: {
    marginTop: 28,
    marginBottom: 12,
  },
  dropCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.light.surface,
    ...shadows.sm,
  },
  dropImageWrap: {
    height: 170,
    padding: 14,
  },
  membersOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  membersOnlyText: {
    color: colors.light.neutral.white,
    fontSize: 11,
    fontWeight: '600',
  },
  countdownPill: {
    position: 'absolute',
    right: 14,
    top: '48%',
    backgroundColor: '#FBE1D3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countdownText: {
    color: '#B5482D',
    fontSize: 13,
    fontWeight: '700',
  },
  dropBody: {
    padding: 18,
  },
  dropName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
    marginBottom: 8,
  },
  dropPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dropPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.light.text,
  },
  dropPriceStrike: {
    fontSize: 14,
    color: colors.light.textSoft,
    textDecorationLine: 'line-through',
  },
  dropLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  moreRow: {
    flexDirection: 'row',
    gap: 12,
  },
  moreCard: {
    flex: 1,
    minHeight: 150,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
  },
  moreCardPurple: {
    backgroundColor: colors.light.primary[100],
  },
  moreCardGreen: {
    backgroundColor: colors.light.tertiary[50],
  },
  moreIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.light.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreIconEmoji: {
    fontSize: 18,
  },
  moreCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
    lineHeight: 24,
  },
  moreCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  moreCardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  moreCardSubtitlePurple: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[600],
  },
})
