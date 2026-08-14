import type { Circle } from '@/types/circles'
import type { Post, Reply } from '@/types/community'
import { SPACE_POSTS } from './spaces.data'

const now = new Date('2026-08-12T09:00:00Z')

export const MOCK_COMMUNITIES: Circle[] = [
  {
    id: 'circle-wealth',
    name: 'Wealth Building',
    slug: 'wealth-building',
    emoji: '💰',
    category: 'Business',
    memberCount: 3900,
    isPrivate: false,
    requiresApproval: false,
    isLeader: false,
    lastActivityAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'circle-entrepreneurship',
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    emoji: '🚀',
    category: 'Business',
    memberCount: 3900,
    isPrivate: false,
    requiresApproval: false,
    isLeader: false,
    lastActivityAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'circle-career',
    name: 'Career Growth',
    slug: 'career-growth',
    emoji: '📈',
    category: 'Career',
    memberCount: 2100,
    isPrivate: false,
    requiresApproval: false,
    isLeader: false,
    lastActivityAt: now,
    createdAt: now,
    updatedAt: now,
  },
]

export const FOR_YOU_POSTS: Post[] = [
  {
    id: 'post-1',
    channelId: 'circle-wealth',
    channelName: 'Wealth Building',
    author: { id: 'u-brian', displayName: 'Brian Lee', handle: '@brianlee' },
    content: 'Exploring the latest trends in sustainable investing. How green is your portfolio? 🌱',
    isAnonymous: false,
    isPinned: false,
    likeCount: 98,
    replyCount: 14,
    repostCount: 3,
    timeAgo: '1h',
    tags: ['Invest'],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'post-2',
    channelId: 'circle-wealth',
    channelName: 'Wealth Building',
    isAnonymous: true,
    anonymousHandle: 'Anonymous Sister',
    content: 'Breaking down the myths about cryptocurrency and what you really need to know before diving in.',
    isPinned: false,
    likeCount: 157,
    replyCount: 39,
    repostCount: 8,
    timeAgo: '33m',
    tags: ['Crypto'],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'post-3',
    channelId: 'circle-wealth',
    channelName: 'Wealth Building',
    author: { id: 'u-brian', displayName: 'Brian Lee', handle: '@brianlee' },
    content: "Here's a quick recap from today's investing workshop 📊",
    isAnonymous: false,
    isPinned: false,
    likeCount: 42,
    replyCount: 6,
    repostCount: 1,
    timeAgo: '1h',
    tags: ['Invest'],
    attachments: [{ id: 'att-1', type: 'image', url: '' }],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
]

export const MY_POSTS: Post[] = [
  {
    id: 'my-post-1',
    channelId: 'circle-wealth',
    channelName: 'Wealth Building',
    author: { id: 'u-amy', displayName: 'Amy Lee', handle: '@amylee' },
    content: 'Exploring the latest trends in sustainable investing. How green is your portfolio? 🌱',
    isAnonymous: false,
    isPinned: false,
    likeCount: 98,
    replyCount: 14,
    repostCount: 3,
    timeAgo: '1h',
    tags: ['Invest'],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'my-post-2',
    channelId: 'circle-wealth',
    channelName: 'Wealth Building',
    isAnonymous: true,
    anonymousHandle: 'Anonymous',
    content: 'Breaking down the myths about cryptocurrency and what you really need to know before diving in.',
    isPinned: false,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    timeAgo: '33m',
    tags: ['Crypto'],
    moderationStatus: 'pending',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'my-post-3',
    channelId: 'circle-entrepreneurship',
    channelName: 'Entrepreneurship',
    isAnonymous: true,
    anonymousHandle: 'Anonymous',
    content: '5 side hustles that actually pay in 2026 💼',
    isPinned: false,
    likeCount: 157,
    replyCount: 39,
    repostCount: 12,
    timeAgo: '2h',
    tags: ['SideHustle'],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'my-post-4',
    channelId: 'circle-wealth',
    channelName: 'Wealth Building',
    isAnonymous: true,
    anonymousHandle: 'Anonymous',
    content: 'Breaking down the myths about cryptocurrency and what you really need to know before diving in.',
    isPinned: false,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    timeAgo: '33m',
    tags: ['Crypto'],
    moderationStatus: 'rejected',
    rejectionReason:
      "This post included content that isn't allowed in this space. Our admins review every post to keep things safe and on-topic.",
    createdAt: now,
    updatedAt: now,
  },
]

export function findPostById(id?: string): Post | undefined {
  if (!id) return undefined
  return (
    FOR_YOU_POSTS.find(p => p.id === id) ??
    MY_POSTS.find(p => p.id === id) ??
    Object.values(SPACE_POSTS)
      .flat()
      .find(p => p.id === id)
  )
}

function makeReply(reply: Omit<Reply, 'isAnonymous' | 'likeCount' | 'createdAt' | 'updatedAt'> & Partial<Reply>): Reply {
  return {
    isAnonymous: false,
    likeCount: 0,
    createdAt: now,
    updatedAt: now,
    ...reply,
  }
}

export const POST_REPLIES: Record<string, Reply[]> = {
  'wb-post-2': [
    makeReply({
      id: 'reply-1',
      postId: 'wb-post-2',
      author: { id: 'u5', displayName: 'Nkechi Okonkwo', handle: '@Nkech_!' },
      content: "This is such a good reminder — I switched my portfolio to ESG funds last year and haven't looked back.",
      likeCount: 24,
      hasLiked: true,
      timeAgo: '45m',
      replies: [
        makeReply({
          id: 'reply-1-1',
          postId: 'wb-post-2',
          author: { id: 'u1', displayName: 'Aisha Aminu', handle: '@aishaa' },
          content: 'Same here! Perseverance and patience made all the difference for my returns.',
          likeCount: 6,
          hasLiked: true,
          timeAgo: '33m',
        }),
      ],
    }),
    makeReply({
      id: 'reply-2',
      postId: 'wb-post-2',
      isAnonymous: true,
      anonymousHandle: 'Anonymous Sister',
      content: 'Honestly still learning the basics — any beginner-friendly resources on green investing?',
      likeCount: 9,
      timeAgo: '20m',
    }),
  ],
}

export function getRepliesForPost(postId: string): Reply[] {
  return POST_REPLIES[postId] ?? []
}
