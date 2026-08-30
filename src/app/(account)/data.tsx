import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { DangFooter } from '@/components/account/DangFooter'
import { colors } from '@/theme/colors'

interface ExportItem {
  id: string
  label: string
  size: string
}

const EXPORT_ITEMS: ExportItem[] = [
  { id: 'profile', label: 'Profile', size: '12kb · json' },
  { id: 'posts', label: 'Posts', size: '12kb · json' },
  { id: 'comments', label: 'Comments', size: '12kb · json' },
  { id: 'messages', label: 'Messages', size: '12kb · json' },
  { id: 'likes-reposts', label: 'Likes & Reposts', size: '12kb · json' },
  { id: 'payment-history', label: 'Payment history', size: '12kb · json' },
  { id: 'event-history', label: 'Event history', size: '12kb · json' },
  { id: 'login-activity', label: 'Login activity', size: '12kb · json' },
]

const DEFAULT_SELECTED = ['profile', 'posts', 'comments', 'messages', 'payment-history']

export default function DataPortabilityScreen() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)
  const [confirmed, setConfirmed] = useState(false)

  const allSelected = selected.length === EXPORT_ITEMS.length

  const toggleItem = (id: string) => {
    setSelected(current => (current.includes(id) ? current.filter(i => i !== id) : [...current, id]))
  }

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : EXPORT_ITEMS.map(item => item.id))
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Export My Data
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={styles.heading}>Your Data. Your Choice</Text>
            <Text style={styles.subheading}>
              Download a copy of any of your data instantly. You can download and export what you want, whenever you
              want.
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Icon name="folder.fill" size={32} tintColor={colors.light.primary[500]} />
          </View>
        </View>

        <View style={styles.rightsCard}>
          <Text style={styles.rightsTitle}>Your right to data portability</Text>
          <Text style={styles.rightsBody}>
            Under GDPR (UK) and NDPR (Nigeria) you have the right to export all your personal data in a portable
            format. No technical assistance required.
          </Text>
          <View style={styles.complianceRow}>
            <View style={styles.complianceBadge}>
              <Text style={styles.complianceFlag}>🇬🇧</Text>
              <View>
                <Text style={styles.complianceLabel}>GDPR (UK)</Text>
                <Text style={styles.complianceStatus}>Compliant ✓</Text>
              </View>
            </View>
            <View style={styles.complianceBadge}>
              <Text style={styles.complianceFlag}>🇳🇬</Text>
              <View>
                <Text style={styles.complianceLabel}>NDPR (Nigeria)</Text>
                <Text style={styles.complianceStatus}>Compliant ✓</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.selectHeaderRow}>
          <Text style={styles.selectLabel}>Select Data to Export</Text>
          <Pressable onPress={toggleSelectAll}>
            <Text style={styles.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
          </Pressable>
        </View>

        <View style={styles.itemsCard}>
          {EXPORT_ITEMS.map((item, i) => (
            <View key={item.id} style={[styles.itemRow, i > 0 && styles.itemRowDivider]}>
              <Checkbox checked={selected.includes(item.id)} onChange={() => toggleItem(item.id)} />
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemSize}>{item.size}</Text>
              <Pressable style={styles.downloadPill}>
                <Text style={styles.downloadPillText}>Download</Text>
                <Icon name="arrow.down" size={11} tintColor={colors.light.primary[600]} />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <Icon name="info.circle.fill" size={16} tintColor={colors.light.semantic.warning} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Files will be downloaded to your device</Text>
            <Text style={styles.infoBody}>
              If files are large they will be downloaded as a <Text style={styles.infoBold}>zip</Text> folder.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Confirmation Checkbox</Text>
        <Pressable style={styles.confirmRow} onPress={() => setConfirmed(v => !v)}>
          <Checkbox checked={confirmed} onChange={setConfirmed} />
          <Text style={styles.confirmText}>I am completely aware of this export</Text>
        </Pressable>

        <Button
          title="Export All"
          disabled={!confirmed || selected.length === 0}
          style={styles.exportButton}
          onPress={() => router.back()}
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
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  heroText: {
    flex: 1,
  },
  heading: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.light.text,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textMuted,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightsCard: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  rightsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 6,
  },
  rightsBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textAlt,
    marginBottom: 14,
  },
  complianceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  complianceBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light.bg,
    borderRadius: 14,
    padding: 10,
  },
  complianceFlag: {
    fontSize: 20,
  },
  complianceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.text,
  },
  complianceStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.semantic.success,
  },
  selectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.light.textSoft,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  itemsCard: {
    backgroundColor: colors.light.bg,
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  itemSize: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  downloadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.light.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  downloadPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.light.semantic.warningBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 2,
  },
  infoBody: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.light.textMuted,
  },
  infoBold: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 18,
  },
  confirmText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.light.textAlt,
  },
  exportButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
})
