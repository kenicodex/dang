import type { FounderPost, FounderContentAccess, SubscriptionTier } from '@/types/founder'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export interface ShareAttemptResult {
  allowed: false
  reason: 'tier-gated' | 'share-protected' | 'not-found'
  requiredTier?: SubscriptionTier
} | { allowed: true }

export interface GatedContentServiceInterface {
  listPosts(auth: AuthContext, params?: PaginationParams): Promise<Paginated<FounderPost>>
  getPost(auth: AuthContext, postId: string): Promise<FounderPost>
  checkAccess(auth: AuthContext, contentId: string): Promise<FounderContentAccess>
  validateDirectUrlAccess(auth: AuthContext, postId: string): Promise<{ allowed: boolean; requiredTier?: SubscriptionTier }>
  checkShareable(auth: AuthContext, contentId: string): Promise<ShareAttemptResult>
  createOneTimeViewLink(auth: AuthContext, contentId: string): Promise<{ token: string; expiresAt: Date }>
  consumeOneTimeViewLink(token: string, viewerMemberId?: string): Promise<FounderPost>
  trackEmbedAttempt(embeddingDomain: string, contentId: string): Promise<{ blocked: boolean }>
}

export const GatedContentService: GatedContentServiceInterface = {
  async listPosts(_auth, _params) {
    throw new Error('GatedContentService.listPosts not implemented')
  },
  async getPost(_auth, _postId) {
    throw new Error('GatedContentService.getPost not implemented — must check tier access server-side (NFR-S05)')
  },
  async checkAccess(_auth, _contentId) {
    throw new Error('GatedContentService.checkAccess not implemented')
  },
  async validateDirectUrlAccess(_auth, _postId) {
    throw new Error('GatedContentService.validateDirectUrlAccess not implemented (NFR-S05)')
  },
  async checkShareable(_auth, _contentId) {
    throw new Error('GatedContentService.checkShareable not implemented — founder content is not shareable (FR-E03)')
  },
  async createOneTimeViewLink(_auth, _contentId) {
    throw new Error('GatedContentService.createOneTimeViewLink not implemented')
  },
  async consumeOneTimeViewLink(_token, _viewerMemberId) {
    throw new Error('GatedContentService.consumeOneTimeViewLink not implemented')
  },
  async trackEmbedAttempt(_embeddingDomain, _contentId) {
    throw new Error('GatedContentService.trackEmbedAttempt not implemented')
  },
}
