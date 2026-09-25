import { useQuery } from '@tanstack/react-query'

import { streaksApi } from '@/api/services/streaks.service'

export const streaksKeys = {
  mine: ['streaks', 'me'] as const,
}

export function useMyStreak(enabled = true) {
  return useQuery({
    queryKey: streaksKeys.mine,
    queryFn: () => streaksApi.getMyStreak(),
    enabled,
  })
}
