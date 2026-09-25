import { timeAgo } from '@/lib/time'
import type { Post as ApiPost, PostModerationStatus as ApiPostModerationStatus } from '@/api/services/posts.service'
import type { Post as LegacyPost, PostAttachment, PostModerationStatus, Reply } from '@/types/community'

const STATUS_MAP: Record<ApiPostModerationStatus, PostModerationStatus> = {
  PENDING: 'pending',
  PUBLISHED: 'approved',
  REJECTED: 'rejected',
}

const ATTACHMENT_TYPE: Partial<Record<ApiPost['contentType'], PostAttachment['type']>> = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  LINK: 'link',
}

function attachmentsFor(post: ApiPost): PostAttachment[] | undefined {
  if (!post.mediaUrl) return undefined
  const type = ATTACHMENT_TYPE[post.contentType]
  if (!type) return undefined
  return [{ id: post.id, type, url: post.mediaUrl }]
}

/**
 * The live `/posts` API never confirmed a response schema for author info or
 * engagement counts (likes/replies/reposts), so those render as absent/zero here
 * until the real contract is known — this only adapts the fields we do have.
 */
export function toLegacyPost(post: ApiPost, likedIds?: Set<string>): LegacyPost {
  return {
    id: post.id,
    channelId: post.spaceId,
    threadId: post.parentId,
    authorId: post.authorId,
    content: post.body,
    isAnonymous: post.isAnonymous,
    isPinned: false,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    hasLiked: likedIds?.has(post.id) ?? false,
    hasBookmarked: false,
    timeAgo: timeAgo(post.createdAt),
    attachments: attachmentsFor(post),
    moderationStatus: STATUS_MAP[post.moderationStatus] ?? 'pending',
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  }
}

/** Builds a nested reply tree from the flat `parentId`-linked list `GET /posts/{id}/thread` returns. */
export function buildReplyTree(rootId: string, posts: ApiPost[], likedIds?: Set<string>): Reply[] {
  const byParent = new Map<string, ApiPost[]>()
  posts.forEach(post => {
    const parent = post.parentId ?? rootId
    const list = byParent.get(parent) ?? []
    list.push(post)
    byParent.set(parent, list)
  })

  function build(parentId: string): Reply[] {
    return (byParent.get(parentId) ?? []).map(post => ({
      id: post.id,
      postId: rootId,
      parentReplyId: post.parentId && post.parentId !== rootId ? post.parentId : undefined,
      content: post.body,
      isAnonymous: post.isAnonymous,
      likeCount: 0,
      hasLiked: likedIds?.has(post.id) ?? false,
      timeAgo: timeAgo(post.createdAt),
      replies: build(post.id),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }))
  }

  return build(rootId)
}
