import type { Auditable, Paginated } from './common'

export interface MemberProfile extends Auditable {
  displayName: string
  handle: string
  avatarUrl?: string
  bio?: string
  location?: string
  interests: string[]
  joinedAt: Date
  isOnline: boolean
  lastActiveAt?: Date
  isVerified: boolean
  membershipTier: string
  faithStreak?: number
  circlesCount: number
}

export interface MemberMatch {
  memberId: string
  profile: MemberProfile
  matchScore: number
  reasons: string[]
}

export interface DMThread extends Auditable {
  id: string
  participantIds: string[]
  participants: Array<Pick<MemberProfile, 'id' | 'displayName' | 'avatarUrl'>>
  lastMessageAt: Date
  lastMessagePreview?: string
  unreadCount: number
  isRead: boolean
}

export interface DMMessage extends Auditable {
  threadId: string
  fromMemberId: string
  content: string
  attachments?: Array<{ type: string; url: string }>
  readAt?: Date
  deliveredAt?: Date
  reactions?: Record<string, string[]>
}
