import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { AuthApiProfile, AuthApiUser } from '@/types/auth'
import type { MemberMatch, MemberProfile } from '@/types/members'
import type { Paginated, PaginationParams } from '@/types/common'

export type UpdateProfileInput = Partial<Omit<AuthApiProfile, 'onboardingStep' | 'onboardingCompletedAt'>>

export interface HandleAvailability {
  available: boolean
}

export type PushPlatform = 'IOS' | 'ANDROID'

export interface RegisterPushTokenInput {
  token: string
  platform: PushPlatform
}

export interface MemberDirectoryFilters {
  city?: string
  industry?: string
  businessStage?: string
}

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED'

export interface Connection {
  id: string
  status: ConnectionStatus
  member: MemberProfile
  createdAt: string
}

export interface RespondToConnectionInput {
  id: string
  status: Extract<ConnectionStatus, 'ACCEPTED' | 'DECLINED'>
}

export interface OnboardingProgress {
  onboardingStep: string
  onboardingCompletedAt?: string
}

export interface ReportProblemInput {
  reason: string
  description: string
}

export type DataExport = Record<string, unknown>

export interface SharedGroup {
  id: string
  name: string
  type: 'space' | 'circle'
  emoji?: string
  memberCount?: number
}

export interface UsersService {
  getMe: () => Promise<AuthApiUser>
  updateProfile: (input: UpdateProfileInput) => Promise<AuthApiUser>
  deleteMe: () => Promise<void>
  checkHandleAvailability: (handle: string) => Promise<HandleAvailability>
  registerPushToken: (input: RegisterPushTokenInput) => Promise<void>
  listDirectory: (
    filters?: MemberDirectoryFilters & PaginationParams,
  ) => Promise<Paginated<MemberProfile>>
  getRecommendations: () => Promise<MemberMatch[]>
  searchMembers: (query: string) => Promise<MemberProfile[]>
  listRecentSearches: () => Promise<MemberProfile[]>
  clearRecentSearches: () => Promise<void>
  removeRecentSearch: (id: string) => Promise<void>
  sendConnectionRequest: (id: string) => Promise<void>
  respondToConnection: (input: RespondToConnectionInput) => Promise<void>
  listConnections: () => Promise<Connection[]>
  getOnboardingProgress: () => Promise<OnboardingProgress>
  advanceOnboarding: () => Promise<OnboardingProgress>
  listBlockedAccounts: () => Promise<MemberProfile[]>
  reportProblem: (input: ReportProblemInput) => Promise<void>
  exportMyData: (categories?: string[]) => Promise<DataExport>
  blockMember: (id: string) => Promise<void>
  unblockMember: (id: string) => Promise<void>
  followMember: (id: string) => Promise<void>
  unfollowMember: (id: string) => Promise<void>
  listFollowers: (id: string) => Promise<MemberProfile[]>
  listFollowing: (id: string) => Promise<MemberProfile[]>
  listGroupsInCommon: (id: string) => Promise<SharedGroup[]>
  getMemberProfile: (id: string) => Promise<MemberProfile>
}

export function createUsersService(client: ApiClientInterface = apiClient): UsersService {
  return {
    getMe: () => client.get('/users/me'),
    updateProfile: input => client.patch('/users/me/profile', input),
    deleteMe: () => client.delete('/users/me', { body: { confirm: true } }),
    checkHandleAvailability: handle => client.get('/users/handle/availability', { handle }),
    registerPushToken: input => client.post('/users/me/push-tokens', input),
    listDirectory: filters => client.get('/users/directory', filters as any),
    getRecommendations: () => client.get('/users/recommendations'),
    searchMembers: query => client.get('/users/search', { q: query }),
    listRecentSearches: () => client.get('/users/recent-searches'),
    clearRecentSearches: () => client.delete('/users/recent-searches'),
    removeRecentSearch: id => client.delete(`/users/recent-searches/${id}`),
    sendConnectionRequest: id => client.post(`/users/${id}/connect`),
    respondToConnection: ({ id, status }) => client.patch(`/users/connections/${id}`, { status }),
    listConnections: () => client.get('/users/connections'),
    getOnboardingProgress: () => client.get('/users/me/onboarding'),
    advanceOnboarding: () => client.post('/users/me/onboarding/advance'),
    listBlockedAccounts: () => client.get('/users/me/blocked'),
    reportProblem: input => client.post('/users/me/report-problem', input),
    exportMyData: categories => {
      const query = categories?.length
        ? `?${categories.map(category => `categories=${encodeURIComponent(category)}`).join('&')}`
        : ''
      return client.get(`/users/me/export${query}`)
    },
    blockMember: id => client.post(`/users/${id}/block`),
    unblockMember: id => client.delete(`/users/${id}/block`),
    followMember: id => client.post(`/users/${id}/follow`),
    unfollowMember: id => client.delete(`/users/${id}/follow`),
    listFollowers: id => client.get(`/users/${id}/followers`),
    listFollowing: id => client.get(`/users/${id}/following`),
    listGroupsInCommon: id => client.get(`/users/${id}/groups-in-common`),
    getMemberProfile: id => client.get(`/users/${id}`),
  }
}

export const usersApi: UsersService = createUsersService()
