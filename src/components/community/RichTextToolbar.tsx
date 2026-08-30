import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

export type TextFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'bullet' | 'numbered' | 'link'

const PRIMARY_TOOLS: { format: TextFormat; icon: SymbolViewProps['name'] }[] = [
  { format: 'bold', icon: 'bold' },
  { format: 'italic', icon: 'italic' },
  { format: 'underline', icon: 'underline' },
  { format: 'strikethrough', icon: 'strikethrough' },
]

const LIST_TOOLS: { format: TextFormat; icon: SymbolViewProps['name'] }[] = [
  { format: 'bullet', icon: 'list.bullet' },
  { format: 'numbered', icon: 'list.number' },
]

interface RichTextToolbarProps {
  length: number
  maxLength: number
  onFormat: (format: TextFormat) => void
}

export function RichTextToolbar({ length, maxLength, onFormat }: RichTextToolbarProps) {
  return (
    <View style={styles.row}>
      {PRIMARY_TOOLS.map(tool => (
        <ToolButton key={tool.format} icon={tool.icon} onPress={() => onFormat(tool.format)} />
      ))}
      <View style={styles.divider} />
      {LIST_TOOLS.map(tool => (
        <ToolButton key={tool.format} icon={tool.icon} onPress={() => onFormat(tool.format)} />
      ))}
      <View style={styles.divider} />
      <ToolButton icon="link" onPress={() => onFormat('link')} />
      <Text style={styles.counter}>
        {length}/{maxLength}
      </Text>
    </View>
  )
}

function ToolButton({ icon, onPress }: { icon: SymbolViewProps['name']; onPress: () => void }) {
  return (
    <Pressable style={styles.toolButton} onPress={onPress} hitSlop={6}>
      <Icon name={icon} size={16} tintColor={colors.light.textAlt} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toolButton: {
    marginRight: 14,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: colors.light.border,
    marginRight: 14,
  },
  counter: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    color: colors.light.textSoft,
  },
})
