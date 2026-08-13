import type { FaithPost, FaithSchedule, FaithRitualSettings } from '@/types/faith'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export interface FaithRitualServiceInterface {
  listPosts(auth: AuthContext, params?: PaginationParams): Promise<Paginated<FaithPost>>
  getTodaysPost(auth: AuthContext): Promise<FaithPost | null>
  getSchedule(auth: AuthContext): Promise<FaithSchedule>
  getSettings(auth: AuthContext): Promise<FaithRitualSettings>
  updateSettings(auth: AuthContext, patch: Partial<FaithRitualSettings>): Promise<FaithRitualSettings>
  markPostRead(auth: AuthContext, postId: string): Promise<void>
  getStreak(auth: AuthContext): Promise<{ current: number; longest: number; lastReadAt?: Date }>
  triggerNotificationDispatch(scheduledFor: Date): Promise<{ dispatched: number; errors: number }>
}

export const FaithRitualService: FaithRitualServiceInterface = {
  async listPosts(_auth, _params) {
    throw new Error('FaithRitualService.listPosts not implemented')
  },
  async getTodaysPost(_auth) {
    throw new Error('FaithRitualService.getTodaysPost not implemented')
  },
  async getSchedule(_auth) {
    throw new Error('FaithRitualService.getSchedule not implemented')
  },
  async getSettings(_auth) {
    throw new Error('FaithRitualService.getSettings not implemented')
  },
  async updateSettings(_auth, _patch) {
    throw new Error('FaithRitualService.updateSettings not implemented')
  },
  async markPostRead(_auth, _postId) {
    throw new Error('FaithRitualService.markPostRead not implemented')
  },
  async getStreak(_auth) {
    throw new Error('FaithRitualService.getStreak not implemented')
  },
  async triggerNotificationDispatch(_scheduledFor) {
    throw new Error('FaithRitualService.triggerNotificationDispatch not implemented')
  },
}
