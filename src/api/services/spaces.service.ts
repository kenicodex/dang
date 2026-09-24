import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { Auditable, Paginated, PaginationParams } from '@/types/common'
import type { Channel } from '@/types/community'
import type { MemberProfile } from '@/types/members'

/**
 * The real `/spaces` API's `guidelines` is a single freeform string, unlike the
 * mock-era `Channel.guidelines: string[]` it otherwise mirrors.
 */
export interface Space extends Omit<Channel, 'guidelines'> {
  type: string
  minTier?: string
  guidelines?: string
}

export interface CreateSpaceInput {
  name: string
  description: string
  category?: string
  guidelines?: string
  type: string
  minTier?: string
  isPrivate?: boolean
}

export type UpdateSpaceInput = Partial<CreateSpaceInput>

export interface SpaceListFilters {
  category?: string
}

export type SpaceMemberRole = 'LEADER' | 'MODERATOR' | 'MEMBER'

export interface SpaceMember extends Auditable {
  spaceId: string
  memberId: string
  role: SpaceMemberRole
  profile?: Pick<MemberProfile, 'id' | 'displayName' | 'handle' | 'avatarUrl'>
  joinedAt: string
}

export interface InviteToSpaceInput {
  userId?: string
  email?: string
}

export type SpaceApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface SpaceApplication extends Auditable {
  spaceId: string
  memberId: string
  profile?: Pick<MemberProfile, 'id' | 'displayName' | 'handle' | 'avatarUrl'>
  status: SpaceApplicationStatus
  appliedAt: string
}

export interface SpacesService {
  createSpace: (input: CreateSpaceInput) => Promise<Space>
  listSpaces: (params?: SpaceListFilters & PaginationParams) => Promise<Paginated<Space>>
  updateSpace: (id: string, input: UpdateSpaceInput) => Promise<Space>
  getSpace: (id: string) => Promise<Space>
  joinSpace: (id: string) => Promise<void>
  leaveSpace: (id: string) => Promise<void>
  listSpaceMembers: (id: string) => Promise<SpaceMember[]>
  inviteToSpace: (id: string, input: InviteToSpaceInput) => Promise<void>
  applyToSpace: (id: string) => Promise<void>
  listSpaceApplications: (id: string) => Promise<SpaceApplication[]>
  approveSpaceApplication: (id: string, memberId: string) => Promise<void>
  rejectSpaceApplication: (id: string, memberId: string) => Promise<void>
  assignSpaceMemberRole: (id: string, memberId: string, role: SpaceMemberRole) => Promise<void>
}

export function createSpacesService(client: ApiClientInterface = apiClient): SpacesService {
  return {
    createSpace: input => client.post('/spaces', input),
    listSpaces: params => client.get('/spaces', params as any),
    updateSpace: (id, input) => client.patch(`/spaces/${id}`, input),
    getSpace: id => client.get(`/spaces/${id}`),
    joinSpace: id => client.post(`/spaces/${id}/join`),
    leaveSpace: id => client.delete(`/spaces/${id}/members/me`),
    listSpaceMembers: id => client.get(`/spaces/${id}/members`),
    inviteToSpace: (id, input) => client.post(`/spaces/${id}/invite`, input),
    applyToSpace: id => client.post(`/spaces/${id}/apply`),
    listSpaceApplications: id => client.get(`/spaces/${id}/applications`),
    approveSpaceApplication: (id, memberId) => client.patch(`/spaces/${id}/applications/${memberId}/approve`),
    rejectSpaceApplication: (id, memberId) => client.patch(`/spaces/${id}/applications/${memberId}/reject`),
    assignSpaceMemberRole: (id, memberId, role) =>
      client.patch(`/spaces/${id}/members/${memberId}/role`, { role }),
  }
}

export const spacesApi: SpacesService = createSpacesService()
