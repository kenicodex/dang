import { useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { FilterChips, Tabs } from '@/components/ui'
import {
  CATEGORIES,
  DISCOVER_COURSES,
  FEATURED_COURSE,
  FeaturedCourseCard,
  CourseListCard,
  MY_COURSES,
  MY_COURSES_FILTERS,
} from '@/components/learning'
import { colors } from '@/theme/colors'

type HubTab = 'discover' | 'myCourses'

export default function LearningHubScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<HubTab>('discover')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [myCoursesFilter, setMyCoursesFilter] = useState(MY_COURSES_FILTERS[0])

  const discoverCourses = useMemo(
    () => DISCOVER_COURSES.filter(course => category === 'All' || course.category === category),
    [category],
  )

  const myCourses = useMemo(
    () =>
      MY_COURSES.filter(course => {
        if (myCoursesFilter === 'Ongoing') return (course.progress ?? 0) < 100
        if (myCoursesFilter === 'Completed') return course.progress === 100
        return true
      }),
    [myCoursesFilter],
  )

  const goToCourse = (id: string) => router.push(`/(learning)/course/${id}`)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Avatar initials="ME" size="sm" />
        <Text variant="h2" style={styles.headerTitle}>
          Learning Hub
        </Text>
        <Pressable style={styles.searchButton} hitSlop={8}>
          <Icon name="magnifyingglass" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: 'discover', label: 'Discover' },
          { value: 'myCourses', label: 'My Courses' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabRow}
      />

      {tab === 'discover' ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FeaturedCourseCard course={FEATURED_COURSE} onPress={() => goToCourse(FEATURED_COURSE.id)} />

          <FilterChips
            chips={CATEGORIES.map(c => ({ value: c, label: c }))}
            value={category}
            onChange={setCategory}
          />

          <View style={styles.list}>
            {discoverCourses.map(course => (
              <CourseListCard key={course.id} course={course} onPress={() => goToCourse(course.id)} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FilterChips
            chips={MY_COURSES_FILTERS.map(c => ({ value: c, label: c }))}
            value={myCoursesFilter}
            onChange={setMyCoursesFilter}
          />

          <View style={styles.list}>
            {myCourses.map(course => (
              <CourseListCard key={course.id} course={course} onPress={() => goToCourse(course.id)} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  list: {
    gap: 14,
  },
})
