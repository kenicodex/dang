import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { colors } from '@/theme/colors'
import type { Course } from '@/types/learning'

interface CourseCardProps {
  course: Course
  onPress?: () => void
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  const progress = course.progress || 0
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cover}>
          <Text style={styles.coverEmoji}>{course.emoji || '📚'}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.tags}>
            {course.tier && <Badge label={course.tier} tone="info" />}
            {course.isLive && <Badge label="LIVE" tone="danger" />}
          </View>
          <Text variant="h3" style={styles.title}>{course.title}</Text>
          <Text variant="caption" style={styles.instructor}>by {course.instructor}</Text>
          <Text variant="body" style={styles.description} numberOfLines={2}>
            {course.description}
          </Text>
          <View style={styles.progressWrap}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text variant="caption">{progress}% complete</Text>
          </View>
          <View style={styles.meta}>
            <Text variant="caption">📹 {course.lessonCount} lessons</Text>
            <Text variant="caption">⏱️ {course.duration}</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cover: {
    height: 140,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: {
    fontSize: 56,
  },
  body: {
    padding: 16,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  instructor: {
    marginBottom: 10,
  },
  description: {
    color: '#6B7280',
    marginBottom: 14,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.light.primary[500],
    borderRadius: 3,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
})
