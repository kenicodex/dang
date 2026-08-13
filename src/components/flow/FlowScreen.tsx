import { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'

interface FlowScreenProps {
  children: ReactNode
}

export function FlowScreen({ children }: FlowScreenProps) {
  return (
    <LinearGradient colors={[colors.light.primary[50], colors.light.bg]} style={styles.fill}>
      <SafeAreaView style={styles.fill}>{children}</SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
})
