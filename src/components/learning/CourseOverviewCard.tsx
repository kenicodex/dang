import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { CourseDetail } from './courseDetail.data'

interface CourseOverviewCardProps {
  course: CourseDetail
}

export function CourseOverviewCard({ course }: CourseOverviewCardProps) {
  const stats = [
    { icon: 'folder' as const, label: `${course.moduleCount} Modules` },
    { icon: 'play.rectangle' as const, label: `${course.lessonCount} lessons` },
    { icon: 'clock' as const, label: `${course.duration} study time` },
    { icon: 'graduationcap' as const, label: `${course.studentsCount} students` },
  ]

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Course Overview</Text>
      {stats.map(stat => (
        <View key={stat.label} style={styles.row}>
          <Icon name={stat.icon} size={16} tintColor={colors.light.textMuted} />
          <Text style={styles.rowText}>{stat.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    ...shadows.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowText: {
    fontSize: 14,
    color: colors.light.textAlt,
  },
})
