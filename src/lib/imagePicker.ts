import * as ImagePicker from 'expo-image-picker'

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
}

export type PickImageResult =
  | { status: 'success'; uri: string }
  | { status: 'canceled' }
  | { status: 'denied' }

/** Opens the device photo library and returns the picked image's local URI. */
export async function pickImageFromLibrary(): Promise<PickImageResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) return { status: 'denied' }

  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS)
  if (result.canceled || !result.assets?.[0]) return { status: 'canceled' }
  return { status: 'success', uri: result.assets[0].uri }
}

/** Opens the device camera and returns the captured image's local URI. */
export async function pickImageFromCamera(): Promise<PickImageResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync()
  if (!permission.granted) return { status: 'denied' }

  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
  if (result.canceled || !result.assets?.[0]) return { status: 'canceled' }
  return { status: 'success', uri: result.assets[0].uri }
}
