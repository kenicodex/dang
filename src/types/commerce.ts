import type { Auditable } from './common'
import type { SubscriptionTier } from './subscriptions'

export type DiscountState =
  | { active: false; reason: 'no-subscription' | 'lapsed'; requiredTier?: SubscriptionTier }
  | { active: true; percentage: number; autoApplyCode: string; expiresAt?: Date; shopSSO: boolean }

export interface Product extends Auditable {
  name: string
  slug: string
  description?: string
  emoji?: string
  imageUrl?: string
  price: number
  currency: 'NGN' | 'GBP' | 'USD' | 'EUR'
  category: string
  tags?: string[]
  inStock: boolean
  memberDiscountEligible: boolean
  isNewDrop?: boolean
}

export type DropPhase = 'upcoming' | 'member-only' | 'public' | 'ended'

export interface Drop extends Auditable {
  title: string
  slug: string
  coverUrl?: string
  description?: string
  memberOnlyStartsAt: Date
  publicStartsAt: Date
  endsAt: Date
  productIds: string[]
  currentPhase: DropPhase
  totalUnits?: number
  reservedForMembers?: number
  soldUnits?: number
  waitlistCount?: number
  registered?: boolean
  positionOnWaitlist?: number
}

export interface TesterInvite extends Auditable {
  id: string
  dropId?: string
  productIds: string[]
  title: string
  message: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  voucherCode?: string
  feedbackSubmitted: boolean
  feedbackDeadline?: Date
}
