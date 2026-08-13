import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'

interface DiscountBannerProps {
  active: boolean
  percentage?: number
  expiresAt?: string
  shopNow?: () => void
  message?: string
}

export function DiscountBanner({
  active,
  percentage = 10,
  expiresAt,
  shopNow,
  message,
}: DiscountBannerProps) {
  if (!active) {
    return (
      <View style={[styles.banner, styles.inactive]}>
        <Text variant="caption" style={styles.inactiveText}>
          🔒 Subscribe to unlock Dang Lifestyle discount
        </Text>
      </View>
    )
  }
  return (
    <View style={styles.banner}>
      <View style={styles.badgeWrap}>
        <Text style={styles.percent}>-{percentage}%</Text>
      </View>
      <View style={styles.info}>
        <Text variant="h3" style={styles.title}>
          Member Discount Applied
        </Text>
        <Text variant="caption" style={styles.desc}>
          {message || `Auto-applied at Dang Lifestyle checkout${expiresAt ? ` · Expires ${expiresAt}` : ''}`}
        </Text>
      </View>
      <Button title="Shop" size="sm" onPress={shopNow} />
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  inactive: {
    backgroundColor: '#F3F4F6',
  },
  inactiveText: {
    color: '#6B7280',
  },
  badgeWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#991B1B',
  },
  desc: {
    color: '#B91C1C',
  },
})
