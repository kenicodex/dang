import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { communityApi } from '@/api/services/community.service'
import type { SearchFilters } from '@/types/community'
import type { PaginationParams } from '@/types/common'

export const communityKeys = {
  all: ['community'] as const,
  channels: (params?: PaginationParams) => [...communityKeys.all, 'channels', params ?? {}] as const,
  threads: (channelId: string, params?: PaginationParams) =>
    [...communityKeys.all, 'threads', channelId, params ?? {}] as const,
  thread: (threadId: string) => [...communityKeys.all, 'thread', threadId] as const,
  search: (query: string, filters?: SearchFilters) =>
    [...communityKeys.all, 'search', query, filters ?? {}] as const,
}

export function useChannels(params?: PaginationParams) {
  return useQuery({
    queryKey: communityKeys.channels(params),
    queryFn: () => communityApi.listChannels(params),
  })
}

export function useThreads(channelId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: communityKeys.threads(channelId, params),
    queryFn: () => communityApi.listThreads(channelId, params),
    enabled: !!channelId,
  })
}

export function useThread(threadId: string) {
  return useQuery({
    queryKey: communityKeys.thread(threadId),
    queryFn: () => communityApi.getThread(threadId),
    enabled: !!threadId,
  })
}

export function useCommunitySearch(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: communityKeys.search(query, filters),
    queryFn: () => communityApi.search(query, filters),
    enabled: query.trim().length > 0,
  })
}

export function useCreateThread() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communityApi.createThread,
    onSuccess: thread => {
      queryClient.invalidateQueries({ queryKey: communityKeys.threads(thread.channelId) })
    },
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communityApi.createPost,
    onSuccess: post => {
      if (post.threadId) {
        queryClient.invalidateQueries({ queryKey: communityKeys.thread(post.threadId) })
      }
    },
  })
}
