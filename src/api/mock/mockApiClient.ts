import type { ApiClientInterface, RequestMethod, RequestOptions } from '@/api/client'
import type { Space, SpaceMember } from '@/api/services/spaces.service'
import type { Post as ApiPost, PostModerationStatus, PostThread } from '@/api/services/posts.service'
import { MOCK_PROFILE, PROFILE_POSTS, PROFILE_REPOSTS } from '@/components/account/profile.data'
import { FOR_YOU_POSTS, MY_POSTS, POST_REPLIES } from '@/components/community/mockData'
import { SPACES, SPACE_POSTS } from '@/components/community/spaces.data'
import type { AuthApiUser, AuthTokenResponse } from '@/types/auth'
import type { Channel, Post as LegacyPost, Reply } from '@/types/community'

const LATENCY_MS = 250
const now = () => new Date()

// ---------------------------------------------------------------------------
// Mock session user — mirrors MOCK_PROFILE so the whole app reads as one person.
// ---------------------------------------------------------------------------

let mockUser: AuthApiUser = {
  id: MOCK_PROFILE.id,
  email: MOCK_PROFILE.email,
  role: 'MEMBER',
  membershipTier: 'GROWTH',
  isEmailVerified: true,
  twoFactorEnabled: false,
  createdAt: MOCK_PROFILE.createdAt.toISOString(),
  profile: {
    displayName: MOCK_PROFILE.displayName,
    handle: MOCK_PROFILE.handle.replace(/^@/, ''),
    avatarUrl: MOCK_PROFILE.avatarUrl,
    coverImageUrl: MOCK_PROFILE.coverImageUrl,
    websiteUrl: MOCK_PROFILE.website,
    bio: MOCK_PROFILE.bio,
    city: 'Lagos',
    country: 'Nigeria',
    interests: MOCK_PROFILE.interests,
    faithTradition: 'CHRISTIAN',
  },
}

const tokenResponse = (): AuthTokenResponse => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser,
})

// ---------------------------------------------------------------------------
// Adapters from the legacy mock shapes to the live API shapes.
// ---------------------------------------------------------------------------

const STATUS_TO_API: Record<LegacyPost['moderationStatus'], PostModerationStatus> = {
  pending: 'PENDING',
  approved: 'PUBLISHED',
  rejected: 'REJECTED',
}

