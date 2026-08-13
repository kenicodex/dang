import type { Auditable } from './common'

export interface FaithPost extends Auditable {
  scheduledFor: Date
  timezone: string
  title: string
  content: string
  verse?: string
  devotionalText?: string
  prayerPoints?: string[]
  isRead?: boolean
  publishedAt?: Date
}

export interface FaithSchedule {
  timezone: string
  dailyAt: string
  weeklyCadence: string
  nextPostAt: Date
  lastPostAt?: Date
  isPaused: boolean
}

export interface FaithRitualSettings {
  timezone: string
  dailyTime: string
  notifications: {
    enabled: boolean
    preReminderMinutes: number
    sound: boolean
    vibration: boolean
  }
  streakGoalDays: number
  cadence: 'daily' | 'weekdays' | 'custom-days'
  customDays?: number[]
}
