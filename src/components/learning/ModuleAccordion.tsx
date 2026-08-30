import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { CourseLesson, CourseModule } from './courseDetail.data'

interface ModuleAccordionProps {
  modules: CourseModule[]
  enrolled?: boolean
  completedLessonIds?: string[]
  onSelectLesson?: (lesson: CourseLesson) => void
  defaultExpandedId?: string
}

export function ModuleAccordion({
  modules,
  enrolled,
  completedLessonIds = [],
  onSelectLesson,
  defaultExpandedId,
}: ModuleAccordionProps) {
  const [expandedId, setExpandedId] = useState(defaultExpandedId)

  return (
    <View style={styles.list}>
      {modules.map(module => {
        const expanded = expandedId === module.id
        return (
          <View key={module.id} style={styles.module}>
            <Pressable
              style={styles.moduleHeader}
              onPress={() => setExpandedId(expanded ? undefined : module.id)}
            >
              <View style={styles.moduleHeaderText}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleMeta}>{module.lessonCount} Lessons</Text>
              </View>
              <Icon
                name={expanded ? 'chevron.up' : 'chevron.down'}
                size={14}
                tintColor={colors.light.textSoft}
              />
            </Pressable>

            {expanded && (
              <View style={styles.lessonList}>
                {module.lessons.map(lesson => {
                  const completed = completedLessonIds.includes(lesson.id)
                  return (
                    <Pressable
                      key={lesson.id}
                      style={styles.lessonRow}
                      onPress={() => onSelectLesson?.(lesson)}
                    >
                      <Icon name="play.circle" size={20} tintColor={colors.light.primary[500]} />
                      <Text style={styles.lessonTitle} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      {enrolled ? (
                        <Icon
                          name={completed ? 'checkmark.circle.fill' : 'circle'}
                          size={18}
                          tintColor={completed ? colors.light.semantic.success : colors.light.border}
                        />
                      ) : (
                        <Icon name="arrow.down.circle" size={18} tintColor={colors.light.textSoft} />
                      )}
                    </Pressable>
                  )
                })}
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  module: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  moduleHeaderText: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  moduleMeta: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  lessonList: {
    borderTopWidth: 1,
    borderTopColor: colors.light.borderAlt,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  lessonTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.light.text,
  },
})
