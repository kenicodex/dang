import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { DangFooter } from '@/components/account/DangFooter'
import { colors } from '@/theme/colors'

const REASONS = ['Bug/crash', 'Inappropriate content', 'Account issues', 'Payment problems', 'Other']

export default function ReportProblemScreen() {
  const [reason, setReason] = useState<string | null>(null)
  const [details, setDetails] = useState('')

  const canSubmit = !!reason

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Report a Problem
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Report a Problem</Text>
        <Text style={styles.subheading}>Help us improve Dang. Tell us what went wrong.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reason for Reporting</Text>
          {REASONS.map(item => {
            const selected = reason === item
            return (
              <Pressable key={item} style={styles.radioRow} onPress={() => setReason(item)}>
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{item}</Text>
              </Pressable>
            )
          })}
        </View>

        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Describe the issue in detail..."
          placeholderTextColor={colors.light.textSoft}
          multiline
          textAlignVertical="top"
          style={styles.textarea}
        />

        <Button title="Report" disabled={!canSubmit} style={styles.reportButton} onPress={() => router.back()} />
        <Pressable style={styles.cancel} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <DangFooter />
      </ScrollView>
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
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.light.textMuted,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.light.bg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.light.textSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.light.primary[500],
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.light.primary[500],
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  textarea: {
    height: 120,
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 18,
  },
  reportButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
})
