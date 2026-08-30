export type SessionStatus = 'live' | 'upcoming' | 'past'

export interface SessionEntry {
  id: string
  courseId: string
  title: string
  host: string
  hostAvatarUrl: string
  status: SessionStatus
  dateLabel: string
  startsAt?: Date
  duration?: string
  participantCount: number
}

export const COURSE_LIVE_SESSIONS: Record<string, SessionEntry[]> = {
  'business-with-purpose': [
    {
      id: 'session-funding',
      courseId: 'business-with-purpose',
      title: 'Funding Your Purpose-Driven Business',
      host: 'Jamal Rivera',
      hostAvatarUrl: 'https://picsum.photos/seed/jamal-rivera/200/200',
      status: 'live',
      dateLabel: 'Live Now · Today',
      participantCount: 247,
    },
    {
      id: 'session-brand',
      courseId: 'business-with-purpose',
      title: 'Building Your Business Brand',
      host: 'Adaeze Okonkwo',
      hostAvatarUrl: 'https://picsum.photos/seed/adaeze-okonkwo/200/200',
      status: 'upcoming',
      dateLabel: 'Thu, 17 Jul · 8:00 PM',
      startsAt: new Date(Date.now() + 60_000),
      participantCount: 15,
    },
    {
      id: 'session-side-hustle',
      courseId: 'business-with-purpose',
      title: 'Starting Your Side Hustle with Faith',
      host: 'Jamal Rivera',
      hostAvatarUrl: 'https://picsum.photos/seed/jamal-rivera/200/200',
      status: 'past',
      dateLabel: '28 Jun 2025',
      duration: '58 Min',
      participantCount: 189,
    },
    {
      id: 'session-work-worship',
      courseId: 'business-with-purpose',
      title: 'Balancing Work, Worship, and Wellness',
      host: 'Amina Khalid',
      hostAvatarUrl: 'https://picsum.photos/seed/amina-khalid/200/200',
      status: 'past',
      dateLabel: '05 Jul 2025',
      duration: '45 Min',
      participantCount: 132,
    },
  ],
}

export function findSession(id?: string): SessionEntry | undefined {
  if (!id) return undefined
  return Object.values(COURSE_LIVE_SESSIONS)
    .flat()
    .find(session => session.id === id)
}

export interface RoomParticipant {
  id: string
  name: string
  avatarUrl?: string
  initials: string
  isHost?: boolean
  micOn: boolean
  cameraOn: boolean
  tileColor: string
}

export const REPLAY_TILES: RoomParticipant[] = [
  {
    id: 'p-taiwo',
    name: 'Taiwo',
    avatarUrl: 'https://picsum.photos/seed/taiwo-participant/300/300',
    initials: 'TA',
    micOn: false,
    cameraOn: true,
    tileColor: '#4B4560',
  },
  {
    id: 'p-james',
    name: 'James',
    avatarUrl: 'https://picsum.photos/seed/james-participant/300/300',
    initials: 'JA',
    micOn: false,
    cameraOn: true,
    tileColor: '#4B4560',
  },
  {
    id: 'p-tanya',
    name: 'Tanya',
    initials: 'TA',
    micOn: false,
    cameraOn: false,
    tileColor: '#4B4560',
  },
  {
    id: 'p-zara',
    name: 'Zara',
    avatarUrl: 'https://picsum.photos/seed/zara-participant/300/300',
    initials: 'ZA',
    micOn: false,
    cameraOn: true,
    tileColor: '#4B4560',
  },
]

export interface ChatMessage {
  id: string
  name: string
  avatarUrl?: string
  text: string
  time: string
}

export const ROOM_CHAT: ChatMessage[] = [
  { id: 'c1', name: 'Maya L.', avatarUrl: 'https://picsum.photos/seed/maya-chat/100/100', text: 'Excited to join this group!', time: '7:32 PM' },
  { id: 'c2', name: 'Ethan R.', avatarUrl: 'https://picsum.photos/seed/ethan-chat/100/100', text: 'This is just what I was looking for.', time: '9:10 PM' },
  { id: 'c3', name: 'Sophia M.', avatarUrl: 'https://picsum.photos/seed/sophia-chat/100/100', text: 'Loving the vibe here 🙌', time: '6:58 PM' },
  { id: 'c4', name: 'Noah T.', avatarUrl: 'https://picsum.photos/seed/noah-chat/100/100', text: 'Quick question: is this relevant for startups as well?', time: '7:45 PM' },
  { id: 'c5', name: 'Olivia B.', avatarUrl: 'https://picsum.photos/seed/olivia-chat/100/100', text: 'Great question! Absolutely, it’s especially helpful for startups.', time: '8:22 PM' },
]

export const ROOM_ATTENDEE_LIST: RoomParticipant[] = [
  { id: 'a-host', name: 'Adaeze Okonkwo', avatarUrl: 'https://picsum.photos/seed/adaeze-okonkwo/200/200', initials: 'AO', isHost: true, micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-amina', name: 'Amina Yusuf', avatarUrl: 'https://picsum.photos/seed/amina-attendee/200/200', initials: 'AY', micOn: true, cameraOn: false, tileColor: '#4B4560' },
  { id: 'a-leila', name: 'Leila Morgan', avatarUrl: 'https://picsum.photos/seed/leila-attendee/200/200', initials: 'LM', micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-nina', name: 'Nina Patel', avatarUrl: 'https://picsum.photos/seed/nina-attendee/200/200', initials: 'NP', micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-sofia', name: 'Sofia Ramirez', avatarUrl: 'https://picsum.photos/seed/sofia-attendee/200/200', initials: 'SR', micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-jade', name: 'Jade Thompson', avatarUrl: 'https://picsum.photos/seed/jade-attendee/200/200', initials: 'JT', micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-maya', name: 'Maya Li', avatarUrl: 'https://picsum.photos/seed/maya-attendee/200/200', initials: 'ML', micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-zara', name: 'Zara Ahmed', avatarUrl: 'https://picsum.photos/seed/zara-attendee/200/200', initials: 'ZA', micOn: true, cameraOn: true, tileColor: '#4B4560' },
  { id: 'a-clara', name: 'Clara Bennett', avatarUrl: 'https://picsum.photos/seed/clara-attendee/200/200', initials: 'CB', micOn: true, cameraOn: true, tileColor: '#4B4560' },
]

export const WAITING_ROOM_PREVIEW = [
  { id: 'w1', name: 'Theodora', avatarUrl: 'https://picsum.photos/seed/theodora-wait/100/100' },
  { id: 'w2', name: 'Taiwo', initials: 'TA' },
  { id: 'w3', name: 'Sophie', avatarUrl: 'https://picsum.photos/seed/sophie-wait/100/100' },
]
