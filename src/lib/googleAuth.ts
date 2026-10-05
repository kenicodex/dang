import { GoogleSignin } from '@react-native-google-signin/google-signin'

let configured = false

function ensureConfigured() {
  if (configured) return
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  })
  configured = true
}

/** Resolves with a Google ID token, or null if the user cancelled. Throws on a real failure. */
export async function signInWithGoogle(): Promise<string | null> {
  ensureConfigured()
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
  const response = await GoogleSignin.signIn()
  if (response.type !== 'success') return null
  if (!response.data.idToken) throw new Error('Google did not return an identity token.')
  return response.data.idToken
}
