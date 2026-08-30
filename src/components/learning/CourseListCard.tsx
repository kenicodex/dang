import React from 'react'
import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { CourseListItem } from './learning.data'

interface CourseListCardProps {
  course: CourseListItem
  onPress?: () => void
}

export function CourseListCard({ course, onPress }: CourseListCardProps) {
  const showProgress = typeof course.progress === 'number'

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: course.coverUrl }} style={styles.thumb} contentFit="cover" />
      <View style={styles.info}>
        <Text variant="h3" style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.instructor} numberOfLines={1}>
          {course.instructor}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{course.lessonCount} Lessons</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>

        {showProgress && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{course.progress}%</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.sm,
  },
  thumb: {
    width: 112,
    backgroundColor: colors.light.surfaceAlt,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 5,
  },
  title: {
    letterSpacing: -0.2,
  },
  instructor: {
    fontSize: 14,
    color: colors.light.textSoft,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.light.textSoft,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.light.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.light.primary[500],
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.textMuted,
    minWidth: 32,
    textAlign: 'right',
  },
})
