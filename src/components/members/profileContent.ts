import type { Post } from '@/types/community'
import type { MemberProfile } from '@/types/members'

const now = new Date('2026-08-15T09:00:00Z')

function makePost(member: MemberProfile, overrides: Partial<Post> & Pick<Post, 'id' | 'content'>): Post {
  return {
    channelId: 'wealth-building',
    channelName: 'Wealth Building',
    author: { id: member.id, displayName: member.displayName, handle: member.handle, avatarUrl: member.avatarUrl },
    isAnonymous: false,
    isPinned: false,
    likeCount: 112,
    replyCount: 26,
    repostCount: 4,
    timeAgo: '33m',
    moderationStatus: 'approved',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function getProfilePosts(member: MemberProfile): Post[] {
  return [
    makePost(member, {
      id: `${member.id}-post-1`,
      content: "Let's talk about the incredible power of perseverance and how it can change your life 🚀",
      tags: ['Finance'],
    }),
    makePost(member, {
      id: `${member.id}-post-2`,
      content: "Let's talk about the incredible power of perseverance and how it can change your life.",
      attachments: [
        { id: `${member.id}-post-2-att`, type: 'image', url: `https://picsum.photos/seed/${member.id}-post/600/400` },
      ],
    }),
  ]
}

export function getProfileReplies(member: MemberProfile): Post[] {
  return [
    makePost(member, {
      id: `${member.id}-reply-1`,
      content: 'This resonates so much — perseverance really does compound over time.',
      channelName: 'Wealth Building',
      likeCount: 34,
      replyCount: 6,
      repostCount: 1,
      timeAgo: '20m',
    }),
    makePost(member, {
      id: `${member.id}-reply-2`,
      content: "Exactly why I started tracking my spending this year. Small changes, big difference.",
      channelName: 'Wealth Building',
      likeCount: 18,
      replyCount: 2,
      repostCount: 0,
      timeAgo: '1h',
    }),
  ]
}

export function getProfileReposts(member: MemberProfile): Post[] {
  return [
    makePost(member, {
      id: `${member.id}-repost-1`,
      content: "Let's talk about the incredible power of perseverance and how it can change your life 🚀",
      tags: ['Finance'],
      author: { id: 'u1', displayName: 'Aisha Aminu', handle: '@aishaa' },
    }),
  ]
}

export function getProfileMedia(member: MemberProfile) {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${member.id}-media-${i}`,
    url: `https://picsum.photos/seed/${member.id}-media-${i}/300/300`,
    isVideo: i % 3 === 1,
  }))
}
