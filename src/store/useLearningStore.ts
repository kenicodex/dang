import { create } from './zustand'

export interface LearningState {
  enrolledCourseIds: string[]
  completedLessonIds: string[]
  enroll: (courseId: string) => void
  toggleLessonCompleted: (lessonId: string) => void
}

export const useLearningStore = create<LearningState>((set, get) => ({
  enrolledCourseIds: [],
  completedLessonIds: ['lesson-purpose', 'lesson-passion-profit', 'lesson-vision-goals', 'lesson-systems-integrity'],
  enroll: courseId => {
    if (get().enrolledCourseIds.includes(courseId)) return
    set({ enrolledCourseIds: [...get().enrolledCourseIds, courseId] })
  },
  toggleLessonCompleted: lessonId => {
    const { completedLessonIds } = get()
    set({
      completedLessonIds: completedLessonIds.includes(lessonId)
        ? completedLessonIds.filter(id => id !== lessonId)
        : [...completedLessonIds, lessonId],
    })
  },
}))
