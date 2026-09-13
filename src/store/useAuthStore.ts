import { create } from './zustand'
import { api } from '@/api/endpoints'
import { ApiError } from '@/api/client'
import { authStorage } from '@/services/authStorage'
import { mapAuthApiUser } from '@/services/mapAuthUser'
import type { AuthSessionInfo, AuthUser } from '@/types/auth'
import type { SubscriptionTier } from '@/types/subscriptions'

async function completeSession(response: { accessToken: string; refreshToken: string; user: Parameters<typeof mapAuthApiUser>[0] }) {
  await authStorage.setSession(response.accessToken, response.refreshToken)
  return mapAuthApiUser(response.user)
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  subscriptionTier: SubscriptionTier | null
  sessions: AuthSessionInfo[]
  isSessionsLoading: boolean
  setUser: (user: AuthUser | null) => void
  setAccessToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setSubscriptionTier: (tier: SubscriptionTier | null) => void
  register: (input: {
    email: string
    password: string
    displayName: string
    city?: string
    country?: string
    industry?: string
    phone?: string
    businessStage?: string
    faithTradition?: string
  }) => Promise<AuthUser>
  login: (email: string, password: string) => Promise<AuthUser>
  loginWithGoogle: (idToken: string) => Promise<AuthUser>
  loginWithApple: (identityToken: string, nonce?: string, displayName?: string) => Promise<AuthUser>
  sendOtp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, code: string, displayName?: string) => Promise<AuthUser>
  refreshSession: () => Promise<AuthUser | null>
  logout: (allSessions?: boolean) => Promise<void>
  requestPasswordReset: (input: { email?: string; phone?: string }) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  verifyEmail: (token: string) => Promise<boolean>
  requestEmailChange: (newEmail: string) => Promise<void>
  confirmEmailChange: (token: string) => Promise<void>
  requestPhoneChange: (newPhone: string) => Promise<void>
  confirmPhoneChange: (newPhone: string, code: string) => Promise<void>
  loadSessions: () => Promise<AuthSessionInfo[]>
  revokeSession: (id: string) => Promise<void>
  revokeOtherSessions: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  subscriptionTier: null,
  sessions: [],
  isSessionsLoading: false,
  setUser: user => set({ user, isAuthenticated: !!user }),
  setAccessToken: accessToken => set({ accessToken }),
  setLoading: isLoading => set({ isLoading }),
  setSubscriptionTier: subscriptionTier => set({ subscriptionTier }),

  register: async input => {
    set({ isLoading: true })
    try {
      const response = await api.auth.register(input)
      const user = await completeSession(response)
      set({ user, isAuthenticated: true, accessToken: response.accessToken })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await api.auth.login({ email, password })
      const user = await completeSession(response)
      set({ user, isAuthenticated: true, accessToken: response.accessToken })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  loginWithGoogle: async idToken => {
    set({ isLoading: true })
    try {
      const response = await api.auth.loginWithGoogle({ idToken })
      const user = await completeSession(response)
      set({ user, isAuthenticated: true, accessToken: response.accessToken })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  loginWithApple: async (identityToken, nonce, displayName) => {
    set({ isLoading: true })
    try {
      const response = await api.auth.loginWithApple({ identityToken, nonce, displayName })
      const user = await completeSession(response)
      set({ user, isAuthenticated: true, accessToken: response.accessToken })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  sendOtp: async phone => {
    set({ isLoading: true })
    try {
      await api.auth.sendOtp({ phone })
    } finally {
      set({ isLoading: false })
    }
  },

  verifyOtp: async (phone, code, displayName) => {
    set({ isLoading: true })
    try {
      const response = await api.auth.verifyOtp({ phone, code, displayName })
      const user = await completeSession(response)
      set({ user, isAuthenticated: true, accessToken: response.accessToken })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  refreshSession: async () => {
    const refreshToken = await authStorage.getRefreshToken()
    if (!refreshToken) return null
    try {
      const response = await api.auth.refreshToken({ refreshToken })
      const user = await completeSession(response)
      set({ user, isAuthenticated: true, accessToken: response.accessToken })
      return user
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        await get().logout()
      }
      return null
    }
  },

  logout: async allSessions => {
    const refreshToken = await authStorage.getRefreshToken()
    if (refreshToken) {
      try {
        await api.auth.logout({ refreshToken, allSessions })
      } catch {
        // best-effort — still clear the local session even if the server call fails
      }
    }
    await authStorage.clearSession()
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      subscriptionTier: null,
      sessions: [],
    })
  },

  requestPasswordReset: async input => {
    set({ isLoading: true })
    try {
      const response = await api.auth.requestPasswordReset(input)
      return response.sent
    } finally {
      set({ isLoading: false })
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true })
    try {
      const response = await api.auth.resetPassword({ token, newPassword })
      return response.success
    } finally {
      set({ isLoading: false })
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true })
    try {
      await api.auth.changePassword({ currentPassword, newPassword })
    } finally {
      set({ isLoading: false })
    }
  },

  verifyEmail: async token => {
    set({ isLoading: true })
    try {
      const response = await api.auth.verifyEmail({ token })
      return response.verified
    } finally {
      set({ isLoading: false })
    }
  },

  requestEmailChange: async newEmail => {
    set({ isLoading: true })
    try {
      await api.auth.requestEmailChange({ newEmail })
    } finally {
      set({ isLoading: false })
    }
  },

  confirmEmailChange: async token => {
    set({ isLoading: true })
    try {
      await api.auth.confirmEmailChange({ token })
    } finally {
      set({ isLoading: false })
    }
  },

  requestPhoneChange: async newPhone => {
    set({ isLoading: true })
    try {
      await api.auth.requestPhoneChange({ newPhone })
    } finally {
      set({ isLoading: false })
    }
  },

  confirmPhoneChange: async (newPhone, code) => {
    set({ isLoading: true })
    try {
      await api.auth.confirmPhoneChange({ newPhone, code })
    } finally {
      set({ isLoading: false })
    }
  },

  loadSessions: async () => {
    set({ isSessionsLoading: true })
    try {
      const sessions = await api.auth.listSessions()
      set({ sessions })
      return sessions
    } finally {
      set({ isSessionsLoading: false })
    }
  },

  revokeSession: async id => {
    const revoked = get().sessions.find(session => session.id === id)
    await api.auth.revokeSession(id)
    set({ sessions: get().sessions.filter(session => session.id !== id) })
    if (revoked?.isCurrent) {
      await get().logout()
    }
  },

  revokeOtherSessions: async () => {
    await api.auth.revokeOtherSessions()
    set({ sessions: get().sessions.filter(session => session.isCurrent) })
  },
}))
