import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

interface FooterNoteProps {
  icon: SymbolViewProps['name']
  children: string
}

export function FooterNote({ icon, children }: FooterNoteProps) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={14} tintColor={colors.light.textSoft} />
      <Text style={styles.text}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
})
