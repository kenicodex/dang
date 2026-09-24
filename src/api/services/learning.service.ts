import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { Course, LiveSession } from '@/types/learning'
import type { Paginated, PaginationParams } from '@/types/common'

export interface LearningService {
  listCourses: (params?: PaginationParams) => Promise<Paginated<Course>>
  listLiveSessions: () => Promise<LiveSession[]>
}

export function createLearningService(client: ApiClientInterface = apiClient): LearningService {
  return {
    listCourses: params => client.get('/courses', params as any),
    listLiveSessions: () => client.get('/live-sessions'),
  }
}

export const learningApi: LearningService = createLearningService()
