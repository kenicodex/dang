import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

export interface HeaderMenuItem {
  icon: SymbolViewProps['name']
  label: string
  onPress: () => void
  destructive?: boolean
}

interface HeaderMenuProps {
  visible: boolean
  onClose: () => void
  items: HeaderMenuItem[]
  topOffset: number
}

export function HeaderMenu({ visible, onClose, items, topOffset }: HeaderMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.menu, { top: topOffset }]}>
          {items.map((item, i) => (
            <Pressable
              key={item.label}
              style={[styles.item, i > 0 && styles.itemDivider]}
              onPress={() => {
                onClose()
                item.onPress()
              }}
            >
              <Icon
                name={item.icon}
                size={16}
                tintColor={item.destructive ? colors.light.semantic.error : colors.light.textAlt}
              />
              <Text style={[styles.itemLabel, item.destructive && styles.itemLabelDestructive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    right: 16,
    width: 190,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    paddingVertical: 6,
    ...shadows.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  itemLabelDestructive: {
    color: colors.light.semantic.error,
  },
})
