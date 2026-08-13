import type { Event, EventRSVP, LiveRoomState, EventRecording } from '@/types/events'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export type RSVPStatus = 'yes' | 'no' | 'maybe'

export interface EventServiceInterface {
  listEvents(auth: AuthContext, params?: PaginationParams & { past?: boolean }): Promise<Paginated<Event>>
  getEvent(auth: AuthContext, eventId: string): Promise<Event>
  setRSVP(auth: AuthContext, eventId: string, status: RSVPStatus): Promise<EventRSVP>
  listRSVPs(auth: AuthContext, eventId: string): Promise<EventRSVP[]>
  joinLiveRoom(auth: AuthContext, eventId: string): Promise<{
    roomToken: string
    roomUrl: string
    participantId: string
    isHost: boolean
  }>
  getLiveRoomState(auth: AuthContext, eventId: string): Promise<LiveRoomState>
  listRecordings(auth: AuthContext, eventId: string): Promise<EventRecording[]>
  addEventToCalendar(auth: AuthContext, eventId: string): Promise<{ icsUrl?: string }>
  getWaitlistPosition(auth: AuthContext, eventId: string): Promise<{ position: number | null; capacity: number }>
}

export const EventService: EventServiceInterface = {
  async listEvents(_auth, _params) {
    throw new Error('EventService.listEvents not implemented')
  },
  async getEvent(_auth, _eventId) {
    throw new Error('EventService.getEvent not implemented')
  },
  async setRSVP(_auth, _eventId, _status) {
    throw new Error('EventService.setRSVP not implemented')
  },
  async listRSVPs(_auth, _eventId) {
    throw new Error('EventService.listRSVPs not implemented')
  },
  async joinLiveRoom(_auth, _eventId) {
    throw new Error('EventService.joinLiveRoom not implemented — live room must run in-platform (FR-H02, no redirects)')
  },
  async getLiveRoomState(_auth, _eventId) {
    throw new Error('EventService.getLiveRoomState not implemented')
  },
  async listRecordings(_auth, _eventId) {
    throw new Error('EventService.listRecordings not implemented')
  },
  async addEventToCalendar(_auth, _eventId) {
    throw new Error('EventService.addEventToCalendar not implemented')
  },
  async getWaitlistPosition(_auth, _eventId) {
    throw new Error('EventService.getWaitlistPosition not implemented')
  },
}
