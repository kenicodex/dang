import type { Auditable, Paginated } from './common'
import type { AuthUser } from './auth'

export interface Channel extends Auditable {
  name: string
  slug: string
  emoji?: string
  coverImageUrl?: string
  description: string
  isPrivate: boolean
  memberCount: number
  unreadCount: number
  pinnedPostIds: string[]
  lastActivityAt: Date
  category?: string
  tagline?: string
  memberAvatars?: string[]
  guidelines?: string[]
  moderator?: ChannelMember
  members?: ChannelMember[]
}

export interface ChannelMember {
  id: string
  displayName: string
  handle: string
  initials: string
  bio?: string
}

export type PostModerationStatus = 'pending' | 'approved' | 'rejected'

export interface Post extends Auditable {
  threadId?: string
  channelId: string
  authorId?: string
  author?: Pick<AuthUser, 'id' | 'displayName' | 'handle' | 'avatarUrl'>
  content: string
  isAnonymous: boolean
  anonymousHandle?: string
  isPinned: boolean
  likeCount: number
  replyCount: number
  repostCount: number
  hasLiked?: boolean
  hasBookmarked?: boolean
  timeAgo: string
  attachments?: PostAttachment[]
  reactions?: Record<string, number>
  channelName?: string
  tags?: string[]
  moderationStatus: PostModerationStatus
  rejectionReason?: string
  replierAvatars?: string[]
}

export interface PostAttachment {
  id: string
  type: 'image' | 'video' | 'audio' | 'link'
  url: string
  thumbnailUrl?: string
  meta?: Record<string, unknown>
}

export interface Thread extends Auditable {
  channelId: string
  channelName: string
  title: string
  slug: string
  preview: string
  authorId?: string
  isLocked: boolean
  isPinned: boolean
  viewCount: number
  replyCount: number
  participantCount: number
  participantAvatars?: string[]
  lastReplyAt?: Date
  timeAgo: string
  tags?: string[]
}

export interface Reply extends Auditable {
  postId: string
  parentReplyId?: string
  authorId?: string
  author?: Pick<AuthUser, 'id' | 'displayName' | 'handle' | 'avatarUrl'>
  content: string
  isAnonymous: boolean
  anonymousHandle?: string
  likeCount: number
  hasLiked?: boolean
  timeAgo: string
  replies?: Reply[]
}

export interface CreateThreadInput {
  channelId: string
  title: string
  content: string
  tags?: string[]
  isAnonymous?: boolean
}

export interface CreatePostInput {
  channelId: string
  threadId?: string
  content: string
  isAnonymous: boolean
  tags?: string[]
  attachments?: Array<{ type: PostAttachment['type']; url: string }>
}

export interface PinActionInput {
  postId: string
  channelId: string
  position?: number
}

export interface SearchFilters {
  channelIds?: string[]
  authorIds?: string[]
  dateFrom?: Date
  dateTo?: Date
  sortBy?: 'relevance' | 'recent' | 'top'
  types?: ('post' | 'thread' | 'member')[]
  includeAnonymous?: boolean
}

export interface SearchResults {
  posts: Paginated<Post>['items']
  threads: Paginated<Thread>['items']
  members: Array<{ id: string; displayName: string; avatarUrl?: string; handle: string }>
  totalHits: number
}
