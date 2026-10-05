import { useRef } from 'react'
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'

import { colors } from '@/theme/colors'

interface OtpInputProps {
  length?: number
  value: string
  onChangeText: (value: string) => void
  autoFocus?: boolean
  /** Horizontal space already consumed by the surrounding screen (padding on both sides). */
  horizontalInset?: number
}

const MAX_BOX_SIZE = 56
const MIN_BOX_SIZE = 40
const MAX_GAP = 12
const MIN_GAP = 6

export function OtpInput({ length = 4, value, onChangeText, autoFocus, horizontalInset = 48 }: OtpInputProps) {
  const inputs = useRef<Array<TextInput | null>>([])
  const { width: screenWidth } = useWindowDimensions()

  const availableWidth = screenWidth - horizontalInset
  const gap = Math.min(MAX_GAP, Math.max(MIN_GAP, (availableWidth - length * MIN_BOX_SIZE) / Math.max(length - 1, 1)))
  const boxSize = Math.min(
    MAX_BOX_SIZE,
    Math.max(MIN_BOX_SIZE, (availableWidth - gap * (length - 1)) / length),
  )

  const setDigit = (index: number, digit: string) => {
    const next = value.split('')
    next[index] = digit
    onChangeText(next.join('').slice(0, length))
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const onKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <View style={[styles.row, { gap }]}>
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? ''
        return (
          <TextInput
            key={index}
            ref={ref => { inputs.current[index] = ref }}
            style={[
              styles.box,
              { width: boxSize, height: boxSize, fontSize: boxSize * 0.4 },
              digit && styles.boxFilled,
            ]}
            value={digit}
            onChangeText={d => setDigit(index, d.replace(/[^0-9]/g, '').slice(-1))}
            onKeyPress={e => onKeyPress(index, e)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={autoFocus && index === 0}
            textAlign="center"
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  box: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    fontWeight: '700',
    color: colors.light.text,
  },
  boxFilled: {
    borderColor: colors.light.primary[500],
  },
})
