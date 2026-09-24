import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type {
  Channel,
  CreatePostInput,
  CreateThreadInput,
  Post,
  SearchFilters,
  SearchResults,
  Thread,
} from '@/types/community'
import type { Paginated, PaginationParams } from '@/types/common'

export interface CommunityService {
  listChannels: (params?: PaginationParams) => Promise<Paginated<Channel>>
  listThreads: (channelId: string, params?: PaginationParams) => Promise<Paginated<Thread>>
  getThread: (threadId: string) => Promise<Thread & { posts: Post[] }>
  createThread: (input: CreateThreadInput) => Promise<Thread>
  createPost: (input: CreatePostInput) => Promise<Post>
  search: (query: string, filters?: SearchFilters) => Promise<SearchResults>
}

export function createCommunityService(client: ApiClientInterface = apiClient): CommunityService {
  return {
    listChannels: params => client.get('/channels', params as any),
    listThreads: (channelId, params) => client.get(`/channels/${channelId}/threads`, params as any),
    getThread: threadId => client.get(`/threads/${threadId}`),
    createThread: input => client.post('/threads', input),
    createPost: input => client.post('/posts', input),
    search: (query, filters) => client.get('/search', { q: query, ...(filters as any) }),
  }
}

export const communityApi: CommunityService = createCommunityService()
