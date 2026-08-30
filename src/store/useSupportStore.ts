import { create } from './zustand'
import { SUPPORT_REQUESTS } from '@/components/support/support.data'
import type { SupportRequest } from '@/types/support'

interface SubmitRequestInput {
  category: string
  subject: string
  message: string
}

export interface SupportState {
  requests: SupportRequest[]
  submitRequest: (input: SubmitRequestInput) => SupportRequest
  sendMessage: (requestId: string, content: string) => void
  resolveRequest: (requestId: string, resolved: boolean) => void
  reopenRequest: (requestId: string) => void
}

let nextRequestNumber = 13460

export const useSupportStore = create<SupportState>((set, get) => ({
  requests: SUPPORT_REQUESTS,
  submitRequest: ({ category, subject, message }) => {
    const id = `DNG-${nextRequestNumber}`
    nextRequestNumber += 1

    const request: SupportRequest = {
      id,
      category,
      subject: subject.trim() || message.slice(0, 48) || 'Support request',
      message,
      status: 'in_progress',
      submittedAt: 'Just now',
      updatedLabel: 'Submitted just now',
      messages: [
        { id: `${id}-m1`, fromSupport: false, content: subject.trim() ? `${subject.trim()}. ${message}` : message, time: 'Now' },
        {
          id: `${id}-m2`,
          fromSupport: true,
          content: `Hello, thank you for reaching out, our team has received your request (#${id}) and we are looking into it.`,
          time: 'Now',
        },
      ],
    }

    set({ requests: [request, ...get().requests] })
    return request
  },
  sendMessage: (requestId, content) => {
    set({
      requests: get().requests.map(r =>
        r.id === requestId
          ? {
              ...r,
              messages: [...r.messages, { id: `${requestId}-${r.messages.length + 1}`, fromSupport: false, content, time: 'Now' }],
              updatedLabel: 'Updated just now',
            }
          : r,
      ),
    })
  },
  resolveRequest: (requestId, resolved) => {
    set({
      requests: get().requests.map(r =>
        r.id === requestId ? { ...r, status: resolved ? 'resolved' : 'not_resolved' } : r,
      ),
    })
  },
  reopenRequest: requestId => {
    set({
      requests: get().requests.map(r => (r.id === requestId ? { ...r, status: 'in_progress' } : r)),
    })
  },
}))
