import type {
  Channel,
  Thread,
  Post,
  Reply,
  SearchFilters,
  SearchResults,
  CreatePostInput,
  CreateThreadInput,
  PinActionInput,
} from '@/types/community'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export interface ConversationServiceInterface {
  listChannels(auth: AuthContext, params?: PaginationParams): Promise<Paginated<Channel>>
  getChannel(auth: AuthContext, channelId: string): Promise<Channel>
  listThreads(auth: AuthContext, channelId: string, params?: PaginationParams): Promise<Paginated<Thread>>
  getThread(auth: AuthContext, threadId: string): Promise<Thread & { posts: Post[] }>
  createThread(auth: AuthContext, input: CreateThreadInput): Promise<Thread>
  createPost(auth: AuthContext, input: CreatePostInput): Promise<Post>
  createReply(auth: AuthContext, postId: string, content: string, parentReplyId?: string): Promise<Reply>
  likePost(auth: AuthContext, postId: string): Promise<{ liked: boolean; count: number }>
  likeReply(auth: AuthContext, replyId: string): Promise<{ liked: boolean; count: number }>
  pinPost(auth: AuthContext, input: PinActionInput): Promise<Post>
  unpinPost(auth: AuthContext, postId: string): Promise<Post>
  search(auth: AuthContext, query: string, filters?: SearchFilters): Promise<SearchResults>
}

export const ConversationService: ConversationServiceInterface = {
  async listChannels(_auth, _params) {
    throw new Error('ConversationService.listChannels not implemented')
  },
  async getChannel(_auth, _channelId) {
    throw new Error('ConversationService.getChannel not implemented')
  },
  async listThreads(_auth, _channelId, _params) {
    throw new Error('ConversationService.listThreads not implemented')
  },
  async getThread(_auth, _threadId) {
    throw new Error('ConversationService.getThread not implemented')
  },
  async createThread(_auth, _input) {
    throw new Error('ConversationService.createThread not implemented')
  },
  async createPost(_auth, _input) {
    throw new Error('ConversationService.createPost not implemented')
  },
  async createReply(_auth, _postId, _content, _parentReplyId) {
    throw new Error('ConversationService.createReply not implemented')
  },
  async likePost(_auth, _postId) {
    throw new Error('ConversationService.likePost not implemented')
  },
  async likeReply(_auth, _replyId) {
    throw new Error('ConversationService.likeReply not implemented')
  },
  async pinPost(_auth, _input) {
    throw new Error('ConversationService.pinPost not implemented')
  },
  async unpinPost(_auth, _postId) {
    throw new Error('ConversationService.unpinPost not implemented')
  },
  async search(_auth, _query, _filters) {
    throw new Error('ConversationService.search not implemented')
  },
}
