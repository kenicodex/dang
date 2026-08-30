import { StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { colors } from '@/theme/colors'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const DIMENSIONS: Record<Size, number> = { xs: 24, sm: 32, md: 44, lg: 64, xl: 96 }
const ICON_SIZES: Record<Size, number> = { xs: 12, sm: 16, md: 22, lg: 32, xl: 48 }

interface AnonymousAvatarProps {
  size?: Size
}

export function AnonymousAvatar({ size = 'md' }: AnonymousAvatarProps) {
  const dimension = DIMENSIONS[size]

  return (
    <View
      style={[
        styles.circle,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
      ]}
    >
      <Icon name="person.fill" size={ICON_SIZES[size]} tintColor="rgba(255,255,255,0.85)" />
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.light.neutral.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
