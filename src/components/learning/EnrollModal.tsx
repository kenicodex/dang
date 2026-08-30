import React from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { CourseDetail } from './courseDetail.data'

interface EnrollModalProps {
  visible: boolean
  course: CourseDetail
  onClose: () => void
  onEnroll: () => void
}

export function EnrollModal({ visible, course, onClose, onEnroll }: EnrollModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
          <Icon name="xmark" size={16} tintColor={colors.light.text} />
        </Pressable>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>Enroll in this course</Text>
          <Text variant="h2" style={styles.courseTitle}>
            {course.title}
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What you&rsquo;ll learn</Text>
            {course.whatYouLearn.map(item => (
              <View key={item} style={styles.row}>
                <View style={styles.checkBubble}>
                  <Icon name="checkmark" size={11} tintColor={colors.light.primary[600]} weight="bold" />
                </View>
                <Text style={styles.rowText}>{item}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Enroll Now" onPress={onEnroll} style={styles.enrollButton} />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  eyebrow: {
    fontSize: 15,
    color: colors.light.textSoft,
  },
  courseTitle: {
    marginTop: -4,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 16,
    gap: 14,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  row: {
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
  rowText: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  enrollButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
})
