import React from 'react'
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import { Text } from './Text'
import { colors } from '@/theme/colors'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  source?: ImageSourcePropType
  initials?: string
  uri?: string
  size?: Size
  ring?: boolean
}

export function Avatar({ source, initials, uri, size = 'md', ring }: AvatarProps) {
  return (
    <View style={[styles[size], ring && styles.ring]}>
      {source ? (
        <Image source={source} style={styles[size]} />
      ) : uri ? (
        <Image source={{ uri }} style={styles[size]} />
      ) : (
        <View style={[styles[size], styles.fallback]}>
          <Text style={styles[`initials_${size}`]}>{initials}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  xs: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sm: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  md: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  lg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  xl: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  ring: {
    borderWidth: 3,
    borderColor: colors.light.primary[500],
  },
  fallback: {
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials_xs: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  initials_sm: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  initials_md: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  initials_lg: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.light.primary[500],
  },
  initials_xl: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.light.primary[500],
  },
})
