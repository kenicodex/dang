import type { Event } from '@/types/events'

const now = new Date('2026-07-20T09:00:00Z')

export const MOCK_NOW = now

export const HOME_CATEGORIES = ['All', 'Finances', 'Business', 'Networking', 'Social']

export const FILTER_CATEGORIES = ['Career', 'Wellness', 'Finance', 'Motherhood', 'Relationships', 'Business', 'Networking']

export const POPULAR_SEARCHES = ['Networking', 'Free Events', 'Virtual', 'Career', 'Wellness', 'Finance', 'This Weekend']

export const EVENTS: Event[] = [
  {
    id: 'wit-summit',
    title: 'Women in Tech Leadership Summit',
    slug: 'women-in-tech-leadership-summit',
    type: 'conference',
    category: 'Tech',
    isFeatured: true,
    description:
      'A full-day summit bringing together women leaders across tech industries to share insights, build connections, and inspire the next generation of female executives. Featuring keynotes, workshops, and curated networking sessions.',
    coverUrl: 'https://picsum.photos/seed/women-in-tech-summit/900/700',
    month: 'JUL',
    day: '24',
    date: 'Jul 24, 2026',
    time: '2:00 PM',
    startTime: '10:00 AM',
    endTime: '1:00 PM',
    timezone: 'WAT',
    venue: 'Lagos',
    address: 'Landmark Centre, Victoria Island, Lagos',
    isVirtual: false,
    attendeeCount: 150,
    goingLabel: '150+ going',
    capacity: 200,
    seatsRemaining: 45,
    priceLabel: 'Free',
    durationLabel: '3 hrs',
    host: 'TechHer Collectives',
    tags: ['networking', 'tech', 'leadership'],
    agenda: [
      { time: '9:30 AM', label: 'Registration & Coffee' },
      { time: '10:00 AM', label: 'Opening Keynote' },
      { time: '11:00 AM', label: 'Panel Discussion' },
      { time: '12:30 PM', label: 'Networking Lunch' },
      { time: '2:00 PM', label: 'Workshop Sessions' },
      { time: '4:30 PM', label: 'Closing Remarks' },
    ],
    speakers: [
      { name: 'Dr. Ayesha Akeem', role: 'Speaker · TechHer Collective' },
      { name: 'Mary Abiola', role: 'Speaker · TechHer Collective' },
      { name: 'Jennifer Praise', role: 'Speaker · TechHer Collective' },
    ],
    requirements: [
      'Valid ID for in-person check-in',
      'Laptop or device for virtual sessions',
      'Pre-reading materials (emailed 48hrs prior)',
    ],
    faqs: [
      { question: 'Can I attend with a guest?', answer: 'Plus-ones must register separately.' },
      { question: 'What is the refund policy?', answer: 'Full refund up to 48 hours before the event.' },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'wif-summit',
    title: 'Women in Finance Leadership Summit',
    slug: 'women-in-finance-leadership-summit',
    type: 'conference',
    category: 'Finance',
    description:
      'An afternoon of frank conversations on building wealth, negotiating pay, and leading finance teams — from women who have done it.',
    coverUrl: 'https://picsum.photos/seed/women-in-finance-summit/900/700',
    month: 'JUL',
    day: '26',
    date: 'Jul 26, 2026',
    time: '2:00 PM',
    startTime: '2:00 PM',
    endTime: '4:30 PM',
    timezone: 'WAT',
    venue: 'Lagos',
    address: 'The Wheatbaker, Ikoyi, Lagos',
    isVirtual: false,
    attendeeCount: 70,
    goingLabel: '70+ going',
    capacity: 75,
    seatsRemaining: 5,
    priceLabel: '₦25,000',
    priceAmount: 25000,
    processingFee: 1500,
    durationLabel: '2.5 hrs',
    host: 'TechHer Collective',
    tags: ['finance', 'leadership', 'networking'],
    transitLabel: '5 min walk, TBS',
    parkingLabel: 'Free on-site',
    organizerName: 'WealthHer',
    organizerPhone: '+234 555-0192',
    emergencyContactName: 'Event Safety Team',
    emergencyContactPhone: '+234 555-9911',
    venuePhotos: [
      'https://picsum.photos/seed/wif-venue-1/300/300',
      'https://picsum.photos/seed/wif-venue-2/300/300',
      'https://picsum.photos/seed/wif-venue-3/300/300',
    ],
    agenda: [
      { time: '2:00 PM', label: 'Welcome & Registration' },
      { time: '2:30 PM', label: 'Keynote: Building Generational Wealth' },
      { time: '3:30 PM', label: 'Panel: Negotiating Your Worth' },
      { time: '4:15 PM', label: 'Closing & Networking' },
    ],
    speakers: [{ name: 'Aisha Aminu', role: 'Speaker · TechHer Collective' }],
    requirements: ['Valid ID for check-in'],
    faqs: [{ question: 'Is parking available?', answer: 'Yes, complimentary valet parking on site.' }],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'motherhood-circle',
    title: 'Mindful Motherhood Circle',
    slug: 'mindful-motherhood-circle',
    type: 'meetup',
    category: 'Motherhood',
    description:
      'A gentle virtual circle for mothers to breathe, reflect, and reconnect with themselves — guided meditation, journaling prompts, and honest conversation.',
    coverUrl: 'https://picsum.photos/seed/mindful-motherhood-circle/900/700',
    month: 'JUL',
    day: '26',
    date: 'Jul 26, 2026',
    time: '2:00 PM',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    timezone: 'WAT',
    venue: 'Virtual',
    isVirtual: true,
    attendeeCount: 28,
    goingLabel: '28+ going',
    capacity: 40,
    seatsRemaining: 12,
    priceLabel: 'Free',
    durationLabel: '1 hr',
    host: 'Bloom Wellness',
    tags: ['motherhood', 'wellness'],
    participants: [
      { id: 'p-host', name: 'Adaeze Okonkwo', initials: 'AO', color: '#6EA88B', isHost: true },
      { id: 'p-you', name: 'Amara (You)', initials: 'AJ', color: '#8B7FD6' },
      { id: 'p-taiwo', name: 'Taiwo', initials: 'TW', color: '#C97A8C', avatarUrl: 'https://picsum.photos/seed/taiwo-face/300/300' },
      { id: 'p-james', name: 'James', initials: 'JM', color: '#B08968', avatarUrl: 'https://picsum.photos/seed/james-face/300/300' },
      { id: 'p-tanya-1', name: 'Tanya', initials: 'TA', color: '#8A8A8A' },
      { id: 'p-tanya-2', name: 'Tanya', initials: 'TA', color: '#8A8A8A', avatarUrl: 'https://picsum.photos/seed/tanya-face/300/300' },
    ],
    agenda: [
      { time: '2:00 PM', label: 'Grounding & Breathwork' },
      { time: '2:15 PM', label: 'Guided Reflection' },
      { time: '2:45 PM', label: 'Open Circle Sharing' },
    ],
    speakers: [{ name: 'Ngozi Bloom', role: 'Facilitator · Bloom Wellness' }],
    requirements: ['A quiet space and a journal'],
    faqs: [{ question: 'Is this recorded?', answer: 'No — this circle is unrecorded to keep it a safe space.' }],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'relationship-workshop',
    title: 'Relationship & Boundaries Workshop',
    slug: 'relationship-and-boundaries-workshop',
    type: 'workshop',
    category: 'Relationships',
    description:
      'Learn practical language and frameworks for setting boundaries with love — in friendships, family, and romantic relationships.',
    coverUrl: 'https://picsum.photos/seed/relationship-boundaries-workshop/900/700',
    month: 'JUL',
    day: '26',
    date: 'Jul 26, 2026',
    time: '2:00 PM',
    startTime: '2:00 PM',
    endTime: '3:30 PM',
    timezone: 'WAT',
    venue: 'Virtual',
    isVirtual: true,
    attendeeCount: 63,
    goingLabel: '63+ going',
    capacity: 80,
    seatsRemaining: 12,
    priceLabel: 'Free',
    durationLabel: '1.5 hrs',
    host: 'Bloom Wellness',
    tags: ['relationships', 'wellness'],
    agenda: [
      { time: '2:00 PM', label: 'Why Boundaries Matter' },
      { time: '2:30 PM', label: 'Scripts & Practice' },
      { time: '3:00 PM', label: 'Q&A' },
    ],
    speakers: [{ name: 'Chiamaka Nwosu', role: 'Facilitator · Bloom Wellness' }],
    requirements: [],
    faqs: [{ question: 'Do I need to turn my camera on?', answer: "It's encouraged but not required." }],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'launch-business',
    title: 'Launch Your Business in 90 Days',
    slug: 'launch-your-business-in-90-days',
    type: 'workshop',
    category: 'Business',
    description:
      'A step-by-step working session to take your business idea from notebook to launched — pricing, positioning, and your first 90-day plan.',
    coverUrl: 'https://picsum.photos/seed/launch-your-business-90-days/900/700',
    month: 'JUL',
    day: '26',
    date: 'Jul 26, 2026',
    time: '2:00 PM',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    timezone: 'WAT',
    venue: 'Virtual',
    isVirtual: true,
    attendeeCount: 112,
    goingLabel: '112+ going',
    capacity: 150,
    seatsRemaining: 12,
    priceLabel: 'Free',
    durationLabel: '2 hrs',
    host: 'Bloom Wellness',
    tags: ['business', 'networking'],
    agenda: [
      { time: '2:00 PM', label: 'Idea to Offer' },
      { time: '2:45 PM', label: 'Pricing Workshop' },
      { time: '3:30 PM', label: 'Your 90-Day Plan' },
    ],
    speakers: [{ name: 'Funmi Oladipo', role: 'Facilitator · Bloom Wellness' }],
    requirements: ['A notebook and your business idea'],
    faqs: [{ question: 'Is this for an existing business too?', answer: 'Yes — it works for a relaunch or pivot as well.' }],
    createdAt: now,
    updatedAt: now,
  },
]

export interface PastEvent {
  id: string
  title: string
  host: string
  hostAvatarUrl?: string
  date: string
  time: string
  attendeeCount: number
  recordingAvailable: boolean
}

export const PAST_EVENTS: PastEvent[] = [
  {
    id: 'past-roundtable',
    title: 'Women & Leadership Monthly Roundtable',
    host: 'Ifedayo Agoro',
    hostAvatarUrl: 'https://picsum.photos/seed/ifedayo-agoro/200/200',
    date: 'Jul 26, 2026',
    time: '2:00 PM',
    attendeeCount: 24,
    recordingAvailable: true,
  },
]

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function getEventById(id: string) {
  return EVENTS.find(event => event.id === id)
}

export function seatsUrgent(event: Event) {
  return (event.seatsRemaining ?? 0) < 10
}

export function ticketIdFor(eventId: string) {
  const index = EVENTS.findIndex(e => e.id === eventId)
  return `EVT-2026-${String(index + 1).padStart(4, '0')}`
}

export function daysRemaining(event: Event) {
  return Math.max(0, parseInt(event.day, 10) - MOCK_NOW.getDate())
}
