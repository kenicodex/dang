import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'

export function DangFooter() {
  return (
    <LinearGradient
      colors={['rgba(102,96,224,0.04)', 'rgba(102,96,224,0.18)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.footer}
    >
      <Image source={require('@/assets/images/dang-logo-black.svg')} contentFit="contain" style={styles.logo} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  footer: {
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  logo: {
    width: 100,
    height: 32,
  },
})
