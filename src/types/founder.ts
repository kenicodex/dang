import type { Auditable } from './common'
import type { SubscriptionTier } from './subscriptions'

export type FounderContentType = 'devotional' | 'journal' | 'audio' | 'video' | 'letter' | 'behind-the-scenes'

export interface FounderPost extends Auditable {
  title: string
  content: string
  contentType: FounderContentType
  requiredTierId: string
  requiredTier?: SubscriptionTier
  isShareable: boolean
  isEmbeddable: boolean
  mediaUrl?: string
  mediaType?: 'audio' | 'video' | 'image' | 'none'
  publishAt: Date
  isPublished: boolean
  viewCount: number
  likeCount: number
  commentCount: number
}

export interface FounderContentAccess {
  allowed: boolean
  reason?: 'tier-gated' | 'not-published' | 'one-time-link-expired'
  requiredTier?: SubscriptionTier
  oneTimeLinksRemaining?: number
  warning?: string
}
