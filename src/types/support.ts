export type RequestStatus = 'in_progress' | 'resolved' | 'not_resolved' | 'requires_action'

export interface SupportMessage {
  id: string
  fromSupport: boolean
  content: string
  time: string
}

export interface SupportRequest {
  id: string
  category: string
  subject: string
  message: string
  status: RequestStatus
  submittedAt: string
  updatedLabel: string
  messages: SupportMessage[]
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface HelpTopic {
  id: string
  icon: string
  title: string
  description: string
  faqs: FAQItem[]
}
