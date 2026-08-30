import type { ReactNode } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Badge } from '@/components/ui/Badge'
import { Text } from '@/components/ui/Text'
import { STATUS_META } from '@/components/support/support.data'
import { useSupportStore } from '@/store/useSupportStore'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const request = useSupportStore(s => s.requests.find(r => r.id === id))

  if (!request) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
          </Pressable>
          <Text variant="h3" style={styles.headerTitle}>
            Request details
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.empty}>This request is no longer available.</Text>
      </SafeAreaView>
    )
  }

  const status = STATUS_META[request.status]

  const infoRows: { icon: SymbolViewProps['name']; iconBg: string; label: string; value: ReactNode }[] = [
    { icon: 'tag', iconBg: colors.light.secondary[100], label: 'Category', value: request.category },
    { icon: 'paperplane', iconBg: colors.light.tertiary[100], label: 'Submitted on', value: request.submittedAt },
    { icon: 'clock', iconBg: '#FDE9C8', label: 'Last updated', value: request.updatedLabel },
    {
      icon: 'doc.text',
      iconBg: colors.light.primary[100],
      label: 'Status',
      value: <Badge label={status.label} tone={status.tone} />,
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Request details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <Icon name="doc.text" size={26} tintColor={colors.light.primary[500]} />
        </View>

        <Text style={styles.id}>#{request.id}</Text>
        <View style={styles.statusWrap}>
          <Badge label={status.label} tone={status.tone} />
        </View>
        <Text style={styles.subject}>{request.subject}</Text>

        <View style={styles.card}>
          {infoRows.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index === infoRows.length - 1 && styles.infoRowLast]}>
              <View style={[styles.infoIcon, { backgroundColor: row.iconBg }]}>
                <Icon name={row.icon} size={16} tintColor={colors.light.primary[700]} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                {typeof row.value === 'string' ? (
                  <Text style={styles.infoValue}>{row.value}</Text>
                ) : (
                  row.value
                )}
              </View>
            </View>
          ))}
        </View>

        <Text variant="label" style={styles.sectionLabel}>
          What you submitted
        </Text>
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{request.message}</Text>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push(`/(account)/help/chat/${request.id}`)}>
        <Icon name="bubble.left.and.bubble.right.fill" size={22} tintColor={colors.light.neutral.white} />
      </Pressable>
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
    paddingTop: 12,
    paddingBottom: 100,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.light.primary[200],
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  id: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.textSoft,
    marginBottom: 8,
  },
  statusWrap: {
    marginBottom: 12,
  },
  subject: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderAlt,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    gap: 3,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  messageCard: {
    width: '100%',
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 18,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textAlt,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
