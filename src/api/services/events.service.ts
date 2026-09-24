import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { Event } from '@/types/events'
import type { Paginated, PaginationParams } from '@/types/common'

export interface EventsService {
  listEvents: (params?: PaginationParams & { past?: boolean }) => Promise<Paginated<Event>>
}

export function createEventsService(client: ApiClientInterface = apiClient): EventsService {
  return {
    listEvents: params => client.get('/events', params as any),
  }
}

export const eventsApi: EventsService = createEventsService()
