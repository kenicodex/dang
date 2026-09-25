import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { postsApi } from '@/api/services/posts.service'
import type {
  CreatePostInput,
  FeedParams,
  PostModerationStatus,
  PostThread,
  ReactionType,
  RepostInput,
  SearchPostsParams,
  UnmaskPostInput,
  UpdatePostInput,
  UserPostsParams,
} from '@/api/services/posts.service'

export const postsKeys = {
  all: ['posts'] as const,
  mine: (status?: PostModerationStatus) => [...postsKeys.all, 'mine', status ?? 'all'] as const,
  search: (params?: SearchPostsParams) => [...postsKeys.all, 'search', params ?? {}] as const,
  feed: (params?: FeedParams) => [...postsKeys.all, 'feed', params ?? {}] as const,
  space: (spaceId: string, params?: FeedParams) => [...postsKeys.all, 'space', spaceId, params ?? {}] as const,
  user: (userId: string, params?: UserPostsParams) => [...postsKeys.all, 'user', userId, params ?? {}] as const,
  userReposts: (userId: string) => [...postsKeys.all, 'user', userId, 'reposts'] as const,
  thread: (id: string) => [...postsKeys.all, 'thread', id] as const,
}

export function useMyPosts(status?: PostModerationStatus) {
  return useQuery({
    queryKey: postsKeys.mine(status),
    queryFn: () => postsApi.listMyPosts(status),
  })
}

export function usePostSearch(params: SearchPostsParams) {
  const hasCriteria = !!(params.q || params.spaceId || params.dateFrom || params.dateTo)
  return useQuery({
    queryKey: postsKeys.search(params),
    queryFn: () => postsApi.searchPosts(params),
    enabled: hasCriteria,
  })
}

export function useFeed(params?: FeedParams) {
  return useQuery({
    queryKey: postsKeys.feed(params),
    queryFn: () => postsApi.getFeed(params),
  })
}

export function useSpacePosts(spaceId: string, params?: FeedParams) {
  return useQuery({
    queryKey: postsKeys.space(spaceId, params),
    queryFn: () => postsApi.listSpacePosts(spaceId, params),
    enabled: !!spaceId,
  })
}

export function useUserPosts(userId: string, params?: UserPostsParams) {
  return useQuery({
    queryKey: postsKeys.user(userId, params),
    queryFn: () => postsApi.listUserPosts(userId, params),
    enabled: !!userId,
  })
}

export function useUserReposts(userId: string) {
  return useQuery({
    queryKey: postsKeys.userReposts(userId),
    queryFn: () => postsApi.listUserReposts(userId),
    enabled: !!userId,
  })
}

export function usePostThread(id: string) {
  return useQuery({
    queryKey: postsKeys.thread(id),
    queryFn: () => postsApi.getPostThread(id),
    enabled: !!id,
  })
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePostInput) => postsApi.createPost(input),
    onSuccess: post => {
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'mine'] })
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'space', post.spaceId] })
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'feed'] })
    },
  })
}

/**
 * Reaction/report/repost responses aren't documented, so success handlers fall back to
 * a broad invalidation of every posts query rather than guessing at specific fields to patch.
 */
export function useAddReactionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: ReactionType }) => postsApi.addReaction(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useRemoveReactionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: ReactionType }) => postsApi.removeReaction(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useDeleteAnonymousPostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postsApi.deleteAnonymousPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useReportPostMutation() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => postsApi.reportPost(id, reason),
  })
}

export function useRepostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: RepostInput }) => postsApi.repostPost(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useRemoveRepostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (repostId: string) => postsApi.removeRepost(repostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePostInput }) => postsApi.updatePost(id, input),
    onSuccess: (post, { id }) => {
      queryClient.setQueryData<PostThread>(postsKeys.thread(id), prev => (prev ? { ...prev, post } : prev))
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'mine'] })
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'space', post.spaceId] })
    },
  })
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: postsKeys.thread(id) })
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useApprovePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postsApi.approvePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useRejectPostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => postsApi.rejectPost(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function usePinPostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postsApi.pinPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useUnpinPostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postsApi.unpinPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
    },
  })
}

export function useUnmaskPostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UnmaskPostInput }) => postsApi.unmaskPost(id, input),
    onSuccess: (post, { id }) => {
      queryClient.setQueryData<PostThread>(postsKeys.thread(id), prev => (prev ? { ...prev, post } : prev))
    },
  })
}
