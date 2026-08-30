import { create } from './zustand'
import type { TesterApplication, TesterFeedback, TesterStatus } from '@/types/commerce'

const OUTCOMES: TesterStatus[] = ['selected', 'pending', 'rejected']

export interface LifestyleState {
  testerStatus: Record<string, TesterStatus>
  applications: Record<string, TesterApplication>
  feedback: Record<string, TesterFeedback>
  applyForTester: (application: TesterApplication) => TesterStatus
  submitFeedback: (feedback: TesterFeedback) => void
}

export const useLifestyleStore = create<LifestyleState>((set, get) => ({
  testerStatus: {},
  applications: {},
  feedback: {},
  applyForTester: application => {
    const outcome = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)]
    set({
      applications: { ...get().applications, [application.dropId]: application },
      testerStatus: { ...get().testerStatus, [application.dropId]: outcome },
    })
    return outcome
  },
  submitFeedback: feedback => {
    set({
      feedback: { ...get().feedback, [feedback.dropId]: feedback },
      testerStatus: { ...get().testerStatus, [feedback.dropId]: 'completed' },
    })
  },
}))
