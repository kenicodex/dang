import React, { ReactNode } from 'react'
import { View, Modal, ModalProps, Pressable, StyleSheet, Dimensions, Platform } from 'react-native'
import { Text } from './Text'
import { colors } from '@/theme/colors'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface SheetProps extends Omit<ModalProps, 'animationType' | 'transparent'> {
  visible: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  snapPoint?: number
}

export function Sheet({
  visible,
  onClose,
  title,
  children,
  snapPoint = SCREEN_HEIGHT * 0.6,
  ...props
}: SheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      {...props}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { maxHeight: snapPoint }]}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.header}>
              <Text variant="h3">{title}</Text>
            </View>
          )}
          <Pressable onPress={() => {}} style={styles.content}>
            {children}
          </Pressable>
        </View>
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
  sheet: {
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
        elevation: 16,
      },
    }),
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.light.border,
    marginVertical: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  content: {
    padding: 20,
  },
})
