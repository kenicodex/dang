import type { Auditable } from './common'
import type { SubscriptionTier } from './subscriptions'
import type { MemberProfile } from './members'

export type EventType = 'meetup' | 'workshop' | 'webinar' | 'retreat' | 'live-room' | 'conference'

export interface EventAgendaItem {
  time: string
  label: string
}

export interface EventSpeaker {
  name: string
  role: string
}

export interface EventFAQ {
  question: string
  answer: string
}

export interface EventParticipant {
  id: string
  name: string
  initials: string
  color: string
  avatarUrl?: string
  isHost?: boolean
}

export interface Event extends Auditable {
  title: string
  slug: string
  type: EventType
  description?: string
  coverUrl?: string
  month: string
  day: string
  date: string
  time: string
  startTime: string
  endTime: string
  timezone: string
  venue?: string
  address?: string
  isVirtual: boolean
  roomUrl?: string
  attendeeCount: number
  capacity?: number
  waitlistCount?: number
  rsvpStatus?: 'yes' | 'no' | 'maybe' | 'unanswered'
  host?: string
  tierId?: string
  tags?: string[]
  recordingAvailable?: boolean
  category?: string
  isFeatured?: boolean
  priceLabel?: string
  priceAmount?: number
  seatsRemaining?: number
  durationLabel?: string
  goingLabel?: string
  agenda?: EventAgendaItem[]
  speakers?: EventSpeaker[]
  requirements?: string[]
  faqs?: EventFAQ[]
  processingFee?: number
  transitLabel?: string
  parkingLabel?: string
  organizerName?: string
  organizerPhone?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  venuePhotos?: string[]
  participants?: EventParticipant[]
}

export interface EventRSVP extends Auditable {
  eventId: string
  memberId: string
  status: 'yes' | 'no' | 'maybe'
  plusOnes: number
  dietaryRequirements?: string
  accessibilityNeeds?: string
  waitlistPosition?: number
  rsvpAt: Date
}

export interface LiveRoomParticipant {
  participantId: string
  profile?: Pick<MemberProfile, 'id' | 'displayName' | 'avatarUrl'>
  isHost: boolean
  isMuted: boolean
  isVideoOn: boolean
  isHandRaised: boolean
  joinedAt: Date
  role: 'host' | 'panelist' | 'attendee'
}

export interface LiveRoomState {
  eventId: string
  isLive: boolean
  isRecording: boolean
  startedAt?: Date
  participantCount: number
  participants: LiveRoomParticipant[]
  roomToken?: string
  chatEnabled: boolean
  qaEnabled: boolean
}

export interface EventRecording extends Auditable {
  id: string
  eventId: string
  title: string
  duration: string
  playbackUrl: string
  thumbnailUrl?: string
  transcriptUrl?: string
  isAccessible: boolean
  restrictedTierId?: SubscriptionTier['id']
  viewCount: number
  recordedAt: Date
}
