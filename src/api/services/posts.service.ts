import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type { Auditable } from '@/types/common'

export type PostContentType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LINK'
export type PostModerationStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED'
export type PostSort = 'NEW' | 'TRENDING' | 'POPULAR'
export type ProfilePostsTab = 'posts' | 'replies' | 'media'

/**
 * The API docs never published a response schema for post endpoints (every example
 * was `{}` or `[{}]`) — this shape is inferred from the `POST /posts` request body
 * plus the fields the docs reference elsewhere (moderation status). Treat engagement
 * counts, author info, etc. as unconfirmed until verified against a live response.
 */
export interface Post extends Auditable {
  spaceId: string
  parentId?: string
  authorId?: string
  contentType: PostContentType
  body: string
  mediaUrl?: string
  isAnonymous: boolean
  isGated: boolean
  minTier?: string
  scheduledFor?: string
  moderationStatus: PostModerationStatus
}

export interface CreatePostInput {
  spaceId: string
  parentId?: string
  contentType: PostContentType
  body: string
  mediaUrl?: string
  isAnonymous?: boolean
  isGated?: boolean
  minTier?: string
  scheduledFor?: string
}

export interface PostThread {
  post: Post
  replies: Post[]
}

export interface CursorPaginated<T> {
  items: T[]
  nextCursor?: string
  hasMore?: boolean
}

export interface FeedParams {
  cursor?: string
  limit?: number
  sort?: PostSort
}

export interface UserPostsParams extends FeedParams {
  tab?: ProfilePostsTab
}

export interface SearchPostsParams {
  q?: string
  spaceId?: string
  dateFrom?: string
  dateTo?: string
}

/** Only "LIKE" is confirmed by the docs; other reaction types are unconfirmed. */
export type ReactionType = string

export interface RepostInput {
  spaceId?: string
  comment?: string
}

export interface UpdatePostInput {
  body?: string
  mediaUrl?: string
  contentType?: PostContentType
  isGated?: boolean
  minTier?: string
}

export interface UnmaskPostInput {
  reason: string
  mfaToken: string
}

export interface PostsService {
  createPost: (input: CreatePostInput) => Promise<Post>
  listMyPosts: (status?: PostModerationStatus) => Promise<Post[]>
  searchPosts: (params?: SearchPostsParams) => Promise<Post[]>
  getFeed: (params?: FeedParams) => Promise<CursorPaginated<Post>>
  listSpacePosts: (spaceId: string, params?: FeedParams) => Promise<CursorPaginated<Post>>
  listUserPosts: (userId: string, params?: UserPostsParams) => Promise<CursorPaginated<Post>>
  listUserReposts: (userId: string) => Promise<Post[]>
  getPostThread: (id: string) => Promise<PostThread>
  addReaction: (id: string, type: ReactionType) => Promise<void>
  removeReaction: (id: string, type: ReactionType) => Promise<void>
  deleteAnonymousPost: (id: string) => Promise<void>
  reportPost: (id: string, reason: string) => Promise<void>
  repostPost: (id: string, input?: RepostInput) => Promise<void>
  removeRepost: (repostId: string) => Promise<void>
  updatePost: (id: string, input: UpdatePostInput) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  approvePost: (id: string) => Promise<Post>
  rejectPost: (id: string, reason: string) => Promise<Post>
  pinPost: (id: string) => Promise<void>
  unpinPost: (id: string) => Promise<void>
  unmaskPost: (id: string, input: UnmaskPostInput) => Promise<Post & { authorId: string }>
}

export function createPostsService(client: ApiClientInterface = apiClient): PostsService {
  return {
    createPost: input => client.post('/posts', input),
    listMyPosts: status => client.get('/posts/mine', status ? { status } : undefined),
    searchPosts: params => client.get('/posts/search', params as any),
    getFeed: params => client.get('/posts/feed', params as any),
    listSpacePosts: (spaceId, params) => client.get(`/posts/space/${spaceId}`, params as any),
    listUserPosts: (userId, params) => client.get(`/posts/user/${userId}`, params as any),
    listUserReposts: userId => client.get(`/posts/user/${userId}/reposts`),
    getPostThread: id => client.get(`/posts/${id}/thread`),
    addReaction: (id, type) => client.post(`/posts/${id}/reactions`, { type }),
    removeReaction: (id, type) => client.delete(`/posts/${id}/reactions/${type}`),
    deleteAnonymousPost: id => client.delete(`/posts/${id}/anonymous`),
    reportPost: (id, reason) => client.post(`/posts/${id}/report`, { reason }),
    repostPost: (id, input) => client.post(`/posts/${id}/repost`, input),
    removeRepost: repostId => client.delete(`/posts/reposts/${repostId}`),
    updatePost: (id, input) => client.patch(`/posts/${id}`, input),
    deletePost: id => client.delete(`/posts/${id}`),
    approvePost: id => client.patch(`/posts/${id}/approve`),
    rejectPost: (id, reason) => client.patch(`/posts/${id}/reject`, { reason }),
    pinPost: id => client.patch(`/posts/${id}/pin`),
    unpinPost: id => client.patch(`/posts/${id}/unpin`),
    unmaskPost: (id, input) => client.patch(`/posts/${id}/unmask`, input),
  }
}

export const postsApi: PostsService = createPostsService()
