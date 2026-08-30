import { useLocalSearchParams, useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { getCourseDetail, CertificatePreview } from '@/components/learning'
import { useAuthStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'

export default function CourseCertificateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const showToast = useUIStore(s => s.showToast)

  const course = getCourseDetail(id)

  if (!course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Certificate not found.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="xmark" size={16} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Course Certificate
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CertificatePreview
          courseTitle={course.title}
          recipientName={user?.displayName ?? 'Amy Johnson'}
          completedOn={new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
        />

        <Text style={styles.congrats}>
          Congratulations on successfully completing the &ldquo;<Text style={styles.congratsBold}>{course.title}</Text>&rdquo;
          course and earning your certificate!
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Download Certificate"
          onPress={() => showToast('Downloading your certificate…', 'success')}
          icon={<Icon name="arrow.down.circle" size={18} tintColor={colors.light.neutral.white} />}
          style={styles.downloadButton}
        />
        <Button
          title="Share Certificate"
          variant="ghost"
          onPress={() => showToast('Share sheet coming soon.', 'info')}
          icon={<Icon name="square.and.arrow.up" size={16} tintColor={colors.light.primary[600]} />}
          style={styles.shareButton}
          textStyle={styles.shareButtonText}
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
    paddingBottom: 24,
    gap: 20,
  },
  congrats: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.text,
  },
  congratsBold: {
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 10,
  },
  downloadButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  shareButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[50],
  },
  shareButtonText: {
    color: colors.light.primary[600],
  },
})
