export type ChatThreadKind = 'personal' | 'group'
export type CallKind = 'audio' | 'video'
export type ChatMessageKind = 'text' | 'call' | 'voice' | 'link' | 'divider'
export type ChatMessageStatus = 'sent' | 'delivered' | 'read'

export interface MessageReaction {
  emoji: string
  count: number
}

export interface ChatThreadSummary {
  id: string
  kind: ChatThreadKind
  memberId?: string
  title: string
  handle?: string
  avatarUrl?: string
  memberAvatars?: string[]
  memberCount?: number
  activeCount?: number
  isOnline?: boolean
  preview: string
  time: string
  unreadCount?: number
  circle?: {
    isPrivate: boolean
    hostedBy: string
    description: string
    bio?: string
  }
}

export interface ChatMessage {
  id: string
  threadId: string
  fromMe: boolean
  senderId?: string
  senderName?: string
  senderRole?: string
  senderAvatarUrl?: string
  kind: ChatMessageKind
  content?: string
  time?: string
  status?: ChatMessageStatus
  dateLabel?: string
  quoted?: string
  isPinned?: boolean
  reactions?: MessageReaction[]
  call?: { kind: CallKind; missed?: boolean; ongoing?: boolean; duration: string }
  voice?: { duration: string }
  link?: { title: string; url: string; imageUrl?: string }
}

export interface CallLogEntry {
  id: string
  memberId: string
  kind: CallKind
  missed?: boolean
  direction: 'incoming' | 'outgoing'
  duration: string
  timeAgo: string
}

export type CircleSessionStatus = 'upcoming' | 'starting_soon' | 'live'

export interface CircleSessionHost {
  name: string
  avatarUrl?: string
  title?: string
}

export interface CircleSession {
  id: string
  threadId: string
  title: string
  status: CircleSessionStatus
  privateTag?: string
  date: string
  time: string
  startsInLabel?: string
  host: CircleSessionHost
  attendeeCount: number
  attendeeAvatars?: string[]
  liveAvatars?: string[]
  liveLabel?: string
  description?: string
  reminderLabel?: string
  isGoing?: boolean
  pastRecordings?: { id: string; title: string; date: string; hostName: string; hostAvatarUrl?: string; attendeeCount: number }[]
  upcomingEvent?: { id: string; title: string; date: string; hostAvatarUrl?: string; isGoing?: boolean }
}

export type MediaItemKind = 'image' | 'video' | 'doc' | 'link'

export interface MediaItem {
  id: string
  threadId: string
  kind: MediaItemKind
  title?: string
  subtitle?: string
  url?: string
  imageUrl?: string
  sizeLabel?: string
  fromMe: boolean
  senderName: string
  dateGroup: string
}

export interface GroupMemberEntry {
  memberId: string
  name: string
  role?: string
  avatarUrl?: string
  isYou?: boolean
}
