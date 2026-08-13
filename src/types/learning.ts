import type { Auditable, Paginated } from './common'
import type { SubscriptionTier } from './subscriptions'

export type LessonType = 'video' | 'audio' | 'reading' | 'quiz' | 'live' | 'worksheet'

export interface Course extends Auditable {
  title: string
  slug: string
  emoji?: string
  coverUrl?: string
  description: string
  instructor: string
  instructorBio?: string
  lessonCount: number
  duration: string
  tierId?: string
  tier?: SubscriptionTier
  progress?: number
  tags?: string[]
  isLive?: boolean
  category: 'faith' | 'wellness' | 'career' | 'relationships' | 'business' | 'lifestyle'
  publishedAt?: Date
}

export type LessonStatus = 'locked' | 'available' | 'current' | 'in_progress' | 'completed'

export interface Lesson extends Auditable {
  id: string
  courseId: string
  title: string
  description?: string
  duration: string
  type: LessonType
  order: number
  status: LessonStatus
  videoUrl?: string
  audioUrl?: string
  readingContent?: string
  resources?: Array<{ label: string; url: string }>
}

export interface CourseProgress {
  courseId: string
  percentComplete: number
  lessonsCompleted: number
  lessonsTotal: number
  lastCompletedLessonId?: string
  lastVisitedAt?: Date
  startedAt?: Date
  completedAt?: Date
}

export interface LiveSession extends Auditable {
  title: string
  description?: string
  host: string
  hostAvatarUrl?: string
  date: string
  startTime: string
  endTime: string
  timezone: string
  location?: string
  isVirtual: boolean
  roomUrl?: string
  participantCount: number
  capacity?: number
  isLive: boolean
  tierId?: string
  category: Course['category']
  replayId?: string
  reminderSet?: boolean
}

export interface Replay extends Auditable {
  title: string
  sessionId?: string
  sessionDate: string
  host: string
  duration: string
  playbackUrl: string
  thumbnailUrl?: string
  category: Course['category']
  transcriptUrl?: string
  viewCount: number
  tierId?: string
}
