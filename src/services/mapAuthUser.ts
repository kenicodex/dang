import type { ApiUserRole, AuthApiUser, AuthUser, UserRole } from '@/types/auth'

const ROLE_MAP: Record<ApiUserRole, UserRole> = {
  MEMBER: 'member',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  FOUNDER: 'founder',
}

export function mapAuthApiUser(apiUser: AuthApiUser): AuthUser {
  const { profile } = apiUser
  const location = [profile.city, profile.country].filter(Boolean).join(', ') || undefined

  return {
    id: apiUser.id,
    displayName: profile.displayName,
    handle: profile.handle ?? apiUser.email.split('@')[0],
    email: apiUser.email,
    avatarUrl: profile.avatarUrl,
    coverImageUrl: profile.coverImageUrl,
    bio: profile.bio,
    location,
    website: profile.websiteUrl,
    interests: profile.interests,
    role: ROLE_MAP[apiUser.role] ?? 'member',
    isVerified: apiUser.isEmailVerified,
    has2FA: apiUser.twoFactorEnabled,
    createdAt: new Date(apiUser.createdAt),
  }
}
