import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/client'
import { authApi } from '@/api/services/auth.service'
import { authStorage } from '@/services/authStorage'
import { mapAuthApiUser } from '@/services/mapAuthUser'
import { useAuthStore } from '@/store/useAuthStore'
import type {
  AuthSessionInfo,
  AuthTokenResponse,
  ChangePasswordInput,
  PasswordResetInput,
} from '@/types/auth'

export const authKeys = {
  sessions: ['auth', 'sessions'] as const,
}

async function completeSession(response: AuthTokenResponse) {
  await authStorage.setSession(response.accessToken, response.refreshToken)
  const user = mapAuthApiUser(response.user)
  useAuthStore.setState(prev => ({
    ...prev,
    user,
    isAuthenticated: true,
    accessToken: response.accessToken,
  }))
  return user
}

async function performLogout(allSessions?: boolean) {
  const refreshToken = await authStorage.getRefreshToken()
  if (refreshToken) {
    try {
      await authApi.logout({ refreshToken, allSessions })
    } catch {
      // best-effort — still clear the local session even if the server call fails
    }
  }
  await authStorage.clearSession()
  useAuthStore.setState(prev => ({
    ...prev,
    user: null,
    isAuthenticated: false,
    accessToken: null,
    subscriptionTier: null,
  }))
}

/** Restores a session from a stored refresh token (e.g. on app boot). Not wired into the UI yet. */
export async function restoreSession() {
  const refreshToken = await authStorage.getRefreshToken()
  if (!refreshToken) return null
  try {
    const response = await authApi.refreshToken({ refreshToken })
    return await completeSession(response)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      await performLogout()
    }
    return null
  }
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: completeSession,
  })
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: completeSession,
  })
}

export function useLoginWithGoogleMutation() {
  return useMutation({
    mutationFn: authApi.loginWithGoogle,
    onSuccess: completeSession,
  })
}

export function useLoginWithAppleMutation() {
  return useMutation({
    mutationFn: authApi.loginWithApple,
    onSuccess: completeSession,
  })
}

export function useSendOtpMutation() {
  return useMutation({ mutationFn: authApi.sendOtp })
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: completeSession,
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (allSessions?: boolean) => performLogout(allSessions),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.sessions })
    },
  })
}

export function useRequestPasswordResetMutation() {
  return useMutation({ mutationFn: authApi.requestPasswordReset })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: PasswordResetInput) => authApi.resetPassword(input),
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
  })
}

export function useVerifyEmailMutation() {
  return useMutation({ mutationFn: authApi.verifyEmail })
}

export function useRequestEmailChangeMutation() {
  return useMutation({
    mutationFn: (newEmail: string) => authApi.requestEmailChange({ newEmail }),
  })
}

export function useConfirmEmailChangeMutation() {
  return useMutation({ mutationFn: authApi.confirmEmailChange })
}

export function useRequestPhoneChangeMutation() {
  return useMutation({
    mutationFn: (newPhone: string) => authApi.requestPhoneChange({ newPhone }),
  })
}

export function useConfirmPhoneChangeMutation() {
  return useMutation({
    mutationFn: ({ newPhone, code }: { newPhone: string; code: string }) =>
      authApi.confirmPhoneChange({ newPhone, code }),
  })
}

export function useSessions(enabled = true) {
  return useQuery({
    queryKey: authKeys.sessions,
    queryFn: () => authApi.listSessions(),
    enabled,
  })
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const sessions = queryClient.getQueryData<AuthSessionInfo[]>(authKeys.sessions)
      const revoked = sessions?.find(session => session.id === id)
      await authApi.revokeSession(id)
      if (revoked?.isCurrent) {
        await performLogout()
      }
      return id
    },
    onSuccess: id => {
      queryClient.setQueryData<AuthSessionInfo[]>(authKeys.sessions, prev =>
        prev?.filter(session => session.id !== id),
      )
    },
  })
}

export function useRevokeOtherSessionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.setQueryData<AuthSessionInfo[]>(authKeys.sessions, prev =>
        prev?.filter(session => session.isCurrent),
      )
    },
  })
}
