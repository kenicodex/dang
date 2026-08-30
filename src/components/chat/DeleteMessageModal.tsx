import { Modal, Pressable, StyleSheet, View } from 'react-native'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

interface DeleteMessageModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  authorName: string
  authorAvatarUrl?: string
  timeLabel: string
  preview: string
}

export function DeleteMessageModal({
  visible,
  onClose,
  onConfirm,
  authorName,
  authorAvatarUrl,
  timeLabel,
  preview,
}: DeleteMessageModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text variant="h3" style={styles.title}>
            Delete Message
          </Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Are you sure want to delete this message?</Text>

          <View style={styles.previewRow}>
            <Avatar uri={authorAvatarUrl} initials={authorName.slice(0, 2)} size="sm" />
            <View style={styles.previewInfo}>
              <View style={styles.previewNameRow}>
                <Text style={styles.previewName}>{authorName}</Text>
                <Text style={styles.previewTime}>{timeLabel}</Text>
              </View>
              <Text style={styles.previewText} numberOfLines={2}>
                {preview}
              </Text>
            </View>
          </View>

          <Pressable style={styles.deleteButton} onPress={onConfirm}>
            <Text style={styles.deleteButtonText}>Yes, Delete Message</Text>
          </Pressable>
          <Pressable style={styles.goBackButton} onPress={onClose}>
            <Text style={styles.goBackText}>Go Back</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.light.bg,
    borderRadius: 20,
    padding: 20,
    ...shadows.xl,
  },
  title: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 12,
    marginHorizontal: -20,
  },
  subtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  previewInfo: {
    flex: 1,
    gap: 2,
  },
  previewNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  previewName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  previewTime: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  previewText: {
    fontSize: 13,
    color: colors.light.textMuted,
    lineHeight: 18,
  },
  deleteButton: {
    backgroundColor: colors.light.semantic.error,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  goBackButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  goBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
})
