import { Pressable, StyleSheet } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { colors } from '@/theme/colors'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <Pressable style={[styles.box, checked && styles.boxChecked]} onPress={() => onChange(!checked)} hitSlop={8}>
      {checked && <Icon name="checkmark" size={12} tintColor={colors.light.neutral.white} weight="bold" />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.light.primary[500],
    borderColor: colors.light.primary[500],
  },
})
