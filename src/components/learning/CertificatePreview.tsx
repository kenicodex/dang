import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

interface CertificatePreviewProps {
  courseTitle: string
  recipientName: string
  completedOn?: string
  locked?: boolean
}

export function CertificatePreview({ courseTitle, recipientName, completedOn, locked }: CertificatePreviewProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Icon name="rosette" size={16} tintColor={colors.light.primary[600]} />
            <Text style={styles.brand}>DANG</Text>
          </View>
          <Icon name="qrcode" size={22} tintColor={colors.light.primary[300]} />
        </View>

        <Text style={styles.certificateLabel}>CERTIFICATE</Text>
        <Text style={styles.ofCompletion}>OF COMPLETION</Text>

        <Text style={styles.line}>This is to certify that</Text>
        <Text style={styles.recipient}>{recipientName}</Text>
        <Text style={styles.line}>has successfully completed</Text>
        <Text style={styles.course}>{courseTitle}</Text>

        {completedOn && <Text style={styles.completedOn}>Completed on: {completedOn}</Text>}

        <View style={styles.signRow}>
          <View style={styles.signBlock}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>Course Instructor</Text>
          </View>
          <Icon name="seal" size={26} tintColor={colors.light.primary[400]} />
          <View style={styles.signBlock}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>DANG Team</Text>
          </View>
        </View>

        {locked && (
          <View style={styles.lockedOverlay}>
            <Icon name="lock.fill" size={20} tintColor={colors.light.neutral.white} />
            <Text style={styles.lockedText}>Complete the course to unlock</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    borderColor: colors.light.primary[200],
    borderRadius: 16,
    padding: 6,
    backgroundColor: colors.light.surface,
  },
  inner: {
    borderWidth: 1,
    borderColor: colors.light.primary[100],
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.light.primary[600],
  },
  certificateLabel: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.light.primary[700],
  },
  ofCompletion: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.light.textSoft,
    marginBottom: 16,
  },
  line: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  recipient: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.light.text,
    marginVertical: 6,
  },
  course: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginTop: 4,
  },
  completedOn: {
    fontSize: 11,
    color: colors.light.textSoft,
    marginTop: 14,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  signBlock: {
    alignItems: 'center',
    gap: 4,
  },
  signLine: {
    width: 70,
    height: 1,
    backgroundColor: colors.light.border,
  },
  signLabel: {
    fontSize: 9,
    color: colors.light.textSoft,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.55)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lockedText: {
    color: colors.light.neutral.white,
    fontSize: 12,
    fontWeight: '600',
  },
})
