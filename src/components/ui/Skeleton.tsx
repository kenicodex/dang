import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    />
  )
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={styles.textBlock}>
          <Skeleton width="60%" height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <View style={{ height: 16 }} />
      <Skeleton width="100%" height={14} />
      <View style={{ height: 6 }} />
      <Skeleton width="85%" height={14} />
      <View style={{ height: 6 }} />
      <Skeleton width="70%" height={14} />
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
})
