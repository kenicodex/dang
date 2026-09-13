import type { ApiClientInterface } from './client'
import { apiClient } from './client'
import type {
  Channel,
  Thread,
  Post,
  SearchResults,
  SearchFilters,
  CreatePostInput,
  CreateThreadInput,
} from '@/types/community'
import type { Paginated, PaginationParams } from '@/types/common'
import type { SubscriptionTier, Subscription, Invoice } from '@/types/subscriptions'
import type { Circle, CircleMember } from '@/types/circles'
import type { Course, LiveSession } from '@/types/learning'
import type { Event } from '@/types/events'
import type {
  AppleOAuthRequest,
  AuthSessionInfo,
  AuthTokenResponse,
  ChangePasswordInput,
  EmailChangeConfirmInput,
  EmailChangeRequestInput,
  EmailVerifyInput,
  EmailVerifyResponse,
  GoogleOAuthRequest,
  LoginRequest,
  LogoutRequest,
  OtpSendRequest,
  OtpVerifyRequest,
  PasswordResetInput,
  PasswordResetRequestInput,
  PasswordResetRequestResponse,
  PasswordResetResponse,
  PhoneChangeSendOtpInput,
  PhoneChangeVerifyInput,
  RefreshTokenRequest,
  RegisterRequest,
} from '@/types/auth'

export interface ApiEndpoints {
  auth: {
    register: (input: RegisterRequest) => Promise<AuthTokenResponse>
    login: (input: LoginRequest) => Promise<AuthTokenResponse>
    loginWithGoogle: (input: GoogleOAuthRequest) => Promise<AuthTokenResponse>
    loginWithApple: (input: AppleOAuthRequest) => Promise<AuthTokenResponse>
    refreshToken: (input: RefreshTokenRequest) => Promise<AuthTokenResponse>
    sendOtp: (input: OtpSendRequest) => Promise<void>
    verifyOtp: (input: OtpVerifyRequest) => Promise<AuthTokenResponse>
    logout: (input: LogoutRequest) => Promise<void>
    requestPasswordReset: (input: PasswordResetRequestInput) => Promise<PasswordResetRequestResponse>
    resetPassword: (input: PasswordResetInput) => Promise<PasswordResetResponse>
    changePassword: (input: ChangePasswordInput) => Promise<void>
    verifyEmail: (input: EmailVerifyInput) => Promise<EmailVerifyResponse>
    requestEmailChange: (input: EmailChangeRequestInput) => Promise<void>
    confirmEmailChange: (input: EmailChangeConfirmInput) => Promise<void>
    requestPhoneChange: (input: PhoneChangeSendOtpInput) => Promise<void>
    confirmPhoneChange: (input: PhoneChangeVerifyInput) => Promise<void>
    listSessions: () => Promise<AuthSessionInfo[]>
    revokeSession: (id: string) => Promise<void>
    revokeOtherSessions: () => Promise<void>
  }
  community: {
    listChannels: (params?: PaginationParams) => Promise<Paginated<Channel>>
    listThreads: (channelId: string, params?: PaginationParams) => Promise<Paginated<Thread>>
    getThread: (threadId: string) => Promise<Thread & { posts: Post[] }>
    createThread: (input: CreateThreadInput) => Promise<Thread>
    createPost: (input: CreatePostInput) => Promise<Post>
    search: (query: string, filters?: SearchFilters) => Promise<SearchResults>
  }
  subscriptions: {
    listTiers: () => Promise<SubscriptionTier[]>
    getSubscription: () => Promise<Subscription | null>
    listInvoices: (params?: PaginationParams) => Promise<Paginated<Invoice>>
  }
  circles: {
    listCircles: (params?: PaginationParams) => Promise<Paginated<Circle>>
    listMembers: (circleId: string) => Promise<CircleMember[]>
  }
  learning: {
    listCourses: (params?: PaginationParams) => Promise<Paginated<Course>>
    listLiveSessions: () => Promise<LiveSession[]>
  }
  events: {
    listEvents: (params?: PaginationParams & { past?: boolean }) => Promise<Paginated<Event>>
  }
}

export function createEndpoints(client: ApiClientInterface = apiClient): ApiEndpoints {
  return {
    auth: {
      register: input => client.post('/auth/register', input, { auth: false }),
      login: input => client.post('/auth/login', input, { auth: false }),
      loginWithGoogle: input => client.post('/auth/oauth/google', input, { auth: false }),
      loginWithApple: input => client.post('/auth/oauth/apple', input, { auth: false }),
      refreshToken: input => client.post('/auth/token/refresh', input, { auth: false }),
      sendOtp: input => client.post('/auth/otp/send', input, { auth: false }),
      verifyOtp: input => client.post('/auth/otp/verify', input, { auth: false }),
      logout: input => client.post('/auth/logout', input),
      requestPasswordReset: input => client.post('/auth/password/reset-request', input, { auth: false }),
      resetPassword: input => client.post('/auth/password/reset', input, { auth: false }),
      changePassword: input => client.patch('/auth/password', input),
      verifyEmail: input => client.post('/auth/email/verify', input, { auth: false }),
      requestEmailChange: input => client.post('/auth/email/change', input),
      confirmEmailChange: input => client.post('/auth/email/confirm-change', input, { auth: false }),
      requestPhoneChange: input => client.post('/auth/phone/change/send-otp', input),
      confirmPhoneChange: input => client.post('/auth/phone/change/verify-otp', input),
      listSessions: () => client.get('/auth/sessions'),
      revokeSession: id => client.delete(`/auth/sessions/${id}`),
      revokeOtherSessions: () => client.post('/auth/sessions/revoke-others'),
    },
    community: {
      listChannels: params => client.get('/channels', params as any),
      listThreads: (channelId, params) =>
        client.get(`/channels/${channelId}/threads`, params as any),
      getThread: threadId => client.get(`/threads/${threadId}`),
      createThread: input => client.post('/threads', input),
      createPost: input => client.post('/posts', input),
      search: (query, filters) =>
        client.get('/search', { q: query, ...(filters as any) }),
    },
    subscriptions: {
      listTiers: () => client.get('/tiers'),
      getSubscription: () => client.get('/subscription'),
      listInvoices: params => client.get('/invoices', params as any),
    },
    circles: {
      listCircles: params => client.get('/circles', params as any),
      listMembers: circleId => client.get(`/circles/${circleId}/members`),
    },
    learning: {
      listCourses: params => client.get('/courses', params as any),
      listLiveSessions: () => client.get('/live-sessions'),
    },
    events: {
      listEvents: params => client.get('/events', params as any),
    },
  }
}

export const api: ApiEndpoints = createEndpoints()
