import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { colors } from '@/theme/colors'

interface NextFabProps {
  onPress: () => void
  disabled?: boolean
  loading?: boolean
}

export function NextFab({ onPress, disabled, loading }: NextFabProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.fab, (disabled || loading) && styles.fabDisabled]}
    >
      {loading ? (
        <ActivityIndicator color={colors.light.neutral.white} />
      ) : (
        <Icon name="chevron.right" size={20} tintColor={colors.light.neutral.white} weight="semibold" />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabDisabled: {
    backgroundColor: colors.light.neutral.muted,
  },
})
