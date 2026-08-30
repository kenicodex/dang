import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { DangFooter } from '@/components/account/DangFooter'
import { SUPPORT_CATEGORIES } from '@/components/support/support.data'
import { useSupportStore } from '@/store/useSupportStore'
import { colors } from '@/theme/colors'

export default function ContactSupportScreen() {
  const params = useLocalSearchParams<{ category?: string }>()
  const [category, setCategory] = useState(params.category ?? '')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [categorySheetVisible, setCategorySheetVisible] = useState(false)
  const submitRequest = useSupportStore(s => s.submitRequest)

  const canSubmit = !!category

  const handleSubmit = () => {
    if (!canSubmit) return
    const request = submitRequest({ category, subject, message })
    router.replace(`/(account)/help/request-submitted?id=${request.id}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Contact Support
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <Icon name="headphones" size={30} tintColor={colors.light.primary[500]} />
        </View>
        <Text style={styles.heading}>We’re Here To Help!</Text>
        <Text style={styles.subheading}>Tell us what is going on and we will get back to you as soon as possible.</Text>

        <Text style={styles.fieldLabel}>Category</Text>
        <Pressable style={styles.selectField} onPress={() => setCategorySheetVisible(true)}>
          <Text style={[styles.selectValue, !category && styles.selectPlaceholder]}>
            {category || 'Select a category'}
          </Text>
          <Icon name="chevron.down" size={16} tintColor={colors.light.textSoft} />
        </Pressable>

        <Input
          label="Subject (Optional)"
          value={subject}
          onChangeText={setSubject}
          placeholder="e.g. Premium membership not showing"
          containerStyle={styles.field}
        />

        <Text style={styles.fieldLabel}>Tell us more (Optional)</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Describe what's happening..."
          placeholderTextColor={colors.light.textSoft}
          multiline
          textAlignVertical="top"
          style={styles.textarea}
        />

        <Text style={styles.fieldLabel}>Attachments (Optional)</Text>
        <Pressable style={styles.selectField}>
          <Icon name="paperclip" size={16} tintColor={colors.light.textSoft} />
          <Text style={styles.attachmentPlaceholder}>Upload a screenshot or file</Text>
        </Pressable>

        <Button
          title="Send request"
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={styles.submitButton}
        />

        <DangFooter />
      </ScrollView>

      <ActionSheet
        visible={categorySheetVisible}
        onClose={() => setCategorySheetVisible(false)}
        actions={SUPPORT_CATEGORIES.map(c => ({ label: c, onPress: () => setCategory(c) }))}
      />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.light.primary[200],
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  heading: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  selectValue: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  selectPlaceholder: {
    color: colors.light.textSoft,
  },
  attachmentPlaceholder: {
    fontSize: 15,
    color: colors.light.textSoft,
  },
  field: {
    marginBottom: 18,
  },
  textarea: {
    height: 110,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.light.text,
    marginBottom: 18,
  },
  submitButton: {
    borderRadius: 999,
    marginTop: 8,
  },
})
