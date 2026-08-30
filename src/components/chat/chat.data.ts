import { findMember } from '@/components/members/members.data'
import type {
  CallLogEntry,
  ChatMessage,
  ChatThreadSummary,
  CircleSession,
  GroupMemberEntry,
  MediaItem,
  MessageReaction,
} from '@/types/chat'

function member(id: string) {
  const m = findMember(id)
  if (!m) throw new Error(`Unknown member id in chat data: ${id}`)
  return m
}

const CONTACT_NAME_OVERRIDES: Record<string, string> = {
  'mem-aisha': 'Aisha Aminu',
}

export function contactDisplayName(memberId: string, fallback: string): string {
  return CONTACT_NAME_OVERRIDES[memberId] ?? fallback
}

export const PERSONAL_THREADS: ChatThreadSummary[] = [
  {
    id: 'thread-aisha',
    kind: 'personal',
    memberId: 'mem-aisha',
    title: 'Aisha Aminu',
    handle: '@aisha',
    avatarUrl: member('mem-aisha').avatarUrl,
    isOnline: true,
    preview: 'Oh, thank you for the nice comments, ive followed back immediately.',
    time: '12:25',
  },
  {
    id: 'thread-tobenna',
    kind: 'personal',
    memberId: 'mem-tobenna',
    title: 'Tobenna Okafor',
    avatarUrl: member('mem-tobenna').avatarUrl,
    isOnline: false,
    preview: 'That workshop recap was so helpful, thank you!',
    time: '11:40',
  },
  {
    id: 'thread-maya',
    kind: 'personal',
    memberId: 'mem-maya',
    title: 'Maya Ihenacho',
    avatarUrl: member('mem-maya').avatarUrl,
    isOnline: true,
    preview: 'Let me know when you are free for a quick call.',
    time: '10:05',
  },
  {
    id: 'thread-kemi',
    kind: 'personal',
    memberId: 'mem-kemi',
    title: 'Kemi Adeyemi',
    avatarUrl: member('mem-kemi').avatarUrl,
    isOnline: false,
    preview: 'Sent you the budgeting template we talked about 📎',
    time: 'Yesterday',
    unreadCount: 2,
  },
  {
    id: 'thread-chidera',
    kind: 'personal',
    memberId: 'mem-chidera',
    title: 'Chidera Nwosu',
    avatarUrl: member('mem-chidera').avatarUrl,
    isOnline: false,
    preview: 'Loved your take on green portfolios 🌱',
    time: 'Yesterday',
  },
]

export const GROUP_THREADS: ChatThreadSummary[] = [
  {
    id: 'thread-inner-circle',
    kind: 'group',
    title: 'Inner Circle',
    memberAvatars: [
      member('mem-aisha').avatarUrl!,
      member('mem-maya').avatarUrl!,
      member('mem-kemi').avatarUrl!,
    ],
    isOnline: true,
    memberCount: 778,
    activeCount: 243,
    preview: 'Celebration, community career wins and culture for us and by us all.',
    time: '12:25',
    unreadCount: 2,
    circle: {
      isPrivate: true,
      hostedBy: 'Ifedayo Agoro',
      description: 'Celebration, community career wins and culture for us and by us all.',
      bio: 'Officially wealthy women. 🙌🙌',
    },
  },
  {
    id: 'thread-chit-chats',
    kind: 'group',
    title: "Chit Chat's",
    avatarUrl: 'https://picsum.photos/seed/chit-chats-cover/200/200',
    isOnline: true,
    preview: 'Friends of Amara and co',
    time: '12:25',
  },
]

export const IFEDAYO_HOST = {
  name: 'Ifedayo Agoro',
  avatarUrl: 'https://picsum.photos/seed/ifedayo-agoro/200/200',
  title: 'Community leader',
}

const GROUP_PARTICIPANTS = {
  fareedah: { name: 'Fareedah', avatarUrl: 'https://picsum.photos/seed/fareedah-avatar/200/200' },
  daniella: { name: 'Daniella', avatarUrl: 'https://picsum.photos/seed/daniella-avatar/200/200' },
  vivian: { name: 'Vivian Ademola', avatarUrl: 'https://picsum.photos/seed/vivian-ademola-avatar/200/200' },
  amina: { name: 'Amina', avatarUrl: 'https://picsum.photos/seed/amina-inner-circle/200/200' },
}

