export interface CourseListItem {
  id: string
  title: string
  instructor: string
  coverUrl: string
  lessonCount: number
  duration: string
  category: string
  progress?: number
}

export interface FeaturedCourse extends Omit<CourseListItem, 'coverUrl'> {
  certificate?: boolean
}

export const CATEGORIES = ['All', 'Finances', 'Business', 'Networking', 'Social']
export const MY_COURSES_FILTERS = ['All', 'Ongoing', 'Completed']

export const FEATURED_COURSE: FeaturedCourse = {
  id: 'business-with-purpose',
  title: 'Building a Business with Purpose',
  instructor: 'Adaeze Okonkwo',
  lessonCount: 98,
  duration: '29h 45m',
  category: 'Business',
  certificate: true,
}

export const DISCOVER_COURSES: CourseListItem[] = [
  {
    id: 'remote-collaboration',
    title: 'Mastering Remote Collaboration',
    instructor: 'Jamal Rivera',
    coverUrl: 'https://picsum.photos/seed/remote-collaboration/200/200',
    lessonCount: 5,
    duration: '2h 45m',
    category: 'Networking',
  },
  {
    id: 'design-thinking',
    title: 'Design Thinking for Innovation',
    instructor: 'Lina Chen',
    coverUrl: 'https://picsum.photos/seed/design-thinking-lock/200/200',
    lessonCount: 6,
    duration: '4h 10m',
    category: 'Business',
  },
  {
    id: 'sustainable-marketing',
    title: 'Sustainable Marketing Tactics',
    instructor: 'Priya Desai',
    coverUrl: 'https://picsum.photos/seed/sustainable-marketing-ship/200/200',
    lessonCount: 8,
    duration: '3h 50m',
    category: 'Business',
  },
]

export const MY_COURSES: CourseListItem[] = [
  {
    id: 'business-with-purpose',
    title: 'Building a Business with Purpose',
    instructor: 'Adaeze Okonkwo',
    coverUrl: 'https://picsum.photos/seed/remote-collaboration/200/200',
    lessonCount: 7,
    duration: '3h 20m',
    category: 'Business',
    progress: 29,
  },
  {
    id: 'design-thinking',
    title: 'Design Thinking for Innovation',
    instructor: 'Adaeze Okonkwo',
    coverUrl: 'https://picsum.photos/seed/design-thinking-lock/200/200',
    lessonCount: 7,
    duration: '3h 20m',
    category: 'Business',
    progress: 64,
  },
  {
    id: 'sustainable-marketing',
    title: 'Sustainable Marketing Tactics',
    instructor: 'Adaeze Okonkwo',
    coverUrl: 'https://picsum.photos/seed/sustainable-marketing-ship/200/200',
    lessonCount: 7,
    duration: '3h 20m',
    category: 'Business',
    progress: 100,
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence in Leadership',
    instructor: 'Adaeze Okonkwo',
    coverUrl: 'https://picsum.photos/seed/emotional-intelligence-cube/200/200',
    lessonCount: 7,
    duration: '3h 20m',
    category: 'Networking',
    progress: 100,
  },
]
