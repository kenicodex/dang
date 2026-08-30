import { create } from './zustand'
import { CHAT_MESSAGES } from '@/components/chat/chat.data'
import type { ChatMessage } from '@/types/chat'

export interface ChatState {
  messagesByThread: Record<string, ChatMessage[]>
  getMessages: (threadId: string) => ChatMessage[]
  sendMessage: (threadId: string, content: string, quoted?: string) => void
  deleteMessage: (threadId: string, messageId: string) => void
  togglePinMessage: (threadId: string, messageId: string) => void
}

let nextMessageId = 1000
const EMPTY_MESSAGES: ChatMessage[] = []

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByThread: CHAT_MESSAGES,
  getMessages: threadId => get().messagesByThread[threadId] ?? EMPTY_MESSAGES,
  sendMessage: (threadId, content, quoted) => {
    const message: ChatMessage = {
      id: `msg-${nextMessageId++}`,
      threadId,
      fromMe: true,
      kind: 'text',
      content,
      quoted,
      time: 'Now',
      status: 'sent',
    }
    set({
      messagesByThread: {
        ...get().messagesByThread,
        [threadId]: [...get().getMessages(threadId), message],
      },
    })
  },
  deleteMessage: (threadId, messageId) => {
    set({
      messagesByThread: {
        ...get().messagesByThread,
        [threadId]: get().getMessages(threadId).filter(m => m.id !== messageId),
      },
    })
  },
  togglePinMessage: (threadId, messageId) => {
    set({
      messagesByThread: {
        ...get().messagesByThread,
        [threadId]: get().getMessages(threadId).map(m =>
          m.id === messageId ? { ...m, isPinned: !m.isPinned } : m,
        ),
      },
    })
  },
}))
