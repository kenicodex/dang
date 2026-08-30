import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { FeaturedCourse } from './learning.data'

interface FeaturedCourseCardProps {
  course: FeaturedCourse
  onPress?: () => void
}

export function FeaturedCourseCard({ course, onPress }: FeaturedCourseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#3f3f45', '#0a0a0c']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.cover}
      >
        <View style={styles.badges}>
          <View style={styles.featuredBadge}>
            <Icon name="star.fill" size={10} tintColor={colors.light.primary[600]} />
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{course.category}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={styles.instructor}>{course.instructor}</Text>
        </View>
      </LinearGradient>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          {course.lessonCount} Lessons · {course.duration}
        </Text>
        {course.certificate && (
          <View style={styles.certRow}>
            <Icon name="rosette" size={13} tintColor={colors.light.semantic.warning} />
            <Text style={styles.certText}>Certificate Included</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.light.bg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cover: {
    height: 190,
    padding: 16,
    justifyContent: 'space-between',
  },
  badges: {
    gap: 8,
    alignItems: 'flex-start',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.light.bg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.neutral.white,
    marginBottom: 4,
  },
  instructor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  meta: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.semantic.warning,
  },
})
