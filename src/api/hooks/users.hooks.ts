import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { usersApi } from '@/api/services/users.service'
import type {
  Connection,
  DataExport,
  MemberDirectoryFilters,
  RegisterPushTokenInput,
  ReportProblemInput,
  RespondToConnectionInput,
  UpdateProfileInput,
} from '@/api/services/users.service'
import { authStorage } from '@/services/authStorage'
import { mapAuthApiUser } from '@/services/mapAuthUser'
import { useAuthStore } from '@/store/useAuthStore'
import type { AuthApiUser } from '@/types/auth'
import type { MemberProfile } from '@/types/members'
import type { PaginationParams } from '@/types/common'

export const usersKeys = {
  me: ['users', 'me'] as const,
  handleAvailability: (handle: string) => ['users', 'handle-availability', handle] as const,
  directory: (filters?: MemberDirectoryFilters & PaginationParams) =>
    ['users', 'directory', filters ?? {}] as const,
  recommendations: ['users', 'recommendations'] as const,
  search: (query: string) => ['users', 'search', query] as const,
  recentSearches: ['users', 'recent-searches'] as const,
  connections: ['users', 'connections'] as const,
  onboarding: ['users', 'me', 'onboarding'] as const,
  blocked: ['users', 'me', 'blocked'] as const,
  profile: (id: string) => ['users', 'profile', id] as const,
  followers: (id: string) => ['users', 'followers', id] as const,
  following: (id: string) => ['users', 'following', id] as const,
  groupsInCommon: (id: string) => ['users', 'groups-in-common', id] as const,
}

function syncUser(apiUser: AuthApiUser) {
  const user = mapAuthApiUser(apiUser)
  useAuthStore.setState(prev => ({ ...prev, user, isAuthenticated: true }))
  return apiUser
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: usersKeys.me,
    queryFn: async () => syncUser(await usersApi.getMe()),
    enabled,
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateProfile(input),
    onSuccess: apiUser => {
      syncUser(apiUser)
      queryClient.setQueryData(usersKeys.me, apiUser)
    },
  })
}

export function useHandleAvailability(handle: string) {
  const normalized = handle.trim().toLowerCase()
  return useQuery({
    queryKey: usersKeys.handleAvailability(normalized),
    queryFn: () => usersApi.checkHandleAvailability(normalized),
    enabled: normalized.length > 0,
  })
}

export function useRegisterPushTokenMutation() {
  return useMutation({
    mutationFn: (input: RegisterPushTokenInput) => usersApi.registerPushToken(input),
  })
}

export function useMemberDirectory(filters?: MemberDirectoryFilters & PaginationParams) {
  return useQuery({
    queryKey: usersKeys.directory(filters),
    queryFn: () => usersApi.listDirectory(filters),
  })
}

export function useRecommendations() {
  return useQuery({
    queryKey: usersKeys.recommendations,
    queryFn: () => usersApi.getRecommendations(),
  })
}

export function useMemberSearch(query: string) {
  const trimmed = query.trim()
  return useQuery({
    queryKey: usersKeys.search(trimmed),
    queryFn: () => usersApi.searchMembers(trimmed),
    enabled: trimmed.length > 0,
  })
}

export function useRecentSearches(enabled = true) {
  return useQuery({
    queryKey: usersKeys.recentSearches,
    queryFn: () => usersApi.listRecentSearches(),
    enabled,
  })
}

export function useClearRecentSearchesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => usersApi.clearRecentSearches(),
    onSuccess: () => {
      queryClient.setQueryData<MemberProfile[]>(usersKeys.recentSearches, [])
    },
  })
}

export function useRemoveRecentSearchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.removeRecentSearch(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<MemberProfile[]>(usersKeys.recentSearches, prev =>
        prev?.filter(member => member.id !== id),
      )
    },
  })
}

export function useSendConnectionRequestMutation() {
  return useMutation({
    mutationFn: (id: string) => usersApi.sendConnectionRequest(id),
  })
}

export function useConnections() {
  return useQuery({
    queryKey: usersKeys.connections,
    queryFn: () => usersApi.listConnections(),
  })
}

export function useRespondToConnectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RespondToConnectionInput) => usersApi.respondToConnection(input),
    onSuccess: (_data, { id, status }) => {
      queryClient.setQueryData<Connection[]>(usersKeys.connections, prev =>
        prev?.map(connection => (connection.id === id ? { ...connection, status } : connection)),
      )
    },
  })
}

export function useOnboardingProgress(enabled = true) {
  return useQuery({
    queryKey: usersKeys.onboarding,
    queryFn: () => usersApi.getOnboardingProgress(),
    enabled,
  })
}

export function useAdvanceOnboardingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => usersApi.advanceOnboarding(),
    onSuccess: progress => {
      queryClient.setQueryData(usersKeys.onboarding, progress)
    },
  })
}

export function useBlockedAccounts(enabled = true) {
  return useQuery({
    queryKey: usersKeys.blocked,
    queryFn: () => usersApi.listBlockedAccounts(),
    enabled,
  })
}

export function useReportProblemMutation() {
  return useMutation({
    mutationFn: (input: ReportProblemInput) => usersApi.reportProblem(input),
  })
}

export function useExportMyDataMutation() {
  return useMutation<DataExport, Error, string[] | undefined>({
    mutationFn: categories => usersApi.exportMyData(categories),
  })
}

export function useBlockMemberMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.blockMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.blocked })
    },
  })
}

export function useUnblockMemberMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.unblockMember(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<MemberProfile[]>(usersKeys.blocked, prev =>
        prev?.filter(member => member.id !== id),
      )
    },
  })
}

export function useMemberProfile(id: string, enabled = true) {
  return useQuery({
    queryKey: usersKeys.profile(id),
    queryFn: () => usersApi.getMemberProfile(id),
    enabled: enabled && !!id,
  })
}

export function useFollowers(id: string) {
  return useQuery({
    queryKey: usersKeys.followers(id),
    queryFn: () => usersApi.listFollowers(id),
    enabled: !!id,
  })
}

export function useFollowing(id: string) {
  return useQuery({
    queryKey: usersKeys.following(id),
    queryFn: () => usersApi.listFollowing(id),
    enabled: !!id,
  })
}

export function useGroupsInCommon(id: string) {
  return useQuery({
    queryKey: usersKeys.groupsInCommon(id),
    queryFn: () => usersApi.listGroupsInCommon(id),
    enabled: !!id,
  })
}

function patchMemberProfile(queryClient: ReturnType<typeof useQueryClient>, id: string, isFollowing: boolean) {
  queryClient.setQueryData<MemberProfile>(usersKeys.profile(id), prev =>
    prev
      ? {
          ...prev,
          isFollowing,
          followerCount:
            prev.followerCount != null ? Math.max(prev.followerCount + (isFollowing ? 1 : -1), 0) : prev.followerCount,
        }
      : prev,
  )
}

export function useFollowMemberMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.followMember(id),
    onSuccess: (_data, id) => {
      patchMemberProfile(queryClient, id, true)
      queryClient.invalidateQueries({ queryKey: usersKeys.followers(id) })
    },
  })
}

export function useUnfollowMemberMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.unfollowMember(id),
    onSuccess: (_data, id) => {
      patchMemberProfile(queryClient, id, false)
      queryClient.invalidateQueries({ queryKey: usersKeys.followers(id) })
    },
  })
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => usersApi.deleteMe(),
    onSuccess: async () => {
      await authStorage.clearSession()
      useAuthStore.setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        accessToken: null,
        subscriptionTier: null,
      }))
      queryClient.removeQueries({ queryKey: usersKeys.me })
    },
  })
}