const LOREM_LONG =
  'Lorem ipsum dolor sit amet, consectetuing adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const LOREM_SHORT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const STANDARD_REACTIONS: MessageReaction[] = [
  { emoji: '❤️', count: 8 },
  { emoji: '👍', count: 22 },
  { emoji: '😊', count: 8 },
]

export const CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'thread-inner-circle': [
    {
      id: 'ic1',
      threadId: 'thread-inner-circle',
      fromMe: true,
      senderRole: 'Admin',
      kind: 'text',
      content: LOREM_LONG,
      time: '02:22 AM',
      status: 'read',
      dateLabel: '1 Aug',
      reactions: STANDARD_REACTIONS,
    },
    {
      id: 'ic2',
      threadId: 'thread-inner-circle',
      fromMe: false,
      senderName: GROUP_PARTICIPANTS.fareedah.name,
      senderAvatarUrl: GROUP_PARTICIPANTS.fareedah.avatarUrl,
      kind: 'text',
      content: LOREM_SHORT,
      time: '02:22 AM',
      status: 'read',
      reactions: STANDARD_REACTIONS,
    },
    { id: 'ic3', threadId: 'thread-inner-circle', fromMe: false, kind: 'divider', content: 'New Message' },
    {
      id: 'ic4',
      threadId: 'thread-inner-circle',
      fromMe: false,
      senderName: GROUP_PARTICIPANTS.daniella.name,
      senderAvatarUrl: GROUP_PARTICIPANTS.daniella.avatarUrl,
      kind: 'call',
      call: { kind: 'audio', ongoing: true, duration: '10 Min 23 Sec' },
      time: '02:22 AM',
    },
    {
      id: 'ic5',
      threadId: 'thread-inner-circle',
      fromMe: true,
      kind: 'text',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .',
      time: '02:22 AM',
      status: 'read',
      reactions: STANDARD_REACTIONS,
    },
  ],
  'thread-aisha': [
    { id: 'm1', threadId: 'thread-aisha', fromMe: true, kind: 'text', content: 'Hello', time: '11:25', status: 'read', dateLabel: '1 Aug' },
    {
      id: 'm2',
      threadId: 'thread-aisha',
      fromMe: true,
      kind: 'call',
      call: { kind: 'audio', duration: '1hr 45Min 23 Sec' },
      time: '11:25',
    },
    {
      id: 'm3',
      threadId: 'thread-aisha',
      fromMe: false,
      kind: 'text',
      quoted: 'Hello',
      content: 'Hi, how are you doing today?',
      time: '11:25',
    },
    {
      id: 'm4',
      threadId: 'thread-aisha',
      fromMe: false,
      kind: 'call',
      call: { kind: 'video', missed: true, duration: '10 Min 23 Sec' },
      time: '11:25',
    },
    { id: 'm5', threadId: 'thread-aisha', fromMe: true, kind: 'voice', voice: { duration: '02:12' }, time: '11:25', status: 'read' },
    {
      id: 'm6',
      threadId: 'thread-aisha',
      fromMe: true,
      kind: 'link',
      link: {
        title: 'External Link Title',
        url: 'https://www.externallink.com',
        imageUrl: 'https://picsum.photos/seed/external-link-preview/400/240',
      },
      time: '11:25',
      status: 'sent',
    },
    { id: 'm7', threadId: 'thread-aisha', fromMe: false, kind: 'divider', content: 'New Message' },
  ],
}

