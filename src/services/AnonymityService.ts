import type { AuthContext } from '@/types/auth'

export interface AnonymousIdentityMapping {
  postId: string
  anonymousHandle: string
  unmaskedAt?: Date
  unmaskedBy?: string
  unmaskReason?: string
}

export interface CreateAnonymousPostParams {
  content: string
  channelId: string
  threadId?: string
  authorMemberId: string
}

export interface UnmaskAuditRecord {
  id: string
  postId: string
  actorId: string
  actorRole: 'founder' | 'admin'
  reason: string
  revealedMemberId: string
  createdAt: Date
}

export interface AnonymityServiceInterface {
  generateAnonymousHandle(authorMemberId: string, salt?: string): Promise<string>
  createAnonymousPost(
    auth: AuthContext,
    params: CreateAnonymousPostParams,
  ): Promise<{ postId: string; anonymousHandle: string }>
  resolveAuthorIdentity(postId: string): Promise<{ memberId: string; anonymousHandle: string } | null>
  unmaskPost(
    auth: AuthContext & { role: 'founder' | 'admin' },
    postId: string,
    reason: string,
  ): Promise<UnmaskAuditRecord>
  listUnmaskAuditTrail(
    auth: AuthContext & { role: 'founder' | 'admin' },
    postId?: string,
  ): Promise<UnmaskAuditRecord[]>
  validateAnonymousAccess(auth: AuthContext, postId: string): Promise<boolean>
}

export const AnonymityService: AnonymityServiceInterface = {
  async generateAnonymousHandle(_authorMemberId, _salt) {
    throw new Error('AnonymityService.generateAnonymousHandle not implemented')
  },
  async createAnonymousPost(_auth, _params) {
    throw new Error('AnonymityService.createAnonymousPost not implemented')
  },
  async resolveAuthorIdentity(_postId) {
    throw new Error('AnonymityService.resolveAuthorIdentity not implemented')
  },
  async unmaskPost(_auth, _postId, _reason) {
    throw new Error('AnonymityService.unmaskPost not implemented — requires structural identity separation (NFR-S02) and audit log')
  },
  async listUnmaskAuditTrail(_auth, _postId) {
    throw new Error('AnonymityService.listUnmaskAuditTrail not implemented')
  },
  async validateAnonymousAccess(_auth, _postId) {
    throw new Error('AnonymityService.validateAnonymousAccess not implemented')
  },
}
