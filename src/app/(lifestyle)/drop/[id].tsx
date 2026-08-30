import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { GlassView } from '@/components/ui/GlassView'
import { FEATURED_DROP, RADIANCE_SET_PRODUCT, formatNaira, discountPercent } from '@/components/commerce'
import { useCountdown } from '@/hooks/use-countdown'
import { useLifestyleStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { TesterStatus } from '@/types/commerce'

const TEASER_COPY: Record<TesterStatus, { text: string; href: string | null }> = {
  none: {
    text: 'Prefer to try it free first? Apply to become a tester →',
    href: `/(lifestyle)/tester/apply?dropId=${FEATURED_DROP.id}`,
  },
  pending: {
    text: 'Your tester application is under review →',
    href: `/(lifestyle)/tester/pending?dropId=${FEATURED_DROP.id}`,
  },
  selected: {
    text: "You're testing this set — share your feedback →",
    href: `/(lifestyle)/tester/feedback?dropId=${FEATURED_DROP.id}`,
  },
  rejected: {
    text: 'Not picked this round — see what boosts your chances →',
    href: `/(lifestyle)/tester/rejected?dropId=${FEATURED_DROP.id}`,
  },
  completed: {
    text: 'Thanks for testing this set! ✅',
    href: null,
  },
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.countdownUnit}>
      <Text style={styles.countdownValue}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.countdownUnitLabel}>{label}</Text>
    </View>
  )
}

export default function DropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)
  const testerStatus = useLifestyleStore(s => s.testerStatus[FEATURED_DROP.id] ?? 'none')

  const drop = id === FEATURED_DROP.id ? FEATURED_DROP : undefined
  const product = RADIANCE_SET_PRODUCT
  const { hours, minutes, seconds } = useCountdown(drop?.publicStartsAt ?? FEATURED_DROP.publicStartsAt)

  if (!drop) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Drop not found.</Text>
      </SafeAreaView>
    )
  }

  const teaser = TEASER_COPY[testerStatus]
  const pct = discountPercent(product.price, product.compareAtPrice)

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: drop.coverUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <SafeAreaView edges={['top']} style={styles.heroBar}>
            <GlassView style={styles.circleButtonGlass} radius="full" glassEffectStyle="clear" isInteractive>
              <Pressable style={styles.circleButtonInner} onPress={() => router.back()}>
                <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
              </Pressable>
            </GlassView>
          </SafeAreaView>
          <View style={styles.membersOnlyBadge}>
            <Icon name="lock.fill" size={11} tintColor={colors.light.neutral.white} />
            <Text style={styles.membersOnlyText}>members only</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text variant="h1" style={styles.name}>
            {drop.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatNaira(product.price)}</Text>
            {!!product.compareAtPrice && (
              <Text style={styles.priceStrike}>{formatNaira(product.compareAtPrice)}</Text>
            )}
            {pct > 0 && <Text style={styles.savePct}>SAVE {pct}%</Text>}
          </View>

          <Text style={styles.description}>{drop.description}</Text>

          <View style={styles.countdownCard}>
            <Text style={styles.countdownLabel}>YOUR EARLY WINDOW CLOSES IN</Text>
            <View style={styles.countdownRow}>
              <CountdownUnit value={hours} label="hrs" />
              <Text style={styles.countdownColon}>:</Text>
              <CountdownUnit value={minutes} label="min" />
              <Text style={styles.countdownColon}>:</Text>
              <CountdownUnit value={seconds} label="sec" />
            </View>
          </View>

          <Pressable
            style={styles.shopButton}
            onPress={() => showToast('Checkout is coming soon — stay tuned!', 'info')}
          >
            <Text style={styles.shopButtonText}>Shop this drop</Text>
            <Icon name="arrow.right" size={16} tintColor={colors.light.neutral.white} />
          </Pressable>

          <Pressable
            style={styles.teaserRow}
            disabled={!teaser.href}
            onPress={() => teaser.href && router.push(teaser.href as any)}
          >
            <Text style={styles.teaserText}>{teaser.text}</Text>
          </Pressable>
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
  hero: {
    height: 380,
    backgroundColor: colors.light.surfaceAlt,
  },
  heroBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  membersOnlyBadge: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  membersOnlyText: {
    color: colors.light.neutral.white,
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  name: {
    fontSize: 27,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
  },
  priceStrike: {
    fontSize: 15,
    color: colors.light.textSoft,
    textDecorationLine: 'line-through',
  },
  savePct: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.semantic.success,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textAlt,
    marginBottom: 20,
  },
  countdownCard: {
    backgroundColor: colors.light.primary[50],
    borderWidth: 1,
    borderColor: colors.light.primary[100],
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.light.primary[600],
    textAlign: 'center',
    marginBottom: 12,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 10,
  },
  countdownUnit: {
    alignItems: 'center',
    minWidth: 48,
  },
  countdownValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.light.primary[700],
  },
  countdownUnitLabel: {
    fontSize: 11,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  countdownColon: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.primary[200],
    marginTop: 2,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.light.primary[500],
    borderRadius: 999,
    paddingVertical: 16,
    ...shadows.sm,
  },
  shopButtonText: {
    color: colors.light.neutral.white,
    fontSize: 16,
    fontWeight: '700',
  },
  teaserRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  teaserText: {
    fontSize: 13,
    color: colors.light.textMuted,
    textAlign: 'center',
  },
})
