import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import type { Lesson } from '@/types/learning'

interface LessonProgressProps {
  lessons: Lesson[]
  onSelectLesson?: (lesson: Lesson) => void
}

export function LessonProgress({ lessons, onSelectLesson }: LessonProgressProps) {
  return (
    <View style={styles.list}>
      {lessons.map((lesson, i) => (
        <Pressable
          key={lesson.id}
          style={[styles.item, lesson.status === 'completed' && styles.completed]}
          onPress={() => onSelectLesson?.(lesson)}
        >
          <View style={styles.index}>
            {lesson.status === 'completed' ? (
              <Text style={styles.check}>✓</Text>
            ) : (
              <Text variant="caption" style={styles.indexNum}>{i + 1}</Text>
            )}
          </View>
          <View style={styles.info}>
            <Text variant="h3" style={styles.title}>{lesson.title}</Text>
            <Text variant="caption">
              {lesson.duration} · {lesson.type}
            </Text>
          </View>
          {lesson.status === 'in_progress' && (
            <Badge label="In Progress" tone="warning" />
          )}
          {lesson.status === 'current' && (
            <Badge label="▶ Current" tone="info" />
          )}
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  completed: {
    opacity: 0.7,
  },
  index: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  indexNum: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
  },
})
