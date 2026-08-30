import { create } from './zustand'

export interface EventsState {
  rsvpedEventIds: string[]
  savedEventIds: string[]
  cancelledEventIds: string[]
  cancelReasons: Record<string, string>
  reminderEnabled: Record<string, boolean>
  rsvp: (id: string) => void
  cancelRsvp: (id: string, reason: string) => void
  toggleSave: (id: string) => void
  toggleReminder: (id: string) => void
}

export const useEventsStore = create<EventsState>((set, get) => ({
  rsvpedEventIds: [],
  savedEventIds: [],
  cancelledEventIds: [],
  cancelReasons: {},
  reminderEnabled: {},
  rsvp: id => {
    if (get().rsvpedEventIds.includes(id)) return
    set({
      rsvpedEventIds: [...get().rsvpedEventIds, id],
      cancelledEventIds: get().cancelledEventIds.filter(eventId => eventId !== id),
      reminderEnabled: { ...get().reminderEnabled, [id]: true },
    })
  },
  cancelRsvp: (id, reason) =>
    set({
      rsvpedEventIds: get().rsvpedEventIds.filter(eventId => eventId !== id),
      cancelledEventIds: [...get().cancelledEventIds, id],
      cancelReasons: { ...get().cancelReasons, [id]: reason },
    }),
  toggleSave: id => {
    const saved = get().savedEventIds
    set({
      savedEventIds: saved.includes(id) ? saved.filter(eventId => eventId !== id) : [...saved, id],
    })
  },
  toggleReminder: id =>
    set({ reminderEnabled: { ...get().reminderEnabled, [id]: !get().reminderEnabled[id] } }),
}))
