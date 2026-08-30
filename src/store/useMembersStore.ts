import { create } from './zustand'

export interface MembersState {
  followingIds: string[]
  recentSearchIds: string[]
  isFollowing: (id: string) => boolean
  follow: (id: string) => void
  unfollow: (id: string) => void
  toggleFollow: (id: string) => void
  addRecentSearch: (id: string) => void
  removeRecentSearch: (id: string) => void
  clearRecentSearches: () => void
}

const DEFAULT_FOLLOWING_IDS = ['mem-aisha', 'mem-tobenna', 'mem-maya', 'mem-kemi', 'mem-chidera', 'mem-ayo']
const DEFAULT_RECENT_SEARCH_IDS = ['mem-aisha', 'mem-tobenna', 'mem-maya', 'mem-kemi', 'mem-chidera']

export const useMembersStore = create<MembersState>((set, get) => ({
  followingIds: DEFAULT_FOLLOWING_IDS,
  recentSearchIds: DEFAULT_RECENT_SEARCH_IDS,
  isFollowing: id => get().followingIds.includes(id),
  follow: id => {
    if (get().followingIds.includes(id)) return
    set({ followingIds: [...get().followingIds, id] })
  },
  unfollow: id => set({ followingIds: get().followingIds.filter(memberId => memberId !== id) }),
  toggleFollow: id => {
    if (get().followingIds.includes(id)) {
      get().unfollow(id)
    } else {
      get().follow(id)
    }
  },
  addRecentSearch: id => {
    const withoutId = get().recentSearchIds.filter(memberId => memberId !== id)
    set({ recentSearchIds: [id, ...withoutId].slice(0, 10) })
  },
  removeRecentSearch: id => set({ recentSearchIds: get().recentSearchIds.filter(memberId => memberId !== id) }),
  clearRecentSearches: () => set({ recentSearchIds: [] }),
}))
