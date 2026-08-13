import { Pressable, StyleSheet, View } from 'react-native'
import { SymbolView } from 'expo-symbols'

import { Sheet } from '@/components/ui/Sheet'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

interface RejectionSheetProps {
  visible: boolean
  onClose: () => void
  reason: string
  onDelete?: () => void
  onEdit?: () => void
}

export function RejectionSheet({ visible, onClose, reason, onDelete, onEdit }: RejectionSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.iconCircle}>
        <SymbolView name="xmark" size={22} tintColor={colors.light.neutral.white} weight="bold" />
      </View>
      <Text variant="h2" style={styles.title}>
        Not approved
      </Text>
      <Text style={styles.subtitle}>Here's why this post didn't go through ...</Text>
      <View style={styles.divider} />
      <Text style={styles.reason}>{reason}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete Post</Text>
        </Pressable>
        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit Post</Text>
        </Pressable>
      </View>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: colors.light.textMuted,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 16,
  },
  reason: {
    color: colors.light.textAlt,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.light.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: colors.light.semantic.error,
    fontWeight: '600',
    fontSize: 16,
  },
  editButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: colors.light.neutral.white,
    fontWeight: '600',
    fontSize: 16,
  },
})
