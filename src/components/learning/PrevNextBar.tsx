import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

interface PrevNextBarProps {
  onPrevious?: () => void
  onNext?: () => void
  nextLabel?: string
}

export function PrevNextBar({ onPrevious, onNext, nextLabel = 'Next' }: PrevNextBarProps) {
  if (!onPrevious && !onNext) return null

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.half, styles.prev, !onPrevious && styles.disabled]}
        onPress={onPrevious}
        disabled={!onPrevious}
      >
        <Text style={styles.prevText}>Previous</Text>
      </Pressable>
      <Pressable
        style={[styles.half, styles.next, !onNext && styles.disabled]}
        onPress={onNext}
        disabled={!onNext}
      >
        <Text style={styles.nextText}>{nextLabel}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: 999,
    overflow: 'hidden',
    ...shadows.md,
  },
  half: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  prev: {
    backgroundColor: colors.light.surfaceAlt,
  },
  next: {
    backgroundColor: colors.light.primary[500],
  },
  disabled: {
    opacity: 0.5,
  },
  prevText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
})
