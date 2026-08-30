import React, { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

interface OutcomeScreenProps {
  topEmojis?: string
  icon: string
  title: string
  description: ReactNode
  ctaLabel: string
  onPressCta: () => void
  children?: ReactNode
}

export function OutcomeScreen({ topEmojis, icon, title, description, ctaLabel, onPressCta, children }: OutcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {topEmojis && <Text style={styles.topEmojis}>{topEmojis}</Text>}
        <View style={styles.iconRing}>
          <Text style={styles.iconEmoji}>{icon}</Text>
        </View>
        <Text variant="h2" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>

        {children && <View style={styles.cards}>{children}</View>}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={ctaLabel} onPress={onPressCta} style={styles.cta} />
      </View>
    </SafeAreaView>
  )
}

interface InfoCardProps {
  tone?: 'purple' | 'amber'
  heading?: string
  children: ReactNode
}

export function InfoCard({ tone = 'purple', heading, children }: InfoCardProps) {
  return (
    <View style={[styles.card, tone === 'amber' ? styles.cardAmber : styles.cardPurple]}>
      {heading && (
        <Text style={[styles.cardHeading, tone === 'amber' && styles.cardHeadingAmber]}>{heading}</Text>
      )}
      <View style={styles.cardRows}>{children}</View>
    </View>
  )
}

interface InfoCardRowProps {
  icon: string
  title: string
  subtitle?: string
}

export function InfoCardRow({ icon, title, subtitle }: InfoCardRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 24,
  },
  topEmojis: {
    fontSize: 26,
    letterSpacing: 6,
    marginBottom: 14,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.light.surface,
    borderWidth: 3,
    borderColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    ...shadows.sm,
  },
  iconEmoji: {
    fontSize: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  cards: {
    width: '100%',
    gap: 12,
    marginTop: 28,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  cardPurple: {
    backgroundColor: colors.light.primary[50],
    borderColor: colors.light.primary[100],
  },
  cardAmber: {
    backgroundColor: colors.light.semantic.warningBg,
    borderColor: '#F3DDA8',
  },
  cardHeading: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.light.primary[600],
    marginBottom: 12,
  },
  cardHeadingAmber: {
    color: colors.light.semantic.warning,
  },
  cardRows: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconText: {
    fontSize: 16,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cta: {
    alignSelf: 'stretch',
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
})
