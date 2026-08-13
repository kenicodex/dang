import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'

type RSVPStatus = 'yes' | 'no' | 'maybe' | 'unanswered'

interface RSVPButtonProps {
  status: RSVPStatus
  onChange?: (status: RSVPStatus) => void
}

export function RSVPButton({ status, onChange }: RSVPButtonProps) {
  const options: { key: RSVPStatus; label: string }[] = [
    { key: 'yes', label: '✓ Going' },
    { key: 'maybe', label: '? Maybe' },
    { key: 'no', label: '✗ Can\'t' },
  ]
  return (
    <View style={styles.row}>
      {options.map(opt => (
        <Pressable
          key={opt.key}
          style={[styles.opt, status === opt.key && styles.optActive]}
          onPress={() => onChange?.(opt.key)}
        >
          <Text
            variant="caption"
            style={status === opt.key ? styles.optActiveText : styles.optText}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  opt: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  optActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  optText: {
    color: '#6B7280',
  },
  optActiveText: {
    color: '#208AEF',
    fontWeight: '700',
  },
})
