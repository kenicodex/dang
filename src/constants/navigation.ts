import type { Tabs } from 'expo-router'

export type TabKey = 'index' | 'explore' | 'feed' | 'circles' | 'learning' | 'events' | 'account'

export interface NavTabDefinition {
  key: TabKey | (string & {})
  route: string
  title: string
  tabBarLabel: string
  icon: { name: string; family: string }
  requiresAuth: boolean
  requiresTier?: 'PREMIUM' | 'VIP' | 'FOUNDERS_CIRCLE'
  group: 'community' | 'circles' | 'learning' | 'events' | 'founder' | 'account' | 'root'
}

export const navTabs: NavTabDefinition[] = [
  {
    key: 'index',
    route: '/home',
    title: 'Home',
    tabBarLabel: 'Home',
    icon: { name: 'home', family: 'Ionicons' },
    requiresAuth: false,
    group: 'root',
  },
  {
    key: 'feed',
    route: '/(community)/feed',
    title: 'Feed',
    tabBarLabel: 'Feed',
    icon: { name: 'chatbubbles', family: 'Ionicons' },
    requiresAuth: true,
    group: 'community',
  },
  {
    key: 'circles',
    route: '/(circles)',
    title: 'Circles',
    tabBarLabel: 'Circles',
    icon: { name: 'people', family: 'Ionicons' },
    requiresAuth: true,
    group: 'circles',
  },
  {
    key: 'learning',
    route: '/(learning)',
    title: 'Learn',
    tabBarLabel: 'Learn',
    icon: { name: 'school', family: 'Ionicons' },
    requiresAuth: true,
    group: 'learning',
  },
  {
    key: 'events',
    route: '/(events)',
    title: 'Events',
    tabBarLabel: 'Events',
    icon: { name: 'calendar', family: 'Ionicons' },
    requiresAuth: true,
    group: 'events',
  },
  {
    key: 'explore',
    route: '/explore',
    title: 'Explore',
    tabBarLabel: 'Explore',
    icon: { name: 'compass', family: 'Ionicons' },
    requiresAuth: false,
    group: 'root',
  },
  {
    key: 'account',
    route: '/(account)',
    title: 'Account',
    tabBarLabel: 'Account',
    icon: { name: 'person', family: 'Ionicons' },
    requiresAuth: true,
    group: 'account',
  },
]

export function visibleTabsForUser(opts: {
  isAuthenticated: boolean
  tier?: string | null
}): NavTabDefinition[] {
  return navTabs.filter(t => {
    if (t.requiresAuth && !opts.isAuthenticated) return false
    if (t.requiresTier && opts.tier !== t.requiresTier) return false
    return true
  })
}
