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

// --- Live API contract (matches the backend's /auth/* endpoints) ---

export type ApiUserRole = 'MEMBER' | 'MODERATOR' | 'ADMIN' | 'FOUNDER'

export interface AuthApiProfile {
  displayName: string
  handle?: string
  avatarUrl?: string
  coverImageUrl?: string
  websiteUrl?: string
  bio?: string
  city?: string
  country?: string
  industry?: string
  businessStage?: string
  interests?: string[]
  timezone?: string
  faithTradition?: string
  onboardingStep?: string
  onboardingCompletedAt?: string
}

export interface AuthApiUser {
  id: string
  email: string
  role: ApiUserRole
  membershipTier: string
  isEmailVerified: boolean
  twoFactorEnabled: boolean
  createdAt: string
  profile: AuthApiProfile
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  user: AuthApiUser
}

export interface RegisterRequest {
  email: string
  password: string
  displayName: string
  city?: string
  country?: string
  industry?: string
  phone?: string
  businessStage?: string
  faithTradition?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleOAuthRequest {
  idToken: string
}

export interface AppleOAuthRequest {
  identityToken: string
  nonce?: string
  displayName?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface OtpSendRequest {
  phone: string
}

export interface OtpVerifyRequest {
  phone: string
  code: string
  displayName?: string
}

export interface LogoutRequest {
  refreshToken: string
  allSessions?: boolean
}

export interface PasswordResetRequestInput {
  email?: string
  phone?: string
}

export interface PasswordResetRequestResponse {
  sent: boolean
}

export interface PasswordResetInput {
  token: string
  newPassword: string
}

export interface PasswordResetResponse {
  success: boolean
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface EmailVerifyInput {
  token: string
}

export interface EmailVerifyResponse {
  verified: boolean
}

export interface EmailChangeRequestInput {
  newEmail: string
}

export interface EmailChangeConfirmInput {
  token: string
}

export interface PhoneChangeSendOtpInput {
  newPhone: string
}

export interface PhoneChangeVerifyInput {
  newPhone: string
  code: string
}

export interface AuthSessionInfo {
  id: string
  deviceName?: string
  userAgent?: string
  ipAddress?: string
  location?: string
  lastActiveAt: string
  createdAt?: string
  isCurrent: boolean
}
