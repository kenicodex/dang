import type { SubscriptionTier } from './subscriptions'

export type UserRole = 'member' | 'moderator' | 'admin' | 'founder'

export interface AuthUser {
  id: string
  displayName: string
  handle: string
  email: string
  avatarUrl?: string
  coverImageUrl?: string
  bio?: string
  location?: string
  website?: string
  interests?: string[]
  followerCount?: number
  followingCount?: number
  role: UserRole
  isVerified: boolean
  has2FA: boolean
  subscriptionTierId?: string
  createdAt: Date
}

export interface AuthContext {
  memberId: string
  role: UserRole
  subscriptionTier: SubscriptionTier | null
  isAnonymousMode?: boolean
  impersonatedBy?: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
  tfaCode?: string
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
  handle: string
  referralCode?: string
  timezone?: string
}
