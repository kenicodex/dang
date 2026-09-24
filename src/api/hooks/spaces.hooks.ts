import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { spacesApi } from '@/api/services/spaces.service'
import type {
  CreateSpaceInput,
  InviteToSpaceInput,
  Space,
  SpaceApplication,
  SpaceListFilters,
  SpaceMember,
  SpaceMemberRole,
  UpdateSpaceInput,
} from '@/api/services/spaces.service'
import type { PaginationParams } from '@/types/common'
import { useCommunityStore } from '@/store/useCommunityStore'

export const spacesKeys = {
  all: ['spaces'] as const,
  list: (params?: SpaceListFilters & PaginationParams) => [...spacesKeys.all, 'list', params ?? {}] as const,
  detail: (id: string) => [...spacesKeys.all, 'detail', id] as const,
  members: (id: string) => [...spacesKeys.all, 'members', id] as const,
  applications: (id: string) => [...spacesKeys.all, 'applications', id] as const,
}

function patchSpaceMemberCount(queryClient: ReturnType<typeof useQueryClient>, id: string, delta: number) {
  queryClient.setQueryData<Space>(spacesKeys.detail(id), prev =>
    prev
      ? { ...prev, memberCount: prev.memberCount != null ? Math.max(prev.memberCount + delta, 0) : prev.memberCount }
      : prev,
  )
}

export function useSpaces(params?: SpaceListFilters & PaginationParams) {
  return useQuery({
    queryKey: spacesKeys.list(params),
    queryFn: () => spacesApi.listSpaces(params),
  })
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: spacesKeys.detail(id),
    queryFn: () => spacesApi.getSpace(id),
    enabled: !!id,
  })
}

export function useCreateSpaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSpaceInput) => spacesApi.createSpace(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spacesKeys.all })
    },
  })
}

export function useUpdateSpaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSpaceInput }) => spacesApi.updateSpace(id, input),
    onSuccess: (space: Space, { id }) => {
      queryClient.setQueryData(spacesKeys.detail(id), space)
      queryClient.invalidateQueries({ queryKey: spacesKeys.list() })
    },
  })
}

export function useSpaceMembers(id: string) {
  return useQuery({
    queryKey: spacesKeys.members(id),
    queryFn: () => spacesApi.listSpaceMembers(id),
    enabled: !!id,
  })
}

export function useJoinSpaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => spacesApi.joinSpace(id),
    onSuccess: (_data, id) => {
      patchSpaceMemberCount(queryClient, id, 1)
      queryClient.invalidateQueries({ queryKey: spacesKeys.members(id) })
      useCommunityStore.getState().joinSpace(id)
    },
  })
}

export function useLeaveSpaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => spacesApi.leaveSpace(id),
    onSuccess: (_data, id) => {
      patchSpaceMemberCount(queryClient, id, -1)
      queryClient.invalidateQueries({ queryKey: spacesKeys.members(id) })
      useCommunityStore.getState().leaveSpace(id)
    },
  })
}

export function useInviteToSpaceMutation() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InviteToSpaceInput }) => spacesApi.inviteToSpace(id, input),
  })
}

export function useApplyToSpaceMutation() {
  return useMutation({
    mutationFn: (id: string) => spacesApi.applyToSpace(id),
  })
}

export function useSpaceApplications(id: string) {
  return useQuery({
    queryKey: spacesKeys.applications(id),
    queryFn: () => spacesApi.listSpaceApplications(id),
    enabled: !!id,
  })
}

export function useApproveSpaceApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, memberId }: { id: string; memberId: string }) =>
      spacesApi.approveSpaceApplication(id, memberId),
    onSuccess: (_data, { id, memberId }) => {
      queryClient.setQueryData<SpaceApplication[]>(spacesKeys.applications(id), prev =>
        prev?.filter(application => application.memberId !== memberId),
      )
      queryClient.invalidateQueries({ queryKey: spacesKeys.members(id) })
    },
  })
}

export function useRejectSpaceApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, memberId }: { id: string; memberId: string }) =>
      spacesApi.rejectSpaceApplication(id, memberId),
    onSuccess: (_data, { id, memberId }) => {
      queryClient.setQueryData<SpaceApplication[]>(spacesKeys.applications(id), prev =>
        prev?.filter(application => application.memberId !== memberId),
      )
    },
  })
}

export function useAssignSpaceMemberRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, memberId, role }: { id: string; memberId: string; role: SpaceMemberRole }) =>
      spacesApi.assignSpaceMemberRole(id, memberId, role),
    onSuccess: (_data, { id, memberId, role }) => {
      queryClient.setQueryData<SpaceMember[]>(spacesKeys.members(id), prev =>
        prev?.map(member => (member.memberId === memberId ? { ...member, role } : member)),
      )
    },
  })
}
