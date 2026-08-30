import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { colors } from '@/theme/colors'

interface CourseCompleteSheetProps {
  visible: boolean
  courseTitle: string
  lessonsCount: number
  totalTime: string
  onViewCertificate: () => void
  onClose: () => void
}

export function CourseCompleteSheet({
  visible,
  courseTitle,
  lessonsCount,
  totalTime,
  onViewCertificate,
  onClose,
}: CourseCompleteSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose} snapPoint={480}>
      <View style={styles.container}>
        <View style={styles.badgeRing}>
          <Icon name="star.fill" size={9} tintColor={colors.light.semantic.warning} style={styles.starTopLeft} />
          <Icon name="star.fill" size={9} tintColor={colors.light.semantic.warning} style={styles.starTopRight} />
          <View style={styles.badgeCircle}>
            <Icon name="rosette" size={30} tintColor={colors.light.neutral.white} />
          </View>
        </View>

        <Text style={styles.eyebrow}>COURSE COMPLETE</Text>
        <Text variant="h2" style={styles.title}>
          You did it! 🎉
        </Text>
        <Text style={styles.description}>
          You&rsquo;ve completed <Text style={styles.courseTitle}>{courseTitle}</Text>. Your progress has been saved.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{lessonsCount}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{totalTime}</Text>
            <Text style={styles.statLabel}>Total time</Text>
          </View>
        </View>

        <Button title="View Certificate" onPress={onViewCertificate} style={styles.primaryButton} />
        <Button title="Back to course" variant="ghost" onPress={onClose} style={styles.secondaryButton} textStyle={styles.secondaryButtonText} />
      </View>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  badgeRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  starTopLeft: {
    position: 'absolute',
    top: 6,
    left: 8,
  },
  starTopRight: {
    position: 'absolute',
    top: 10,
    right: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.primary[500],
    marginBottom: 6,
  },
  title: {
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textMuted,
    textAlign: 'center',
    maxWidth: 300,
  },
  courseTitle: {
    color: colors.light.text,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 24,
    marginBottom: 28,
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.light.border,
  },
  primaryButton: {
    alignSelf: 'stretch',
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
    marginBottom: 10,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    borderRadius: 999,
    backgroundColor: colors.light.primary[50],
  },
  secondaryButtonText: {
    color: colors.light.primary[600],
  },
})
