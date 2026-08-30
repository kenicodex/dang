import { ReactNode } from 'react'
import { Pressable, View, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'

import { colors } from '@/theme/colors'

interface StepHeaderProps {
  onBack?: () => void
  /** 0-1 progress through the wizard; omit to hide the progress bar. */
  progress?: number
  rightSlot?: ReactNode
}

export function StepHeader({ onBack, progress, rightSlot }: StepHeaderProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack && (
            <Pressable hitSlop={12} onPress={onBack}>
              <Icon name="chevron.left" size={20} tintColor={colors.light.text} />
            </Pressable>
          )}
        </View>

        <Image
          source={require('@/assets/images/dang-logo-black.svg')}
          contentFit="contain"
          style={styles.logo}
        />

        <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
      </View>

      {progress != null && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  side: {
    width: 40,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 60,
    height: 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.light.border,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.light.primary[500],
  },
})
