import { create } from './zustand'
import type { AuthUser } from '@/types/auth'
import type { SubscriptionTier } from '@/types/subscriptions'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  accessToken: string | null
  subscriptionTier: SubscriptionTier | null
  setUser: (user: AuthUser | null) => void
  setAccessToken: (token: string | null) => void
  setSubscriptionTier: (tier: SubscriptionTier | null) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  subscriptionTier: null,
  setUser: user => set({ user, isAuthenticated: !!user }),
  setAccessToken: accessToken => set({ accessToken }),
  setSubscriptionTier: subscriptionTier => set({ subscriptionTier }),
}))
