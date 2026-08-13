export function generateId(prefix = ''): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '')
      : Math.random().toString(36).slice(2) + Date.now().toString(36)
  return prefix ? `${prefix}_${rand}` : rand
}

export function randomToken(bytes = 32): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(bytes)
    crypto.getRandomValues(arr)
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
  }
  let s = ''
  for (let i = 0; i < bytes * 2; i++) s += Math.floor(Math.random() * 16).toString(16)
  return s
}

export function generateAnonymousHandle(seed?: string, length = 12): string {
  const adjectives = [
    'Calm', 'Brave', 'Kind', 'Warm', 'Soft', 'Bright', 'Gentle', 'Quiet',
    'Sweet', 'True', 'Royal', 'Wild', 'Bold', 'Deep', 'Lucky', 'Wise',
  ]
  const nouns = [
    'Spirit', 'Flower', 'Sunrise', 'Ocean', 'Forest', 'Star', 'Mountain',
    'Moon', 'River', 'Cloud', 'Rain', 'Dream', 'Feather', 'Harvest', 'Pearl',
  ]
  const hash = seed ? simpleHash(seed) : Math.floor(Math.random() * 1e9)
  const adj = adjectives[hash % adjectives.length]
  const noun = nouns[(hash >> 4) % nouns.length]
  const num = 100 + (hash % 900)
  const h = `${adj}${noun}${num}`
  return length > 0 ? h.slice(0, length) : h
}

function simpleHash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}