export const CALL_LOG: CallLogEntry[] = [
  { id: 'c1', memberId: 'mem-aisha', kind: 'audio', direction: 'outgoing', duration: '12m 25s', timeAgo: '20 Min Ago' },
  { id: 'c2', memberId: 'mem-aisha', kind: 'audio', direction: 'outgoing', missed: true, duration: '12m 25s', timeAgo: '20 Min Ago' },
  { id: 'c3', memberId: 'mem-aisha', kind: 'audio', direction: 'incoming', duration: '12m 25s', timeAgo: '20 Min Ago' },
  { id: 'c4', memberId: 'mem-aisha', kind: 'video', direction: 'incoming', duration: '12m 25s', timeAgo: '20 Min Ago' },
  { id: 'c5', memberId: 'mem-aisha', kind: 'video', direction: 'outgoing', missed: true, duration: '12m 25s', timeAgo: '20 Min Ago' },
  { id: 'c6', memberId: 'mem-aisha', kind: 'video', direction: 'incoming', duration: '12m 25s', timeAgo: '20 Min Ago' },
]

export function findThread(id: string): ChatThreadSummary | undefined {
  const existing = [...PERSONAL_THREADS, ...GROUP_THREADS].find(t => t.id === id)
  if (existing) return existing

  const memberId = id.replace(/^thread-/, 'mem-')
  const m = findMember(memberId)
  if (!m) return undefined

  return {
    id,
    kind: 'personal',
    memberId: m.id,
    title: contactDisplayName(m.id, m.displayName),
    handle: m.handle,
    avatarUrl: m.avatarUrl,
    isOnline: m.isOnline,
    preview: '',
    time: '',
  }
}

export const CIRCLE_SESSIONS: Record<string, CircleSession> = {
  'thread-inner-circle': {
    id: 'session-women-leadership',
    threadId: 'thread-inner-circle',
    title: 'Women & Leadership Monthly Roundtable',
    status: 'upcoming',
    privateTag: 'Women in Tech Leadership Summit',
    date: 'Jul 26, 2026',
    time: '2:00 PM',
    startsInLabel: 'starts in 30 mins',
    host: IFEDAYO_HOST,
    attendeeCount: 24,
    attendeeAvatars: [
      member('mem-aisha').avatarUrl!,
      member('mem-maya').avatarUrl!,
      member('mem-kemi').avatarUrl!,
    ],
    liveAvatars: [GROUP_PARTICIPANTS.amina.avatarUrl, member('mem-aisha').avatarUrl!],
    liveLabel: 'Amina and 18 others are here',
    description:
      'A full-day summit bringing together women leaders across tech industries to share insights, build connections, and inspire the next generation of female executives. Featuring keynotes, workshops, and curated networking sessions.',
    reminderLabel: '30 minutes before',
    isGoing: true,
    pastRecordings: [
      {
        id: 'rec-1',
        title: 'Women & Leadership Monthly Roundtable',
        date: 'Jul 26, 2026 · 2:00 PM',
        hostName: IFEDAYO_HOST.name,
        hostAvatarUrl: IFEDAYO_HOST.avatarUrl,
        attendeeCount: 24,
      },
      {
        id: 'rec-2',
        title: 'Women & Leadership Monthly Roundtable',
        date: 'Jul 26, 2026 · 2:00 PM',
        hostName: IFEDAYO_HOST.name,
        hostAvatarUrl: IFEDAYO_HOST.avatarUrl,
        attendeeCount: 24,
      },
    ],
    upcomingEvent: {
      id: 'evt-confidence-talk',
      title: 'Building confidence talk',
      date: 'Jul 26, 2026 · 2:00 PM',
      hostAvatarUrl: IFEDAYO_HOST.avatarUrl,
      isGoing: true,
    },
  },
}

export function findCircleSession(threadId: string): CircleSession | undefined {
  return CIRCLE_SESSIONS[threadId]
}

export const GROUP_MEMBERS: Record<string, GroupMemberEntry[]> = {
  'thread-inner-circle': [
    { memberId: 'host-ifedayo', name: IFEDAYO_HOST.name, role: 'Admin', avatarUrl: IFEDAYO_HOST.avatarUrl },
    { memberId: 'mem-amara-johnson', name: 'Amara Johnson (You)', role: 'Building In Community', avatarUrl: 'https://picsum.photos/seed/amara-johnson-avatar/200/200', isYou: true },
    { memberId: 'mem-aisha', name: 'Aisha Aminu', role: 'Tech Lead', avatarUrl: member('mem-aisha').avatarUrl },
    { memberId: 'mem-fareedah', name: GROUP_PARTICIPANTS.fareedah.name, avatarUrl: GROUP_PARTICIPANTS.fareedah.avatarUrl },
    { memberId: 'mem-vivian', name: GROUP_PARTICIPANTS.vivian.name, role: 'Tech Lead', avatarUrl: GROUP_PARTICIPANTS.vivian.avatarUrl },
  ],
}

