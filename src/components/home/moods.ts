export type MoodKey = 'great' | 'good' | 'okay' | 'low' | 'grateful'

export interface Mood {
  key: MoodKey
  emoji: string
  label: string
  message: string
}

export const MOODS: Mood[] = [
  { key: 'great', emoji: '😊', label: 'great', message: 'Great is good. keep going!' },
  { key: 'good', emoji: '🙂', label: 'good', message: 'Good is more than enough today.' },
  { key: 'okay', emoji: '😐', label: 'okay', message: 'Okay counts. Keep showing up.' },
  { key: 'low', emoji: '😔', label: 'low', message: "Low days pass. You're not alone in this." },
  { key: 'grateful', emoji: '🤗', label: 'grateful', message: 'Gratitude looks good on you.' },
]
