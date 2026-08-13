import type { MemberProfile, MemberMatch, DMThread, DMMessage } from '@/types/members'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export interface MatchFilters {
  interests?: string[]
  location?: string
  availability?: 'weekday' | 'weekend' | 'anytime'
  excludeCircleIds?: string[]
}

export interface ConnectionServiceInterface {
  listDirectory(
    auth: AuthContext,
    filters?: MatchFilters & PaginationParams,
  ): Promise<Paginated<MemberProfile>>
  getMember(auth: AuthContext, memberId: string): Promise<MemberProfile>
  findMatches(auth: AuthContext, filters?: MatchFilters): Promise<MemberMatch[]>
  listDMThreads(auth: AuthContext): Promise<DMThread[]>
  getDMThread(auth: AuthContext, threadId: string): Promise<DMThread & { messages: DMMessage[] }>
  sendDM(auth: AuthContext, toMemberId: string, content: string): Promise<DMMessage>
  blockMember(auth: AuthContext, memberId: string): Promise<void>
  reportMember(auth: AuthContext, memberId: string, reason: string): Promise<{ reportId: string }>
}

export const ConnectionService: ConnectionServiceInterface = {
  async listDirectory(_auth, _filters) {
    throw new Error('ConnectionService.listDirectory not implemented')
  },
  async getMember(_auth, _memberId) {
    throw new Error('ConnectionService.getMember not implemented')
  },
  async findMatches(_auth, _filters) {
    throw new Error('ConnectionService.findMatches not implemented')
  },
  async listDMThreads(_auth) {
    throw new Error('ConnectionService.listDMThreads not implemented')
  },
  async getDMThread(_auth, _threadId) {
    throw new Error('ConnectionService.getDMThread not implemented')
  },
  async sendDM(_auth, _toMemberId, _content) {
    throw new Error('ConnectionService.sendDM not implemented')
  },
  async blockMember(_auth, _memberId) {
    throw new Error('ConnectionService.blockMember not implemented')
  },
  async reportMember(_auth, _memberId, _reason) {
    throw new Error('ConnectionService.reportMember not implemented')
  },
}