function toApiPost(post: LegacyPost): ApiPost {
  const attachment = post.attachments?.[0]
  const contentType =
    attachment?.type === 'image' ? 'IMAGE' : attachment?.type === 'video' ? 'VIDEO' : attachment?.type === 'audio' ? 'AUDIO' : 'TEXT'
  return {
    id: post.id,
    spaceId: post.channelId,
    parentId: post.threadId,
    authorId: post.author?.id ?? post.authorId,
    contentType,
    body: post.content,
    mediaUrl: attachment?.url || undefined,
    isAnonymous: post.isAnonymous,
    isGated: false,
    moderationStatus: STATUS_TO_API[post.moderationStatus],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

function replyToApiPost(reply: Reply, spaceId: string, parentId: string): ApiPost {
  return {
    id: reply.id,
    spaceId,
    parentId,
    authorId: reply.author?.id ?? reply.authorId,
    contentType: 'TEXT',
    body: reply.content,
    isAnonymous: reply.isAnonymous,
    isGated: false,
    moderationStatus: 'PUBLISHED',
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
  }
}

function flattenReplies(replies: Reply[], spaceId: string, parentId: string): ApiPost[] {
  return replies.flatMap(reply => [
    replyToApiPost(reply, spaceId, parentId),
    ...flattenReplies(reply.replies ?? [], spaceId, reply.id),
  ])
}

function toSpace(channel: Channel): Space {
  const { guidelines, ...rest } = channel
  return { ...rest, type: 'CHANNEL', guidelines: guidelines?.join('. ') }
}

function toSpaceMember(
  spaceId: string,
  member: NonNullable<Channel['members']>[number],
  role: SpaceMember['role'],
): SpaceMember {
  return {
    id: `${spaceId}-${member.id}`,
    spaceId,
    memberId: member.id,
    role,
    profile: { id: member.id, displayName: member.displayName, handle: member.handle.replace(/^@/, '') },
    joinedAt: now().toISOString(),
    createdAt: now(),
    updatedAt: now(),
  }
}

const paginate = <T>(items: T[]) => ({ items, total: items.length, limit: items.length, offset: 0, hasMore: false })

// ---------------------------------------------------------------------------
// In-memory state that mutations update, so the UI reacts the way it would live.
// ---------------------------------------------------------------------------

const joinedSpaceIds = new Set<string>()
const createdPosts: ApiPost[] = []

const allLegacyPosts = (): LegacyPost[] => [
  ...FOR_YOU_POSTS,
  ...MY_POSTS,
  ...PROFILE_POSTS,
  ...PROFILE_REPOSTS,
  ...Object.values(SPACE_POSTS).flat(),
]

function findApiPost(id: string): ApiPost | undefined {
  return createdPosts.find(p => p.id === id) ?? allLegacyPosts().map(toApiPost).find(p => p.id === id)
}

function spaceMembers(spaceId: string): SpaceMember[] {
  const channel = SPACES.find(s => s.id === spaceId)
  const members: SpaceMember[] = []
  if (channel?.moderator) members.push(toSpaceMember(spaceId, channel.moderator, 'LEADER'))
  channel?.members?.forEach(m => members.push(toSpaceMember(spaceId, m, 'MEMBER')))
  if (joinedSpaceIds.has(spaceId)) {
    members.push(
      toSpaceMember(spaceId, { id: mockUser.id, displayName: mockUser.profile.displayName, handle: mockUser.profile.handle ?? '', initials: '' }, 'MEMBER'),
    )
  }
  return members
}

// ---------------------------------------------------------------------------
// Route table
// ---------------------------------------------------------------------------

type Query = Record<string, string | number | boolean | undefined>
type Handler = (ctx: { params: Record<string, string>; query: Query; body: any }) => unknown

interface Route {
  method: RequestMethod
  pattern: RegExp
  handler: Handler
}

const route = (method: RequestMethod, path: string, handler: Handler): Route => ({
  method,
  pattern: new RegExp(`^${path.replace(/:([a-zA-Z]+)/g, '(?<$1>[^/]+)')}$`),
  handler,
})

const routes: Route[] = [
  // auth
  route('POST', '/auth/register', tokenResponse),
  route('POST', '/auth/login', tokenResponse),
  route('POST', '/auth/oauth/google', tokenResponse),
  route('POST', '/auth/oauth/apple', tokenResponse),
  route('POST', '/auth/token/refresh', tokenResponse),
  route('POST', '/auth/otp/send', () => undefined),
  route('POST', '/auth/otp/verify', tokenResponse),
  route('POST', '/auth/logout', () => undefined),
  route('POST', '/auth/password/reset-request', () => ({ sent: true })),
  route('POST', '/auth/password/reset', () => ({ success: true })),
  route('PATCH', '/auth/password', () => undefined),
  route('POST', '/auth/email/verify', () => ({ verified: true })),
  route('POST', '/auth/email/verify/resend', () => ({ sent: true, alreadyVerified: false, expiresInSeconds: 600 })),
  route('GET', '/auth/sessions', () => [
    { id: 'session-current', deviceName: 'This iPhone', isCurrent: true, lastActiveAt: now().toISOString() },
  ]),
  route('POST', '/auth/sessions/revoke-others', () => undefined),
  route('DELETE', '/auth/sessions/:id', () => undefined),

  // users
  route('GET', '/users/me', () => mockUser),
  route('PATCH', '/users/me/profile', ({ body }) => {
    mockUser = { ...mockUser, profile: { ...mockUser.profile, ...body } }
    return mockUser
  }),
  route('DELETE', '/users/me', () => undefined),
  route('GET', '/users/handle/availability', () => ({ available: true })),
  route('GET', '/users/me/onboarding', () => ({ onboardingStep: 'COMPLETE', onboardingCompletedAt: now().toISOString() })),
  route('POST', '/users/me/onboarding/advance', () => ({ onboardingStep: 'COMPLETE' })),
  route('GET', '/users/me/blocked', () => []),
  route('GET', '/users/me/export', () => ({})),
  route('GET', '/users/directory', () => paginate([])),
  route('GET', '/users/recommendations', () => []),
  route('GET', '/users/search', () => []),
  route('GET', '/users/recent-searches', () => []),
  route('GET', '/users/connections', () => []),
  route('GET', '/users/:id/followers', () => []),
  route('GET', '/users/:id/following', () => []),
  route('GET', '/users/:id/groups-in-common', () => []),

  // spaces
  route('GET', '/spaces', ({ query }) => {
    const spaces = SPACES.map(toSpace)
    return paginate(query.category ? spaces.filter(s => s.category === query.category) : spaces)
  }),
  route('GET', '/spaces/:id', ({ params }) => {
    const channel = SPACES.find(s => s.id === params.id)
    return channel ? toSpace(channel) : null
  }),
  route('GET', '/spaces/:id/members', ({ params }) => spaceMembers(params.id)),
  route('GET', '/spaces/:id/applications', () => []),
  route('POST', '/spaces/:id/join', ({ params }) => {
    joinedSpaceIds.add(params.id)
  }),
  route('DELETE', '/spaces/:id/members/me', ({ params }) => {
    joinedSpaceIds.delete(params.id)
  }),

  // posts
  route('GET', '/posts/feed', () => ({ items: FOR_YOU_POSTS.map(toApiPost), hasMore: false })),
  route('GET', '/posts/mine', ({ query }) => {
    const mine = [...createdPosts, ...MY_POSTS.map(toApiPost)]
    return query.status ? mine.filter(p => p.moderationStatus === query.status) : mine
  }),
  route('GET', '/posts/search', ({ query }) => {
    const q = String(query.q ?? '').toLowerCase()
    return allLegacyPosts()
      .map(toApiPost)
      .filter(p => p.body.toLowerCase().includes(q))
  }),
  route('GET', '/posts/space/:spaceId', ({ params }) => ({
    items: [
      ...createdPosts.filter(p => p.spaceId === params.spaceId),
      ...(SPACE_POSTS[params.spaceId] ?? []).map(toApiPost),
    ],
    hasMore: false,
  })),
  route('GET', '/posts/user/:userId/reposts', () => PROFILE_REPOSTS.map(toApiPost)),
  route('GET', '/posts/user/:userId', ({ query }) => ({
    items: PROFILE_POSTS.map(toApiPost).filter(p => (query.tab === 'media' ? !!p.mediaUrl : true)),
    hasMore: false,
  })),
  route('GET', '/posts/:id/thread', ({ params }): PostThread | null => {
    const post = findApiPost(params.id)
    if (!post) return null
    const replies = [
      ...flattenReplies(POST_REPLIES[params.id] ?? [], post.spaceId, post.id),
      ...createdPosts.filter(p => p.parentId === post.id),
    ]
    return { post, replies }
  }),
  route('POST', '/posts', ({ body }) => {
    const post: ApiPost = {
      id: `mock-post-${Date.now()}`,
      spaceId: body.spaceId,
      parentId: body.parentId,
      authorId: mockUser.id,
      contentType: body.contentType ?? 'TEXT',
      body: body.body,
      mediaUrl: body.mediaUrl,
      isAnonymous: !!body.isAnonymous,
      isGated: !!body.isGated,
      moderationStatus: 'PUBLISHED',
      createdAt: now(),
      updatedAt: now(),
    }
    createdPosts.unshift(post)
    return post
  }),

  // misc domains
  route('GET', '/streaks/me', () => ({ current: 5, longest: 12, lastActiveAt: now().toISOString() })),
  route('GET', '/tiers', () => []),
  route('GET', '/subscription', () => null),
  route('GET', '/invoices', () => paginate([])),
  route('GET', '/circles', () => paginate([])),
  route('GET', '/courses', () => paginate([])),
  route('GET', '/live-sessions', () => []),
  route('GET', '/events', () => paginate([])),
]

function resolve(method: RequestMethod, rawPath: string, query: Query, body: unknown): unknown {
  const path = rawPath.split('?')[0].replace(/\/$/, '')
  for (const r of routes) {
    if (r.method !== method) continue
    const match = r.pattern.exec(path)
    if (match) return r.handler({ params: match.groups ?? {}, query, body })
  }
  // Unmatched writes are no-ops; unmatched reads come back empty so list screens still render.
  return method === 'GET' ? [] : undefined
}

export function createMockApiClient(): ApiClientInterface {
  async function request<T>(path: string, options: RequestOptions): Promise<T> {
    await new Promise(r => setTimeout(r, LATENCY_MS))
    return resolve(options.method, path, options.query ?? {}, options.body) as T
  }

  return {
    request,
    get: (path, query, opts) => request(path, { method: 'GET', query, ...opts }),
    post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
    put: (path, body, opts) => request(path, { method: 'PUT', body, ...opts }),
    patch: (path, body, opts) => request(path, { method: 'PATCH', body, ...opts }),
    delete: (path, opts) => request(path, { method: 'DELETE', ...opts }),
  }
}
