import type { Auditable } from './common'
import type { MemberProfile } from './members'

export type CircleRole = 'leader' | 'moderator' | 'member'

export interface Circle extends Auditable {
  name: string
  slug: string
  emoji?: string
  description?: string
  coverUrl?: string
  category?: string
  memberCount: number
  isPrivate: boolean
  requiresApproval: boolean
  isLeader: boolean
  memberAvatars?: string[]
  theme?: string
  lastActivityAt: Date
}

export interface CircleMember extends Auditable {
  circleId: string
  memberId: string
  role: CircleRole
  profile?: Pick<MemberProfile, 'id' | 'displayName' | 'handle' | 'avatarUrl'>
  joinedAt: Date
  invitedBy?: string
}

export interface CircleInvite extends Auditable {
  id: string
  circleId: string
  circleName: string
  email?: string
  toMemberId?: string
  invitedBy?: Pick<MemberProfile, 'id' | 'displayName' | 'avatarUrl'>
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  sentAt: Date
  expiresAt: Date
  acceptedAt?: Date
}
