import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { Circle, CircleMember } from '@/types/circles'
import type { Paginated, PaginationParams } from '@/types/common'

export interface CirclesService {
  listCircles: (params?: PaginationParams) => Promise<Paginated<Circle>>
  listMembers: (circleId: string) => Promise<CircleMember[]>
}

export function createCirclesService(client: ApiClientInterface = apiClient): CirclesService {
  return {
    listCircles: params => client.get('/circles', params as any),
    listMembers: circleId => client.get(`/circles/${circleId}/members`),
  }
}

export const circlesApi: CirclesService = createCirclesService()
