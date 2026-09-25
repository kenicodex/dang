import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'

/**
 * No response schema was published for this endpoint (`{}` in the docs) — this
 * shape is a best-effort guess based on common streak-tracking fields, not a
 * confirmed contract. Verify against a live response before relying on it.
 */
export interface Streak {
  current: number
  longest: number
  lastActiveAt?: string
}

export interface StreaksService {
  getMyStreak: () => Promise<Streak>
}

export function createStreaksService(client: ApiClientInterface = apiClient): StreaksService {
  return {
    getMyStreak: () => client.get('/streaks/me'),
  }
}

export const streaksApi: StreaksService = createStreaksService()
