export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'list'; items: string[] }

export interface CourseResource {
  id: string
  label: string
}

export interface CourseLesson {
  id: string
  title: string
  duration: string
  coverUrl?: string
  content?: ContentBlock[]
  resources?: CourseResource[]
}

export interface CourseModule {
  id: string
  title: string
  lessonCount: number
  lessons: CourseLesson[]
}

export interface CourseDetail {
  id: string
  title: string
  category: string
  coverUrl: string
  instructor: string
  instructorAvatarUrl: string
  description: string
  moduleCount: number
  lessonCount: number
  duration: string
  studentsCount: number
  whatYouLearn: string[]
  requirements: string[]
  hasCertificate: boolean
  modules: CourseModule[]
}

const HERO_COVER = 'https://picsum.photos/seed/business-purpose-hero/900/700'

export const COURSE_DETAILS: Record<string, CourseDetail> = {
  'business-with-purpose': {
    id: 'business-with-purpose',
    title: 'Building a Business with Purpose',
    category: 'Business',
    coverUrl: HERO_COVER,
    instructor: 'Jemima Olubusayo',
    instructorAvatarUrl: 'https://picsum.photos/seed/jemima-olubusayo/200/200',
    description:
      "Whether you're looking to strengthen your career, grow your business, deepen your faith, or develop practical life skills, this course is designed to give you guidance you can act on. You'll gain actionable insights you can apply in your everyday life.\n\nThroughout the course, you'll explore engaging video lessons, practical resources, and real-world examples carefully curated to enhance your learning experience and help you build something that lasts.",
    moduleCount: 17,
    lessonCount: 111,
    duration: '38h 11m',
    studentsCount: 292,
    whatYouLearn: [
      'Define your God-given business vision',
      'Balance profit and mission',
      'Build ethical business systems',
      'Create a purpose-driven brand',
    ],
    requirements: ['Basic understanding of entrepreneurship', 'Desire to build with integrity'],
    hasCertificate: true,
    modules: [
      {
        id: 'mod-vision',
        title: 'Discovering Your Business Vision',
        lessonCount: 15,
        lessons: [
          {
            id: 'lesson-purpose',
            title: "Finding Your God-Given Purpose",
            duration: '9m',
            coverUrl: 'https://picsum.photos/seed/lesson-purpose/900/600',
            content: [
              { type: 'paragraph', text: 'Every business starts with a why. Before you build anything, take time to understand the purpose behind it.' },
              { type: 'list', items: ['What problem are you called to solve?', 'Who is it for?', 'Why does it matter to you personally?'] },
            ],
          },
          {
            id: 'lesson-passion-profit',
            title: 'From Passion to Profit',
            duration: '11m',
            resources: [
              { id: 'res-1', label: 'Passion-to-Profit worksheet' },
              { id: 'res-2', label: 'Pricing your first offer' },
            ],
          },
          {
            id: 'lesson-vision-goals',
            title: 'Setting Vision-Aligned Goals',
            duration: '8m',
            coverUrl: 'https://picsum.photos/seed/lesson-vision-goals/900/600',
            content: [{ type: 'paragraph', text: 'Goals only matter when they point back to your vision. In this lesson we build a simple goal-setting framework you can revisit every quarter.' }],
          },
        ],
      },
      {
        id: 'mod-ethics',
        title: 'Foundations of Ethical Business',
        lessonCount: 15,
        lessons: [
          {
            id: 'lesson-systems-integrity',
            title: 'Designing Systems With Integrity',
            duration: '10m',
            coverUrl: 'https://picsum.photos/seed/lesson-systems-integrity/900/600',
            content: [{ type: 'paragraph', text: 'Integrity is easy to talk about and hard to build into daily operations. This lesson shows you where to start.' }],
          },
          {
            id: 'lesson-operations-values',
            title: 'Operations That Reflect Your Values',
            duration: '12m',
            resources: [{ id: 'res-3', label: 'Values-to-operations checklist' }],
          },
          {
            id: 'lesson-conflicts',
            title: 'Handling Conflicts of Interest',
            duration: '7m',
          },
        ],
      },
      {
        id: 'mod-brand',
        title: 'Personal Branding & Voice',
        lessonCount: 10,
        lessons: [
          {
            id: 'lesson-personal-brand',
            title: 'Building a Strong Personal Brand',
            duration: '14m',
            coverUrl: 'https://picsum.photos/seed/lesson-personal-brand/900/600',
            content: [
              {
                type: 'paragraph',
                text: 'Learn the fundamentals of building a personal brand that communicates who you are, what you stand for, and the value you bring to your audience.',
              },
              { type: 'heading', text: 'Introduction' },
              {
                type: 'paragraph',
                text: 'Your personal brand is more than a logo, a profile picture, or a social media presence. It is the impression people have of you based on your knowledge, values, communication, and the way you consistently show up. A strong personal brand helps you become recognizable, build credibility, and create meaningful opportunities.',
              },
              { type: 'paragraph', text: 'In this lesson, you will learn:' },
              {
                type: 'list',
                items: [
                  'What a personal brand is',
                  'Why personal positioning matters',
                  'How to define your niche',
                  'How to stay consistent across different platforms',
                ],
              },
              { type: 'heading', text: '1. Define Your Position' },
              { type: 'paragraph', text: 'Start by asking yourself three questions:' },
              { type: 'bold', text: 'What am I good at?' },
              {
                type: 'paragraph',
                text: 'Identify the skills, experiences, and knowledge that you can confidently bring to others.',
              },
              { type: 'bold', text: 'Who do I want to help?' },
              {
                type: 'paragraph',
                text: 'A clear understanding of your audience makes it easier to create relevant content and communicate effectively.',
              },
              { type: 'bold', text: 'What do I want to be known for?' },
              {
                type: 'paragraph',
                text: 'Choose a few areas that reflect your expertise and the type of value you want to provide.',
              },
              { type: 'heading', text: '2. Communicate Your Value' },
              {
                type: 'paragraph',
                text: 'Your audience should be able to understand what you offer without having to figure it out themselves. Instead of simply saying "I am a designer," try communicating the specific value you provide: "I design simple digital experiences that help businesses make their products easier to use." The second statement gives people a clearer understanding of your expertise and value.',
              },
              { type: 'heading', text: '3. Stay Consistent' },
              {
                type: 'paragraph',
                text: "Building a personal brand takes time. Your messaging, content, visual identity, and interactions should reinforce the same overall impression. You don't need to post every day. What matters more is that what you share consistently reflects your expertise and values.",
              },
              { type: 'heading', text: 'Key Takeaway' },
              {
                type: 'paragraph',
                text: 'Your personal brand is built through consistency, clarity, and the value you provide over time. Before moving to the next lesson, take a few minutes to write down:',
              },
              { type: 'list', items: ['What am I good at?', 'Who do I want to help?', 'What do I want to be known for?'] },
            ],
            resources: [
              { id: 'res-brand-1', label: 'Personal brand positioning template' },
              { id: 'res-brand-2', label: 'Brand voice worksheet' },
              { id: 'res-brand-3', label: '30-day consistency tracker' },
            ],
          },
          {
            id: 'lesson-brand-voice',
            title: 'Defining Your Brand Voice',
            duration: '9m',
          },
          {
            id: 'lesson-brand-consistency',
            title: 'Staying Consistent Across Platforms',
            duration: '8m',
            coverUrl: 'https://picsum.photos/seed/lesson-brand-consistency/900/600',
            content: [{ type: 'paragraph', text: 'A short walkthrough of keeping your voice, visuals, and message aligned everywhere you show up.' }],
          },
        ],
      },
      {
        id: 'mod-marketing',
        title: 'Purpose-Driven Marketing',
        lessonCount: 8,
        lessons: [
          {
            id: 'lesson-marketing-mission',
            title: 'Marketing Without Losing Your Mission',
            duration: '10m',
            coverUrl: 'https://picsum.photos/seed/lesson-marketing-mission/900/600',
            content: [{ type: 'paragraph', text: 'Growth and mission are not opposites. Here is how to market with conviction, not compromise.' }],
          },
          {
            id: 'lesson-storytelling',
            title: 'Storytelling That Converts',
            duration: '11m',
            resources: [{ id: 'res-4', label: 'Story structure template' }],
          },
          {
            id: 'lesson-trust',
            title: 'Building Trust With Your Audience',
            duration: '9m',
          },
        ],
      },
      {
        id: 'mod-scale',
        title: 'Creating Systems That Scale',
        lessonCount: 14,
        lessons: [
          {
            id: 'lesson-automation',
            title: 'Automating the Repetitive',
            duration: '13m',
            coverUrl: 'https://picsum.photos/seed/lesson-automation/900/600',
            content: [{ type: 'paragraph', text: 'Free up your time by automating the parts of your business that do not need your personal touch.' }],
          },
          {
            id: 'lesson-delegation',
            title: 'Delegation and Team Culture',
            duration: '12m',
            resources: [{ id: 'res-5', label: 'Delegation readiness checklist' }],
          },
          {
            id: 'lesson-metrics',
            title: 'Measuring What Matters',
            duration: '10m',
          },
        ],
      },
      {
        id: 'mod-community',
        title: 'Community & Growth',
        lessonCount: 20,
        lessons: [
          {
            id: 'lesson-loyal-community',
            title: 'Building a Loyal Community',
            duration: '11m',
            coverUrl: 'https://picsum.photos/seed/lesson-loyal-community/900/600',
            content: [{ type: 'paragraph', text: 'Community is the compounding asset of a purpose-driven business. Here is how to nurture one.' }],
          },
          {
            id: 'lesson-advocates',
            title: 'Turning Customers Into Advocates',
            duration: '9m',
          },
          {
            id: 'lesson-burnout',
            title: 'Sustaining Growth Without Burnout',
            duration: '10m',
            coverUrl: 'https://picsum.photos/seed/lesson-burnout/900/600',
            content: [{ type: 'paragraph', text: 'A closing lesson on pacing yourself so the business you built with purpose does not cost you your wellbeing.' }],
          },
        ],
      },
    ],
  },
}

export function getCourseDetail(id?: string) {
  if (!id) return undefined
  return COURSE_DETAILS[id]
}

export interface LessonContext {
  course: CourseDetail
  module: CourseModule
  lesson: CourseLesson
  index: number
  totalLessons: number
  prevLesson?: CourseLesson
  nextLesson?: CourseLesson
}

export function getLessonContext(courseId?: string, lessonId?: string): LessonContext | undefined {
  const course = getCourseDetail(courseId)
  if (!course || !lessonId) return undefined

  const flat = course.modules.flatMap(module => module.lessons.map(lesson => ({ module, lesson })))
  const index = flat.findIndex(entry => entry.lesson.id === lessonId)
  if (index === -1) return undefined

  return {
    course,
    module: flat[index].module,
    lesson: flat[index].lesson,
    index,
    totalLessons: flat.length,
    prevLesson: index > 0 ? flat[index - 1].lesson : undefined,
    nextLesson: index < flat.length - 1 ? flat[index + 1].lesson : undefined,
  }
}

export function countCourseLessons(course: CourseDetail) {
  return course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
}
