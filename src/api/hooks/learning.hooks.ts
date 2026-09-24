import { useQuery } from '@tanstack/react-query'

import { learningApi } from '@/api/services/learning.service'
import type { PaginationParams } from '@/types/common'

export const learningKeys = {
  all: ['learning'] as const,
  courses: (params?: PaginationParams) => [...learningKeys.all, 'courses', params ?? {}] as const,
  liveSessions: () => [...learningKeys.all, 'live-sessions'] as const,
}

export function useCourses(params?: PaginationParams) {
  return useQuery({
    queryKey: learningKeys.courses(params),
    queryFn: () => learningApi.listCourses(params),
  })
}

export function useLiveSessions() {
  return useQuery({
    queryKey: learningKeys.liveSessions(),
    queryFn: () => learningApi.listLiveSessions(),
  })
}
