import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Icon } from '@/components/ui/Icon'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { pickImageFromCamera, pickImageFromLibrary } from '@/lib/imagePicker'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'

export default function PhotoStepScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string; password?: string; phone?: string; name?: string }>()
  const showToast = useUIStore(s => s.showToast)
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  const goNext = () => router.push({ pathname: '/(onboarding)/location', params })

  const handlePickFromLibrary = async () => {
    const result = await pickImageFromLibrary()
    if (result.status === 'success') setPhotoUri(result.uri)
    else if (result.status === 'denied') {
      showToast('Please allow photo library access in Settings to choose a photo.', 'error')
    }
  }

  const handlePickFromCamera = async () => {
    const result = await pickImageFromCamera()
    if (result.status === 'success') setPhotoUri(result.uri)
    else if (result.status === 'denied') {
      showToast('Please allow camera access in Settings to take a photo.', 'error')
    }
  }

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
          <Pressable style={styles.avatarCircle} onPress={() => setSheetVisible(true)}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Icon name="person.fill" size={40} tintColor={colors.light.primary[300]} />
            )}
          </Pressable>
          <Pressable style={styles.addBadge} onPress={() => setSheetVisible(true)}>
            <Icon name="plus" size={16} tintColor={colors.light.neutral.white} weight="bold" />
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Choose a clear photo where your face is visible. No logos or group shots.
        </Text>
      </View>

      <View style={styles.fabRow}>
        <NextFab onPress={goNext} />
      </View>

      <ActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        actions={[
          { label: 'Photo Library', onPress: handlePickFromLibrary },
          { label: 'Camera', onPress: handlePickFromCamera },
          ...(photoUri ? [{ label: 'Remove', onPress: () => setPhotoUri(null), destructive: true }] : []),
        ]}
      />
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
