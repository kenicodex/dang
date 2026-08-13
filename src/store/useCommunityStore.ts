import { create } from './zustand'

export interface CommunityState {
  joinedSpaceIds: string[]
  joinSpace: (id: string) => void
  leaveSpace: (id: string) => void
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  joinedSpaceIds: [],
  joinSpace: id => {
    if (get().joinedSpaceIds.includes(id)) return
    set({ joinedSpaceIds: [...get().joinedSpaceIds, id] })
  },
  leaveSpace: id => set({ joinedSpaceIds: get().joinedSpaceIds.filter(spaceId => spaceId !== id) }),
}))
