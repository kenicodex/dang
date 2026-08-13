import { ScrollView, Pressable, StyleSheet } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

export interface FilterChip<T extends string> {
  value: T
  label: string
}

interface FilterChipsProps<T extends string> {
  chips: FilterChip<T>[]
  value: T
  onChange: (value: T) => void
}

export function FilterChips<T extends string>({ chips, value, onChange }: FilterChipsProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {chips.map(chip => {
        const active = chip.value === value
        return (
          <Pressable
            key={chip.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(chip.value)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{chip.label}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.light.primary[500],
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  labelActive: {
    color: colors.light.neutral.white,
  },
})
