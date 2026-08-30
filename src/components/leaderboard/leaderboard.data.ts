export interface LeaderboardEntry {
  id: string
  displayName: string
  avatarUrl: string
  points: number
}

export const LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-amara',
    displayName: 'Amara Johnson',
    avatarUrl: 'https://picsum.photos/seed/leaderboard-amara/200/200',
    points: 89,
  },
  {
    id: 'lb-aisha',
    displayName: 'Aisha Aminu',
    avatarUrl: 'https://picsum.photos/seed/leaderboard-aisha/200/200',
    points: 88,
  },
  {
    id: 'lb-freedaus',
    displayName: 'Freedaus Williams',
    avatarUrl: 'https://picsum.photos/seed/leaderboard-freedaus/200/200',
    points: 87,
  },
  {
    id: 'lb-vivian',
    displayName: 'Vivian Amhanosi',
    avatarUrl: 'https://picsum.photos/seed/leaderboard-vivian/200/200',
    points: 84,
  },
]

export const YOUR_MEMBER_ID = 'lb-amara'
export const TOTAL_MEMBERS = 236
