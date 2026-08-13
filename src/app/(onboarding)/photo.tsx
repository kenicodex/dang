import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { colors } from '@/theme/colors'

export default function PhotoStepScreen() {
  const router = useRouter()
  const [photoUri, setPhotoUri] = useState<string | null>(null)

  const goNext = () => router.push('/(onboarding)/location')

  return (
    <FlowScreen>
      <StepHeader
        onBack={() => router.back()}
        progress={2 / 5}
        rightSlot={
          <Pressable onPress={goNext}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        }
      />

      <View style={styles.container}>
        <Text style={styles.emoji}>📸</Text>
        <Text variant="h2">Show us that beautiful face</Text>
        <Text style={styles.subtitle}>
          Your photo helps sisters recognise you. You can always change it later.
        </Text>

        <View style={styles.avatarArea}>
          <Pressable style={styles.avatarCircle} onPress={() => setPhotoUri(photoUri)}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <SymbolView name="person.fill" size={40} tintColor={colors.light.primary[300]} />
            )}
          </Pressable>
          <Pressable style={styles.addBadge} onPress={() => setPhotoUri(photoUri)}>
            <SymbolView name="plus" size={16} tintColor={colors.light.neutral.white} weight="bold" />
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Choose a clear photo where your face is visible. No logos or group shots.
        </Text>
      </View>

      <View style={styles.fabRow}>
        <NextFab onPress={goNext} />
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  skip: {
    color: colors.light.textMuted,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  avatarArea: {
    width: 120,
    height: 120,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.light.primary[200],
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  addBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.light.bg,
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.light.textSoft,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  fabRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
})
