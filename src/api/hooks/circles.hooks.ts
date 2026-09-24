import { useQuery } from '@tanstack/react-query'

import { circlesApi } from '@/api/services/circles.service'
import type { PaginationParams } from '@/types/common'

export const circlesKeys = {
  all: ['circles'] as const,
  list: (params?: PaginationParams) => [...circlesKeys.all, 'list', params ?? {}] as const,
  members: (circleId: string) => [...circlesKeys.all, 'members', circleId] as const,
}

export function useCircles(params?: PaginationParams) {
  return useQuery({
    queryKey: circlesKeys.list(params),
    queryFn: () => circlesApi.listCircles(params),
  })
}

export function useCircleMembers(circleId: string) {
  return useQuery({
    queryKey: circlesKeys.members(circleId),
    queryFn: () => circlesApi.listMembers(circleId),
    enabled: !!circleId,
  })
}
