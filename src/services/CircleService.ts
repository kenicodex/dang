import type { Circle, CircleMember, CircleInvite } from '@/types/circles'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export interface CreateCircleInput {
  name: string
  description?: string
  emoji?: string
  memberIds?: string[]
}

export interface InviteToCircleInput {
  circleId: string
  emails?: string[]
  memberIds?: string[]
  message?: string
}

export interface CircleServiceInterface {
  listCircles(auth: AuthContext, params?: PaginationParams): Promise<Paginated<Circle>>
  getCircle(auth: AuthContext, circleId: string): Promise<Circle>
  createCircle(auth: AuthContext, input: CreateCircleInput): Promise<Circle>
  updateCircle(auth: AuthContext, circleId: string, patch: Partial<CreateCircleInput>): Promise<Circle>
  listMembers(auth: AuthContext, circleId: string): Promise<CircleMember[]>
  addMember(auth: AuthContext, circleId: string, memberId: string): Promise<CircleMember>
  removeMember(auth: AuthContext, circleId: string, memberId: string): Promise<void>
  assignRole(
    auth: AuthContext,
    circleId: string,
    memberId: string,
    role: 'leader' | 'moderator' | 'member',
  ): Promise<CircleMember>
  sendInvites(auth: AuthContext, input: InviteToCircleInput): Promise<{ invited: number; invites: CircleInvite[] }>
  acceptInvite(auth: AuthContext, inviteId: string): Promise<CircleMember>
  declineInvite(auth: AuthContext, inviteId: string): Promise<void>
  listPendingInvites(auth: AuthContext, circleId?: string): Promise<CircleInvite[]>
  leaveCircle(auth: AuthContext, circleId: string): Promise<void>
}

export const CircleService: CircleServiceInterface = {
  async listCircles(_auth, _params) {
    throw new Error('CircleService.listCircles not implemented')
  },
  async getCircle(_auth, _circleId) {
    throw new Error('CircleService.getCircle not implemented')
  },
  async createCircle(_auth, _input) {
    throw new Error('CircleService.createCircle not implemented')
  },
  async updateCircle(_auth, _circleId, _patch) {
    throw new Error('CircleService.updateCircle not implemented')
  },
  async listMembers(_auth, _circleId) {
    throw new Error('CircleService.listMembers not implemented')
  },
  async addMember(_auth, _circleId, _memberId) {
    throw new Error('CircleService.addMember not implemented')
  },
  async removeMember(_auth, _circleId, _memberId) {
    throw new Error('CircleService.removeMember not implemented')
  },
  async assignRole(_auth, _circleId, _memberId, _role) {
    throw new Error('CircleService.assignRole not implemented')
  },
  async sendInvites(_auth, _input) {
    throw new Error('CircleService.sendInvites not implemented')
  },
  async acceptInvite(_auth, _inviteId) {
    throw new Error('CircleService.acceptInvite not implemented')
  },
  async declineInvite(_auth, _inviteId) {
    throw new Error('CircleService.declineInvite not implemented')
  },
  async listPendingInvites(_auth, _circleId) {
    throw new Error('CircleService.listPendingInvites not implemented')
  },
  async leaveCircle(_auth, _circleId) {
    throw new Error('CircleService.leaveCircle not implemented')
  },
}
