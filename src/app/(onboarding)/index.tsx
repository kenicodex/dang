import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, DimensionValue, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface FloatingEmoji {
  emoji: string
  top: DimensionValue
  left?: DimensionValue
  right?: DimensionValue
  rotate?: string
  fontSize?: number
}

interface Slide {
  key: string
  image: number
  headline: string[]
  subtitle: string
  emoji: FloatingEmoji[]
}

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    image: require('@/assets/images/onboarding/slide-welcome.webp'),
    headline: ['welcome', 'home'],
    subtitle: 'faith. ambition. healing. friendship. all in one private community.',
    emoji: [
      { emoji: '🌸', top: -6, left: -8, fontSize: 26 },
      { emoji: '🎀', top: -14, right: 6, rotate: '18deg', fontSize: 26 },
      { emoji: '🪐', top: 40, left: -2, fontSize: 22 },
    ],
  },
  {
    key: 'feel',
    image: require('@/assets/images/onboarding/slide-feel.webp'),
    headline: ['how do', 'you feel?'],
    subtitle: 'wake up to prayers, reflections and daily encouragement before the world gets noisy.',
    emoji: [
      { emoji: '😊', top: -10, left: '38%', fontSize: 24 },
      { emoji: '🤗', top: 34, left: 6, fontSize: 24 },
    ],
  },
]

export default function OnboardingScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={styles.slide}>
            <Image
              source={require('@/assets/images/onboarding/sky-bg.jpg')}
              style={styles.background}
              contentFit="cover"
            />
            <Image source={slide.image} style={styles.background} contentFit="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.12)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
              locations={[0, 0.4, 0.8]}
              style={styles.overlay}
            />

            <SafeAreaView style={styles.content}>
              <Image
                source={require('@/assets/images/dang-logo-white.svg')}
                contentFit="contain"
                style={styles.logo}
              />

              <View style={styles.headlineBlock}>
                {slide.emoji.map((e, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.floatingEmoji,
                      {
                        top: e.top,
                        left: e.left,
                        right: e.right,
                        fontSize: e.fontSize ?? 24,
                        transform: e.rotate ? [{ rotate: e.rotate }] : undefined,
                      },
                    ]}
                  >
                    {e.emoji}
                  </Text>
                ))}
                {slide.headline.map((line) => (
                  <Text key={line} style={styles.headline}>
                    {line}
                  </Text>
                ))}
              </View>

              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </SafeAreaView>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView style={styles.ctaArea} edges={['bottom']}>
        <Button
          title="Get started"
          size="lg"
          style={styles.ctaButton}
          onPress={() => router.push('/(auth)/sign-up')}
        />
        <Text style={styles.signInRow}>
          already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => router.push('/(auth)')}>
            sign in
          </Text>
        </Text>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pager: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logo: {
    width: 66,
    height: 22,
    marginBottom: 28,
  },
  headlineBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  floatingEmoji: {
    position: 'absolute',
  },
  headline: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#F3F4F6',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  ctaArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  ctaButton: {
    alignSelf: 'stretch',
    backgroundColor: '#0B0B0F',
    borderRadius: 30,
    paddingVertical: 16,
  },
  signInRow: {
    color: '#F3F4F6',
    fontSize: 14,
    marginTop: 14,
    marginBottom: 8,
  },
  signInLink: {
    color: '#A78BFA',
    fontWeight: '600',
  },
})
