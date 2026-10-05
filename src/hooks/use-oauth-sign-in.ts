import * as AppleAuthentication from 'expo-apple-authentication'
import { useRouter } from 'expo-router'

import { ApiError } from '@/api/client'
import { useLoginWithAppleMutation, useLoginWithGoogleMutation } from '@/api/hooks/auth.hooks'
import { signInWithGoogle } from '@/lib/googleAuth'
import { useUIStore } from '@/store'

/** Shared Apple / Google OAuth sign-in-or-register handlers for the auth chooser screens. */
export function useOAuthSignIn() {
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)
  const { mutateAsync: loginWithApple, isPending: isApplePending } = useLoginWithAppleMutation()
  const { mutateAsync: loginWithGoogle, isPending: isGooglePending } = useLoginWithGoogleMutation()

  const handleAppleSignIn = async () => {
    try {
      const nonce = Math.random().toString(36).slice(2)
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      })
      if (!credential.identityToken) throw new Error('Apple did not return an identity token.')
      const displayName = credential.fullName?.givenName
        ? `${credential.fullName.givenName} ${credential.fullName.familyName ?? ''}`.trim()
        : undefined
      await loginWithApple({ identityToken: credential.identityToken, nonce, displayName })
      router.replace('/home')
    } catch (err: any) {
      if (err?.code === 'ERR_REQUEST_CANCELED') return
      const message = err instanceof ApiError ? err.message : 'Apple sign-in failed. Please try again.'
      showToast(message, 'error')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const idToken = await signInWithGoogle()
      if (!idToken) return
      await loginWithGoogle({ idToken })
      router.replace('/home')
    } catch (err: any) {
      if (err?.code === 'SIGN_IN_CANCELLED' || err?.code === '-5') return
      const message = err instanceof ApiError ? err.message : 'Google sign-in failed. Please try again.'
      showToast(message, 'error')
    }
  }

  return {
    handleAppleSignIn,
    handleGoogleSignIn,
    isLoading: isApplePending || isGooglePending,
  }
}