export const MEDIA_ITEMS: Record<string, MediaItem[]> = {
  'thread-inner-circle': [
    { id: 'media-1', threadId: 'thread-inner-circle', kind: 'video', imageUrl: 'https://picsum.photos/seed/inner-circle-media-1/400/400', fromMe: true, senderName: 'You', dateGroup: 'Today' },
    { id: 'media-2', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-2/400/400', fromMe: true, senderName: 'You', dateGroup: 'Today' },
    { id: 'media-3', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-3/400/400', fromMe: false, senderName: 'Mariam', dateGroup: 'Today' },
    { id: 'media-4', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-4/400/400', fromMe: false, senderName: 'Mariam', dateGroup: 'Today' },
    { id: 'media-5', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-5/400/400', fromMe: true, senderName: 'You', dateGroup: 'Yesterday' },
    { id: 'media-6', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-6/400/400', fromMe: false, senderName: 'Mariam', dateGroup: 'Yesterday' },
    { id: 'media-7', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-7/400/400', fromMe: true, senderName: 'You', dateGroup: 'Yesterday' },
    { id: 'media-8', threadId: 'thread-inner-circle', kind: 'image', imageUrl: 'https://picsum.photos/seed/inner-circle-media-8/400/400', fromMe: false, senderName: 'Mariam', dateGroup: 'Yesterday' },
    {
      id: 'doc-1',
      threadId: 'thread-inner-circle',
      kind: 'doc',
      title: 'Account_report.docx',
      sizeLabel: '2,5gb · docx',
      fromMe: true,
      senderName: 'You',
      dateGroup: 'Today',
    },
    {
      id: 'doc-2',
      threadId: 'thread-inner-circle',
      kind: 'doc',
      title: 'Account_report.docx',
      sizeLabel: '2,5gb · docx',
      fromMe: false,
      senderName: 'Mariam',
      dateGroup: 'Today',
    },
    {
      id: 'doc-3',
      threadId: 'thread-inner-circle',
      kind: 'doc',
      title: 'Account_report.docx',
      sizeLabel: '2,5gb · docx',
      fromMe: true,
      senderName: 'You',
      dateGroup: 'Yesterday',
    },
    {
      id: 'doc-4',
      threadId: 'thread-inner-circle',
      kind: 'doc',
      title: 'Account_report.docx',
      sizeLabel: '2,5gb · docx',
      fromMe: false,
      senderName: 'Mariam',
      dateGroup: 'Yesterday',
    },
    {
      id: 'link-1',
      threadId: 'thread-inner-circle',
      kind: 'link',
      title: 'External Link Title',
      subtitle: 'External link description',
      url: 'https://www.externallink.com',
      fromMe: true,
      senderName: 'You',
      dateGroup: 'Today',
    },
    {
      id: 'link-2',
      threadId: 'thread-inner-circle',
      kind: 'link',
      title: 'External Link Title',
      subtitle: 'External link description',
      url: 'https://www.externallink.com',
      fromMe: false,
      senderName: 'Mariam',
      dateGroup: 'Today',
    },
    {
      id: 'link-3',
      threadId: 'thread-inner-circle',
      kind: 'doc',
      title: 'Account_report.docx',
      sizeLabel: '2,5gb · docx',
      fromMe: true,
      senderName: 'You',
      dateGroup: 'Yesterday',
    },
    {
      id: 'link-4',
      threadId: 'thread-inner-circle',
      kind: 'link',
      title: 'External Link Title',
      url: 'https://www.externallink.com',
      imageUrl: 'https://picsum.photos/seed/inner-circle-link-preview/400/240',
      fromMe: false,
      senderName: 'Mariam',
      dateGroup: 'Yesterday',
    },
  ],
}
