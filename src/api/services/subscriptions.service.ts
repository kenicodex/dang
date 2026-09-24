import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { Invoice, Subscription, SubscriptionTier } from '@/types/subscriptions'
import type { Paginated, PaginationParams } from '@/types/common'

export interface SubscriptionsService {
  listTiers: () => Promise<SubscriptionTier[]>
  getSubscription: () => Promise<Subscription | null>
  listInvoices: (params?: PaginationParams) => Promise<Paginated<Invoice>>
}

export function createSubscriptionsService(client: ApiClientInterface = apiClient): SubscriptionsService {
  return {
    listTiers: () => client.get('/tiers'),
    getSubscription: () => client.get('/subscription'),
    listInvoices: params => client.get('/invoices', params as any),
  }
}

export const subscriptionsApi: SubscriptionsService = createSubscriptionsService()
