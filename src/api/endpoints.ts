import type { ApiClientInterface } from './client'
import { apiClient } from './client'
import type {
  Channel,
  Thread,
  Post,
  SearchResults,
  SearchFilters,
  CreatePostInput,
  CreateThreadInput,
} from '@/types/community'
import type { Paginated, PaginationParams } from '@/types/common'
import type { SubscriptionTier, Subscription, Invoice } from '@/types/subscriptions'
import type { Circle, CircleMember } from '@/types/circles'
import type { Course, LiveSession } from '@/types/learning'
import type { Event } from '@/types/events'

export interface ApiEndpoints {
  community: {
    listChannels: (params?: PaginationParams) => Promise<Paginated<Channel>>
    listThreads: (channelId: string, params?: PaginationParams) => Promise<Paginated<Thread>>
    getThread: (threadId: string) => Promise<Thread & { posts: Post[] }>
    createThread: (input: CreateThreadInput) => Promise<Thread>
    createPost: (input: CreatePostInput) => Promise<Post>
    search: (query: string, filters?: SearchFilters) => Promise<SearchResults>
  }
  subscriptions: {
    listTiers: () => Promise<SubscriptionTier[]>
    getSubscription: () => Promise<Subscription | null>
    listInvoices: (params?: PaginationParams) => Promise<Paginated<Invoice>>
  }
  circles: {
    listCircles: (params?: PaginationParams) => Promise<Paginated<Circle>>
    listMembers: (circleId: string) => Promise<CircleMember[]>
  }
  learning: {
    listCourses: (params?: PaginationParams) => Promise<Paginated<Course>>
    listLiveSessions: () => Promise<LiveSession[]>
  }
  events: {
    listEvents: (params?: PaginationParams & { past?: boolean }) => Promise<Paginated<Event>>
  }
}

export function createEndpoints(client: ApiClientInterface = apiClient): ApiEndpoints {
  return {
    community: {
      listChannels: params => client.get('/channels', params as any),
      listThreads: (channelId, params) =>
        client.get(`/channels/${channelId}/threads`, params as any),
      getThread: threadId => client.get(`/threads/${threadId}`),
      createThread: input => client.post('/threads', input),
      createPost: input => client.post('/posts', input),
      search: (query, filters) =>
        client.get('/search', { q: query, ...(filters as any) }),
    },
    subscriptions: {
      listTiers: () => client.get('/tiers'),
      getSubscription: () => client.get('/subscription'),
      listInvoices: params => client.get('/invoices', params as any),
    },
    circles: {
      listCircles: params => client.get('/circles', params as any),
      listMembers: circleId => client.get(`/circles/${circleId}/members`),
    },
    learning: {
      listCourses: params => client.get('/courses', params as any),
      listLiveSessions: () => client.get('/live-sessions'),
    },
    events: {
      listEvents: params => client.get('/events', params as any),
    },
  }
}

export const api: ApiEndpoints = createEndpoints()
