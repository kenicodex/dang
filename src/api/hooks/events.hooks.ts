import { useQuery } from '@tanstack/react-query'

import { eventsApi } from '@/api/services/events.service'
import type { PaginationParams } from '@/types/common'

export const eventsKeys = {
  all: ['events'] as const,
  list: (params?: PaginationParams & { past?: boolean }) => [...eventsKeys.all, 'list', params ?? {}] as const,
}

export function useEvents(params?: PaginationParams & { past?: boolean }) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => eventsApi.listEvents(params),
  })
}
