import { useEffect, useState } from 'react'

export function useCountdown(targetDate: Date) {
  const [remainingMs, setRemainingMs] = useState(() => targetDate.getTime() - Date.now())

  useEffect(() => {
    const timer = setInterval(() => setRemainingMs(targetDate.getTime() - Date.now()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isDone: remainingMs <= 0,
  }
}
