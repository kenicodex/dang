import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterChips } from '@/components/ui/FilterChips'
import {
  getCourseDetail,
  countCourseLessons,
  CourseOverviewCard,
  ModuleAccordion,
  EnrollModal,
  CertificatePreview,
  CourseCompleteSheet,
  SessionListCard,
  COURSE_LIVE_SESSIONS,
  type CourseLesson,
  type CourseResource,
  type SessionStatus,
} from '@/components/learning'
import { useAuthStore, useLearningStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

type UnenrolledTab = 'information' | 'content'
type EnrolledTab = 'content' | 'live' | 'resources' | 'information'
type SessionFilter = 'all' | SessionStatus

const SESSION_FILTERS: { value: SessionFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
]

export default function CourseDetailScreen() {
  const { id, justCompleted } = useLocalSearchParams<{ id: string; justCompleted?: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const user = useAuthStore(s => s.user)

  const enrolledCourseIds = useLearningStore(s => s.enrolledCourseIds)
  const completedLessonIds = useLearningStore(s => s.completedLessonIds)
  const enroll = useLearningStore(s => s.enroll)

  const course = useMemo(() => getCourseDetail(id), [id])
  const isEnrolled = !!course && enrolledCourseIds.includes(course.id)

  const [unenrolledTab, setUnenrolledTab] = useState<UnenrolledTab>('information')
  const [enrolledTab, setEnrolledTab] = useState<EnrolledTab>('content')
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [enrollModalVisible, setEnrollModalVisible] = useState(false)
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>('all')
  const [completeSheetVisible, setCompleteSheetVisible] = useState(justCompleted === '1')

  if (!course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Course not found.</Text>
      </SafeAreaView>
    )
  }

  const totalLessons = countCourseLessons(course)
  const completedCount = course.modules
    .flatMap(m => m.lessons)
    .filter(l => completedLessonIds.includes(l.id)).length
  const percentComplete = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const courseCompleted = totalLessons > 0 && completedCount === totalLessons

  const allResources: CourseResource[] = course.modules.flatMap(m => m.lessons.flatMap(l => l.resources ?? []))
  const filteredSessions = (COURSE_LIVE_SESSIONS[course.id] ?? []).filter(
    session => sessionFilter === 'all' || session.status === sessionFilter,
  )

  const goToLesson = (lesson: CourseLesson) => {
    router.push(`/(learning)/lesson/${lesson.id}?courseId=${course.id}` as any)
  }

  const nextLesson = course.modules.flatMap(m => m.lessons).find(l => !completedLessonIds.includes(l.id))

  const informationContent = (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About the course</Text>
        <Text style={styles.description} numberOfLines={descriptionExpanded ? undefined : 4}>
          {course.description}
        </Text>
        <Pressable style={styles.showMoreRow} onPress={() => setDescriptionExpanded(v => !v)}>
          <Text style={styles.showMoreText}>{descriptionExpanded ? 'Show less' : 'Show more'}</Text>
          <Icon
            name={descriptionExpanded ? 'chevron.up' : 'chevron.down'}
            size={12}
            tintColor={colors.light.primary[500]}
          />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What you&rsquo;ll learn</Text>
        {course.whatYouLearn.map(item => (
          <View key={item} style={styles.checkRow}>
            <View style={styles.checkBubble}>
              <Icon name="checkmark" size={11} tintColor={colors.light.primary[600]} weight="bold" />
            </View>
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Requirements</Text>
        {course.requirements.map((item, i) => (
          <View key={item} style={styles.checkRow}>
            <View style={styles.numberBubble}>
              <Text style={styles.numberText}>{i + 1}</Text>
            </View>
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Instructor</Text>
        <View style={styles.instructorRow}>
          <Avatar uri={course.instructorAvatarUrl} initials={course.instructor.slice(0, 2)} size="md" />
          <Text style={styles.instructorName}>{course.instructor}</Text>
        </View>
      </View>

      {course.hasCertificate && (
        <View>
          <Text style={styles.certificateHeading}>Earn a certificate of completion</Text>
          <Pressable
            disabled={!courseCompleted}
            onPress={() => router.push(`/(learning)/certificate/${course.id}` as any)}
          >
            <CertificatePreview
              courseTitle={course.title}
              recipientName={user?.displayName ?? 'Your Name'}
              completedOn={courseCompleted ? new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined}
              locked={!courseCompleted}
            />
          </Pressable>
        </View>
      )}
    </View>
  )

  const contentContent = (
    <View style={styles.tabContent}>
      <Text style={styles.cardTitle}>Course Content</Text>
      <ModuleAccordion
        modules={course.modules}
        enrolled={isEnrolled}
        completedLessonIds={completedLessonIds}
        onSelectLesson={goToLesson}
        defaultExpandedId={isEnrolled ? course.modules[0]?.id : undefined}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Icon name="square.and.arrow.up" size={16} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.category}>{course.category}</Text>
        <Text variant="h2" style={styles.title}>
          {course.title}
        </Text>

        <Image source={{ uri: course.coverUrl }} style={styles.hero} contentFit="cover" />

        {isEnrolled ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Course Progress</Text>
            <Text style={styles.progressCaption}>
              {completedCount} of {totalLessons} lessons complete
            </Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percentComplete}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{percentComplete}%</Text>
            </View>
          </View>
        ) : (
          <CourseOverviewCard course={course} />
        )}

        {isEnrolled ? (
          <>
            <Tabs
              tabs={[
                { value: 'content', label: 'Content' },
                { value: 'live', label: 'Live session' },
                { value: 'resources', label: 'Resources' },
                { value: 'information', label: 'Information' },
              ]}
              value={enrolledTab}
              onChange={setEnrolledTab}
              stretch={false}
              style={styles.tabRow}
            />

            {enrolledTab === 'content' && contentContent}
            {enrolledTab === 'information' && informationContent}
            {enrolledTab === 'live' && (
              <View style={styles.tabContent}>
                <FilterChips chips={SESSION_FILTERS} value={sessionFilter} onChange={setSessionFilter} />
                {filteredSessions.length > 0 ? (
                  <View style={styles.tabContent}>
                    {filteredSessions.map(session => (
                      <SessionListCard
                        key={session.id}
                        session={session}
                        onPress={() => router.push(`/(learning)/session/${session.id}` as any)}
                      />
                    ))}
                  </View>
                ) : (
                  <EmptyState
                    title="No sessions here"
                    description="Try a different filter, or check back once new sessions are scheduled."
                  />
                )}
              </View>
            )}
            {enrolledTab === 'resources' && (
              <View style={styles.tabContent}>
                {allResources.length > 0 ? (
                  allResources.map(resource => (
                    <View key={resource.id} style={styles.resourceRow}>
                      <Icon name="doc.text" size={16} tintColor={colors.light.primary[500]} />
                      <Text style={styles.resourceLabel}>{resource.label}</Text>
                      <Icon name="arrow.down.circle" size={18} tintColor={colors.light.textSoft} />
                    </View>
                  ))
                ) : (
                  <EmptyState title="No resources available" description="This course doesn't include any downloadable resources yet." />
                )}
              </View>
            )}
          </>
        ) : (
          <>
            <Tabs
              tabs={[
                { value: 'information', label: 'Information' },
                { value: 'content', label: 'Content' },
              ]}
              value={unenrolledTab}
              onChange={setUnenrolledTab}
              style={styles.tabRow}
            />
            {unenrolledTab === 'information' ? informationContent : contentContent}
          </>
        )}
      </ScrollView>

      <View style={[styles.floatingButtonWrap, { bottom: insets.bottom + 20 }]}>
        <Pressable
          style={styles.floatingButton}
          onPress={() => (isEnrolled ? nextLesson && goToLesson(nextLesson) : setEnrollModalVisible(true))}
        >
          <Text style={styles.floatingButtonText}>{isEnrolled ? 'Continue Learning' : 'Enroll into course'}</Text>
        </Pressable>
      </View>

      <EnrollModal
        visible={enrollModalVisible}
        course={course}
        onClose={() => setEnrollModalVisible(false)}
        onEnroll={() => {
          enroll(course.id)
          setEnrollModalVisible(false)
          setEnrolledTab('content')
        }}
      />

      <CourseCompleteSheet
        visible={completeSheetVisible}
        courseTitle={course.title}
        lessonsCount={totalLessons}
        totalTime={course.duration}
        onViewCertificate={() => {
          setCompleteSheetVisible(false)
          router.push(`/(learning)/certificate/${course.id}` as any)
        }}
        onClose={() => setCompleteSheetVisible(false)}
      />
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
    paddingBottom: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
  },
  category: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  title: {
    marginTop: -2,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: 18,
    backgroundColor: colors.light.surfaceAlt,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.light.textAlt,
  },
  showMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  showMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  checkText: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
    lineHeight: 20,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  certificateHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  progressCaption: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: -6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.light.primary[500],
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.textMuted,
  },
  tabRow: {
    marginTop: 4,
  },
  tabContent: {
    gap: 16,
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
  floatingButtonWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: colors.light.primary[500],
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.lg,
  },
  floatingButtonText: {
    color: colors.light.neutral.white,
    fontSize: 16,
    fontWeight: '700',
  },
})
