import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Clipboard from 'expo-clipboard'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { DangFooter } from '@/components/account/DangFooter'
import { colors } from '@/theme/colors'

const NEXT_STEPS = [
  "We'll review your request",
  'Our team will respond via email and in-app',
  'You can track your request in "My Requests"',
]

export default function RequestSubmittedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!id) return
    await Clipboard.setStringAsync(`#${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/(account)/help')} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <Icon name="checkmark" size={36} weight="bold" tintColor={colors.light.primary[500]} />
        </View>

        <Text style={styles.title}>Request Submitted!</Text>
        <Text style={styles.subtitle}>
          Thank you for reaching out. We’ve received your message and our team will get back to you soon
        </Text>

        <View style={styles.refBox}>
          <View>
            <Text style={styles.refLabel}>Reference Number</Text>
            <Text style={styles.refValue}>#{id}</Text>
          </View>
          <Pressable style={styles.copyButton} onPress={handleCopy} hitSlop={8}>
            <Icon
              name={copied ? 'checkmark' : 'doc.on.doc'}
              size={16}
              tintColor={colors.light.primary[600]}
            />
          </Pressable>
        </View>

        <Text style={styles.nextLabel}>What happens next?</Text>
        <View style={styles.nextList}>
          {NEXT_STEPS.map(step => (
            <View key={step} style={styles.nextRow}>
              <View style={styles.nextCheck}>
                <Icon name="checkmark" size={11} weight="bold" tintColor={colors.light.primary[600]} />
              </View>
              <Text style={styles.nextText}>{step}</Text>
            </View>
          ))}
        </View>

        <Button
          title="View my request"
          onPress={() => router.replace(`/(account)/help/request/${id}`)}
          style={styles.viewButton}
        />

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
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 28,
  },
  refBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.primary[50],
    borderWidth: 1,
    borderColor: colors.light.primary[200],
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28,
  },
  refLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginBottom: 2,
  },
  refValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.light.text,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  nextList: {
    gap: 10,
    marginBottom: 28,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
  },
  viewButton: {
    borderRadius: 999,
  },
})
