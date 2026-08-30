import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { FEATURED_DROP, RADIANCE_SET_PRODUCT } from '@/components/commerce'
import { useLifestyleStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { TesterFeedback } from '@/types/commerce'

const MAX_COMMENT_LENGTH = 150

const WOULD_BUY_OPTIONS: { value: TesterFeedback['wouldBuy']; label: string; emoji: string; tint: string }[] = [
  { value: 'yes', label: 'Yes', emoji: '💚', tint: colors.light.semantic.success },
  { value: 'maybe', label: 'Maybe', emoji: '', tint: colors.light.semantic.warning },
  { value: 'no', label: 'No', emoji: '', tint: colors.light.semantic.error },
]

export default function TesterFeedbackScreen() {
  const router = useRouter()
  const { dropId } = useLocalSearchParams<{ dropId?: string }>()
  const submitFeedback = useLifestyleStore(s => s.submitFeedback)
  const showToast = useUIStore(s => s.showToast)

  const resolvedDropId = dropId ?? FEATURED_DROP.id
  const [rating, setRating] = useState(0)
  const [wouldBuy, setWouldBuy] = useState<TesterFeedback['wouldBuy'] | null>(null)
  const [comment, setComment] = useState('')

  const canSubmit = rating > 0 && !!wouldBuy

  const submit = () => {
    if (!canSubmit || !wouldBuy) return
    submitFeedback({ dropId: resolvedDropId, rating, wouldBuy, comment: comment.trim() || undefined })
    showToast('Thanks for your feedback!', 'success')
    router.replace('/(tabs)/home/lifestyle')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Your feedback
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productRow}>
          <Image source={{ uri: RADIANCE_SET_PRODUCT.imageUrl }} style={styles.productThumb} contentFit="cover" />
          <View>
            <Text style={styles.productName}>{RADIANCE_SET_PRODUCT.name}</Text>
            <Text style={styles.productMeta}>Tested for 2 weeks</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>How would you rate it?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(value => (
              <Pressable key={value} onPress={() => setRating(value)} hitSlop={6}>
                <Icon
                  name={value <= rating ? 'star.fill' : 'star'}
                  size={30}
                  tintColor={value <= rating ? colors.light.semantic.warning : colors.light.border}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Would you buy it?</Text>
          <View style={styles.chipRow}>
            {WOULD_BUY_OPTIONS.map(option => {
              const active = wouldBuy === option.value
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.chip,
                    active && { borderColor: option.tint, backgroundColor: `${option.tint}1A` },
                  ]}
                  onPress={() => setWouldBuy(option.value)}
                >
                  <Text style={[styles.chipText, active && { color: option.tint }]}>
                    {option.label}
                    {active && option.emoji ? ` ${option.emoji}` : ''}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tell us more</Text>
          <View style={styles.textareaWrap}>
            <TextInput
              style={styles.textarea}
              value={comment}
              onChangeText={text => setComment(text.slice(0, MAX_COMMENT_LENGTH))}
              placeholder="what did you love? what would you change?"
              placeholderTextColor={colors.light.textSoft}
              multiline
              maxLength={MAX_COMMENT_LENGTH}
            />
          </View>
          <Text style={styles.counter}>
            {comment.length}/{MAX_COMMENT_LENGTH}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit feedback"
          disabled={!canSubmit}
          onPress={submit}
          style={styles.submitButton}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
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
    gap: 22,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 12,
    ...shadows.sm,
  },
  productThumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.light.surfaceAlt,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  productMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.primary[500],
    marginTop: 2,
  },
  field: {
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  textareaWrap: {
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    minHeight: 110,
  },
  textarea: {
    flex: 1,
    padding: 16,
    fontSize: 15,
    color: colors.light.text,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 12,
    color: colors.light.textSoft,
    textAlign: 'right',
    marginTop: -6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
})
