import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Sheet } from '@/components/ui/Sheet'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

interface LeaveSpaceSheetProps {
  visible: boolean
  spaceName: string
  onClose: () => void
  onConfirmLeave: () => void
}

export function LeaveSpaceSheet({ visible, spaceName, onClose, onConfirmLeave }: LeaveSpaceSheetProps) {
  const [step, setStep] = useState<'options' | 'confirm'>('options')

  const handleClose = () => {
    onClose()
    setStep('options')
  }

  return (
    <Sheet visible={visible} onClose={handleClose}>
      {step === 'options' ? (
        <Pressable style={styles.optionRow} onPress={() => setStep('confirm')}>
          <Icon name="rectangle.portrait.and.arrow.right" size={18} tintColor={colors.light.semantic.error} />
          <Text style={styles.optionText}>Exit this space</Text>
        </Pressable>
      ) : (
        <View>
          <Text style={styles.confirmEyebrow}>Are you sure you want to leave</Text>
          <Text variant="h2" style={styles.confirmSpaceName}>
            {spaceName}
          </Text>
          <Text style={styles.confirmBody}>
            You&rsquo;ll lose access to the space and will no longer be able to participate, but your previous posts
            will still be visible
          </Text>

          <Pressable
            style={styles.exitButton}
            onPress={() => {
              onConfirmLeave()
              handleClose()
            }}
          >
            <Text style={styles.exitButtonText}>Exit this space</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.semantic.error,
  },
  confirmEyebrow: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.textSoft,
    lineHeight: 26,
  },
  confirmSpaceName: {
    marginTop: -4,
    marginBottom: 12,
  },
  confirmBody: {
    fontSize: 14,
    color: colors.light.textMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  exitButton: {
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: colors.light.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: colors.light.neutral.white,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.light.text,
    fontWeight: '700',
    fontSize: 16,
  },
})
