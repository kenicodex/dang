export type Timezone = 'WAT' | 'GMT' | 'UTC' | 'EST' | 'PST' | 'local'

export interface Duration {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function timeAgo(input: Date | string | number, now = new Date()): string {
  const date = input instanceof Date ? input : new Date(input)
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffSec < 0) return 'in the future'
  const units: Array<[number, string, string]> = [
    [60, 'second', 'seconds'],
    [60, 'minute', 'minutes'],
    [24, 'hour', 'hours'],
    [7, 'day', 'days'],
    [4, 'week', 'weeks'],
    [12, 'month', 'months'],
    [Infinity, 'year', 'years'],
  ]
  let value = diffSec
  for (const [divisor, single, plural] of units) {
    if (value < divisor) {
      const v = Math.max(1, Math.floor(value))
      return `${v} ${v === 1 ? single : plural} ago`
    }
    value = value / (divisor as number)
  }
  return 'a long time ago'
}

export function formatTime(date: Date | string, timezone: Timezone = 'WAT'): string {
  const d = date instanceof Date ? date : new Date(date)
  const tzMap: Record<Exclude<Timezone, 'local'>, string> = {
    WAT: 'Africa/Lagos',
    GMT: 'Europe/London',
    UTC: 'UTC',
    EST: 'America/New_York',
    PST: 'America/Los_Angeles',
  }
  const opts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(timezone !== 'local' ? { timeZone: tzMap[timezone] } : {}),
  }
  try {
    return new Intl.DateTimeFormat('en-GB', opts).format(d)
  } catch {
    return d.toLocaleTimeString()
  }
}

export function formatDateLong(date: Date | string, timezone: Timezone = 'WAT'): string {
  const d = date instanceof Date ? date : new Date(date)
  const tzMap: Record<Exclude<Timezone, 'local'>, string> = {
    WAT: 'Africa/Lagos',
    GMT: 'Europe/London',
    UTC: 'UTC',
    EST: 'America/New_York',
    PST: 'America/Los_Angeles',
  }
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(timezone !== 'local' ? { timeZone: tzMap[timezone] } : {}),
    }).format(d)
  } catch {
    return d.toDateString()
  }
}

export function decomposeDuration(ms: number): Duration {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
