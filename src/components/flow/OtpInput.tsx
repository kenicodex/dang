import { useRef } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, View, StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

interface OtpInputProps {
  length?: number
  value: string
  onChangeText: (value: string) => void
  autoFocus?: boolean
}

export function OtpInput({ length = 4, value, onChangeText, autoFocus }: OtpInputProps) {
  const inputs = useRef<Array<TextInput | null>>([])

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
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? ''
        return (
          <TextInput
            key={index}
            ref={ref => { inputs.current[index] = ref }}
            style={[styles.box, digit && styles.boxFilled]}
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
    gap: 12,
  },
  box: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    fontSize: 22,
    fontWeight: '700',
    color: colors.light.text,
  },
  boxFilled: {
    borderColor: colors.light.primary[500],
  },
})
