import type { Course, Lesson, LiveSession, Replay, CourseProgress } from '@/types/learning'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export interface LearningServiceInterface {
  listCourses(auth: AuthContext, params?: PaginationParams): Promise<Paginated<Course>>
  getCourse(auth: AuthContext, courseId: string): Promise<Course & { lessons: Lesson[] }>
  getProgress(auth: AuthContext, courseId: string): Promise<CourseProgress>
  markLessonComplete(auth: AuthContext, lessonId: string): Promise<CourseProgress>
  listLiveSessions(auth: AuthContext): Promise<LiveSession[]>
  getLiveSession(auth: AuthContext, sessionId: string): Promise<LiveSession>
  joinLiveSession(auth: AuthContext, sessionId: string): Promise<{ roomToken: string; url: string }>
  listReplays(auth: AuthContext, params?: PaginationParams): Promise<Paginated<Replay>>
  getReplay(auth: AuthContext, replayId: string): Promise<Replay & { playbackUrl: string }>
  setLiveReminder(auth: AuthContext, sessionId: string, minutesBefore?: number): Promise<{ reminderId: string }>
}

export const LearningService: LearningServiceInterface = {
  async listCourses(_auth, _params) {
    throw new Error('LearningService.listCourses not implemented')
  },
  async getCourse(_auth, _courseId) {
    throw new Error('LearningService.getCourse not implemented')
  },
  async getProgress(_auth, _courseId) {
    throw new Error('LearningService.getProgress not implemented')
  },
  async markLessonComplete(_auth, _lessonId) {
    throw new Error('LearningService.markLessonComplete not implemented')
  },
  async listLiveSessions(_auth) {
    throw new Error('LearningService.listLiveSessions not implemented')
  },
  async getLiveSession(_auth, _sessionId) {
    throw new Error('LearningService.getLiveSession not implemented')
  },
  async joinLiveSession(_auth, _sessionId) {
    throw new Error('LearningService.joinLiveSession not implemented — session must run in-platform (FR-G03, no redirects)')
  },
  async listReplays(_auth, _params) {
    throw new Error('LearningService.listReplays not implemented')
  },
  async getReplay(_auth, _replayId) {
    throw new Error('LearningService.getReplay not implemented')
  },
  async setLiveReminder(_auth, _sessionId, _minutesBefore) {
    throw new Error('LearningService.setLiveReminder not implemented')
  },
}
