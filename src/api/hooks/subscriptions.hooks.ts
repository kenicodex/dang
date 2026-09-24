import { useQuery } from '@tanstack/react-query'

import { subscriptionsApi } from '@/api/services/subscriptions.service'
import type { PaginationParams } from '@/types/common'

export const subscriptionsKeys = {
  all: ['subscriptions'] as const,
  tiers: () => [...subscriptionsKeys.all, 'tiers'] as const,
  current: () => [...subscriptionsKeys.all, 'current'] as const,
  invoices: (params?: PaginationParams) => [...subscriptionsKeys.all, 'invoices', params ?? {}] as const,
}

export function useSubscriptionTiers() {
  return useQuery({
    queryKey: subscriptionsKeys.tiers(),
    queryFn: () => subscriptionsApi.listTiers(),
  })
}

export function useSubscription() {
  return useQuery({
    queryKey: subscriptionsKeys.current(),
    queryFn: () => subscriptionsApi.getSubscription(),
  })
}

export function useInvoices(params?: PaginationParams) {
  return useQuery({
    queryKey: subscriptionsKeys.invoices(params),
    queryFn: () => subscriptionsApi.listInvoices(params),
  })
}
