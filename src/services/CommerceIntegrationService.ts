import type { Drop, DiscountState, TesterInvite, Product } from '@/types/commerce'
import type { AuthContext } from '@/types/auth'

export type DropPhase = 'member-only' | 'public' | 'ended'

export interface CommerceIntegrationServiceInterface {
  getDiscountState(auth: AuthContext): Promise<DiscountState>
  generateShopSSOToken(auth: AuthContext): Promise<{ token: string; shopUrl: string; expiresAt: Date }>
  listActiveDrops(auth: AuthContext): Promise<Drop[]>
  getDrop(auth: AuthContext, dropId: string): Promise<Drop & { products: Product[]; phase: DropPhase }>
  getDropPhase(dropId: string, now?: Date): Promise<DropPhase>
  registerEarlyAccessInterest(auth: AuthContext, dropId: string): Promise<{ position: number; windowOpensAt?: Date }>
  listTesterInvites(auth: AuthContext): Promise<TesterInvite[]>
  acceptTesterInvite(auth: AuthContext, inviteId: string): Promise<{ success: true; voucherCode?: string }>
  submitTesterFeedback(auth: AuthContext, inviteId: string, feedback: unknown): Promise<void>
  deactivateDiscountOnLapse(memberId: string): Promise<{ affectedSubscriptions: number }>
  getRecommendations(auth: AuthContext, limit?: number): Promise<Product[]>
}

export const CommerceIntegrationService: CommerceIntegrationServiceInterface = {
  async getDiscountState(_auth) {
    throw new Error('CommerceIntegrationService.getDiscountState not implemented')
  },
  async generateShopSSOToken(_auth) {
    throw new Error('CommerceIntegrationService.generateShopSSOToken not implemented (FR-I02: auto-populated 10% discount)')
  },
  async listActiveDrops(_auth) {
    throw new Error('CommerceIntegrationService.listActiveDrops not implemented')
  },
  async getDrop(_auth, _dropId) {
    throw new Error('CommerceIntegrationService.getDrop not implemented')
  },
  async getDropPhase(_dropId, _now) {
    throw new Error('CommerceIntegrationService.getDropPhase not implemented — drops use explicit state machine (FR-I04/05)')
  },
  async registerEarlyAccessInterest(_auth, _dropId) {
    throw new Error('CommerceIntegrationService.registerEarlyAccessInterest not implemented')
  },
  async listTesterInvites(_auth) {
    throw new Error('CommerceIntegrationService.listTesterInvites not implemented')
  },
  async acceptTesterInvite(_auth, _inviteId) {
    throw new Error('CommerceIntegrationService.acceptTesterInvite not implemented')
  },
  async submitTesterFeedback(_auth, _inviteId, _feedback) {
    throw new Error('CommerceIntegrationService.submitTesterFeedback not implemented')
  },
  async deactivateDiscountOnLapse(_memberId) {
    throw new Error('CommerceIntegrationService.deactivateDiscountOnLapse not implemented (FR-I03)')
  },
  async getRecommendations(_auth, _limit) {
    throw new Error('CommerceIntegrationService.getRecommendations not implemented')
  },
}
