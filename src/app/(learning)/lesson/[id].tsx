import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { getLessonContext, ContentBlocks, PrevNextBar } from '@/components/learning'
import { useLearningStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

type LessonTab = 'content' | 'resources'

export default function LessonPlayerScreen() {
  const { id, courseId } = useLocalSearchParams<{ id: string; courseId?: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const completedLessonIds = useLearningStore(s => s.completedLessonIds)
  const toggleLessonCompleted = useLearningStore(s => s.toggleLessonCompleted)

  const [tab, setTab] = useState<LessonTab>('content')

  const context = getLessonContext(courseId, id)

  if (!context) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Lesson not found.</Text>
      </SafeAreaView>
    )
  }

  const { course, lesson, index, prevLesson, nextLesson } = context
  const completed = completedLessonIds.includes(lesson.id)

  const goTo = (lessonId: string) => router.replace(`/(learning)/lesson/${lessonId}?courseId=${courseId}` as any)

  const handleToggleComplete = () => {
    const wasCompleted = completed
    toggleLessonCompleted(lesson.id)

    if (!wasCompleted) {
      const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id))
      const willBeComplete = courseLessonIds.every(lid => lid === lesson.id || completedLessonIds.includes(lid))
      if (willBeComplete) {
        router.replace(`/(learning)/course/${course.id}?justCompleted=1` as any)
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Lesson {index + 1}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {lesson.coverUrl ? (
          <Image source={{ uri: lesson.coverUrl }} style={styles.hero} contentFit="cover" />
        ) : (
          <View style={styles.heroEmpty}>
            <View style={styles.playCircle}>
              <Icon name="play.fill" size={18} tintColor={colors.light.textSoft} />
            </View>
            <Text style={styles.heroEmptyText}>No video content available</Text>
          </View>
        )}

        <Pressable
          style={[styles.completeButton, completed && styles.completeButtonDone]}
          onPress={handleToggleComplete}
        >
          {completed && <Icon name="checkmark" size={14} tintColor={colors.light.primary[600]} weight="bold" />}
          <Text style={[styles.completeButtonText, completed && styles.completeButtonTextDone]}>
            {completed ? 'Completed' : 'Mark as completed'}
          </Text>
        </Pressable>

        <Tabs
          tabs={[
            { value: 'content', label: 'Content' },
            { value: 'resources', label: 'Resources' },
          ]}
          value={tab}
          onChange={setTab}
          style={styles.tabRow}
        />

        {tab === 'content' &&
          (lesson.content ? (
            <View style={styles.contentCard}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <ContentBlocks blocks={lesson.content} />
            </View>
          ) : (
            <EmptyState
              icon={<Icon name="cloud.fill" size={40} tintColor={colors.light.primary[300]} />}
              title="No written content for this lesson"
              description="This lesson is available as a video. Continue watching to complete the lesson."
            />
          ))}

        {tab === 'resources' &&
          (lesson.resources?.length ? (
            <View style={styles.resourceList}>
              {lesson.resources.map(resource => (
                <View key={resource.id} style={styles.resourceRow}>
                  <Icon name="doc.text" size={16} tintColor={colors.light.primary[500]} />
                  <Text style={styles.resourceLabel}>{resource.label}</Text>
                  <Icon name="arrow.down.circle" size={18} tintColor={colors.light.textSoft} />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Icon name="cloud.fill" size={40} tintColor={colors.light.primary[300]} />}
              title="No resources available"
              description="This lesson doesn't include any additional resources."
            />
          ))}
      </ScrollView>

      <View style={[styles.navBarWrap, { bottom: insets.bottom + 20 }]}>
        <PrevNextBar
          onPrevious={prevLesson ? () => goTo(prevLesson.id) : undefined}
          onNext={nextLesson ? () => goTo(nextLesson.id) : undefined}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  notFound: {
    padding: 20,
    color: colors.light.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 18,
    backgroundColor: colors.light.surfaceAlt,
  },
  heroEmpty: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 18,
    backgroundColor: colors.light.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmptyText: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.light.text,
    borderRadius: 999,
    paddingVertical: 16,
  },
  completeButtonDone: {
    backgroundColor: colors.light.primary[50],
  },
  completeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  completeButtonTextDone: {
    color: colors.light.primary[600],
  },
  tabRow: {
    marginTop: -4,
  },
  contentCard: {
    gap: 14,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.light.text,
  },
  resourceList: {
    gap: 10,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    padding: 14,
    ...shadows.sm,
  },
  resourceLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.light.text,
  },
  navBarWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
})
