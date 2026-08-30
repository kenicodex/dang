import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from './Text'
import { colors } from '@/theme/colors'

export interface ActionSheetAction {
  label: string
  onPress: () => void
  destructive?: boolean
}

interface ActionSheetProps {
  visible: boolean
  onClose: () => void
  actions: ActionSheetAction[]
  cancelLabel?: string
}

export function ActionSheet({ visible, onClose, actions, cancelLabel = 'Cancel' }: ActionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <SafeAreaView edges={['bottom']} style={styles.container}>
          <View style={styles.group}>
            {actions.map((action, i) => (
              <Pressable
                key={action.label}
                style={[styles.item, i > 0 && styles.itemDivider]}
                onPress={() => {
                  onClose()
                  action.onPress()
                }}
              >
                <Text style={[styles.itemLabel, action.destructive && styles.itemLabelDestructive]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelLabel}>{cancelLabel}</Text>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
  },
  group: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(30,30,35,0.92)',
  },
  item: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  itemDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  itemLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.light.primary[300],
  },
  itemLabelDestructive: {
    color: colors.light.semantic.error,
  },
  cancel: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.light.primary[500],
  },
  cancelLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
})
