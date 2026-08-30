import type { AuthUser } from '@/types/auth'
import type { Post } from '@/types/community'

const now = new Date('2026-08-12T09:00:00Z')

export const PROFILE_INTERESTS = [
  'Tech',
  'Wellness',
  'Finance',
  'Networking',
  'Mindfulness',
  'Entrepreneurship',
  'Parenting',
  'Fitness',
  'Arts',
  'Travel',
]

export const MOCK_PROFILE: AuthUser = {
  id: 'u-amara',
  displayName: 'Amara Johnson',
  handle: '@amara.j',
  email: 'amara.j@email.com',
  avatarUrl: 'https://picsum.photos/seed/amara-avatar/240/240',
  coverImageUrl: 'https://picsum.photos/seed/amara-cover/800/1000',
  bio: 'Building in community | Tech Lead | Wellness advocate. Obsessed with storytelling, strategy, and sisterhood.',
  location: 'Lagos, NG',
  website: 'amarajohnson.co',
  interests: ['Tech', 'Wellness', 'Mindfulness'],
  followerCount: 236,
  followingCount: 504,
  role: 'member',
  isVerified: true,
  has2FA: false,
  createdAt: new Date('2026-07-01T00:00:00Z'),
}

export const PROFILE_POSTS: Post[] = [
  {
    id: 'profile-post-1',
    channelId: 'circle-career',
    channelName: 'Career Growth',
    author: { id: 'u-amara', displayName: 'Amara Johnson', handle: '@amara.j', avatarUrl: MOCK_PROFILE.avatarUrl },
    content: 'The journey of perseverance is filled with obstacles, but each step forward brings you closer to your dreams. Keep pushing! 💪',
    isAnonymous: false,
    isPinned: false,
    likeCount: 112,
    replyCount: 26,
    repostCount: 5,
    timeAgo: '33m',
    tags: ['Finance'],
    replierAvatars: [
      'https://picsum.photos/seed/profile-reply-1/80/80',
      'https://picsum.photos/seed/profile-reply-2/80/80',
    ],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'profile-post-2',
    channelId: 'circle-career',
    channelName: 'Career Growth',
    author: { id: 'u-amara', displayName: 'Amara Johnson', handle: '@amara.j', avatarUrl: MOCK_PROFILE.avatarUrl },
    content: 'Perseverance is the key that unlocks the door to opportunities you never thought possible.',
    isAnonymous: false,
    isPinned: false,
    likeCount: 112,
    replyCount: 26,
    repostCount: 5,
    timeAgo: '40m',
    tags: ['Finance'],
    replierAvatars: [
      'https://picsum.photos/seed/profile-reply-3/80/80',
      'https://picsum.photos/seed/profile-reply-4/80/80',
    ],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'profile-post-3',
    channelId: 'circle-career',
    channelName: 'Career Growth',
    author: { id: 'u-amara', displayName: 'Amara Johnson', handle: '@amara.j', avatarUrl: MOCK_PROFILE.avatarUrl },
    content: 'Harness the strength of perseverance; it’s the fuel that drives you to achieve greatness. Your future self will thank you! 🚀',
    isAnonymous: false,
    isPinned: false,
    likeCount: 98,
    replyCount: 19,
    repostCount: 4,
    timeAgo: '1h',
    tags: ['Finance'],
    attachments: [{ id: 'profile-post-3-att', type: 'image', url: 'https://picsum.photos/seed/profile-post-attachment/600/400' }],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
]

export const PROFILE_REPOSTS: Post[] = [
  {
    id: 'profile-repost-1',
    channelId: 'circle-career',
    channelName: 'Career Growth',
    author: { id: 'u-aisha', displayName: 'Aisha Aminu', handle: '@aishaa' },
    content: 'Explore the impact of resilience in opening doors and shaping your path.',
    isAnonymous: false,
    isPinned: false,
    likeCount: 112,
    replyCount: 26,
    repostCount: 5,
    timeAgo: '33m',
    tags: ['Finance'],
    replierAvatars: [
      'https://picsum.photos/seed/repost-reply-1/80/80',
      'https://picsum.photos/seed/repost-reply-2/80/80',
    ],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'profile-repost-2',
    channelId: 'circle-career',
    channelName: 'Career Growth',
    author: { id: 'u-aisha', displayName: 'Aisha Aminu', handle: '@aishaa' },
    content: 'Discover how staying determined can unlock new opportunities and transform your journey. ☀️',
    isAnonymous: false,
    isPinned: false,
    likeCount: 112,
    replyCount: 26,
    repostCount: 5,
    timeAgo: '30m',
    tags: ['Finance'],
    replierAvatars: [
      'https://picsum.photos/seed/repost-reply-3/80/80',
      'https://picsum.photos/seed/repost-reply-4/80/80',
    ],
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  },
]

export interface ProfileMediaItem {
  id: string
  url: string
  type: 'image' | 'video'
}

export const PROFILE_MEDIA: ProfileMediaItem[] = [
  { id: 'media-1', url: 'https://picsum.photos/seed/profile-media-1/300/300', type: 'video' },
  { id: 'media-2', url: 'https://picsum.photos/seed/profile-media-2/300/300', type: 'image' },
  { id: 'media-3', url: 'https://picsum.photos/seed/profile-media-3/300/300', type: 'image' },
  { id: 'media-4', url: 'https://picsum.photos/seed/profile-media-4/300/300', type: 'image' },
  { id: 'media-5', url: 'https://picsum.photos/seed/profile-media-5/300/300', type: 'video' },
  { id: 'media-6', url: 'https://picsum.photos/seed/profile-media-6/300/300', type: 'image' },
  { id: 'media-7', url: 'https://picsum.photos/seed/profile-media-7/300/300', type: 'video' },
  { id: 'media-8', url: 'https://picsum.photos/seed/profile-media-8/300/300', type: 'image' },
  { id: 'media-9', url: 'https://picsum.photos/seed/profile-media-9/300/300', type: 'image' },
]
