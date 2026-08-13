import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'

type DropPhase = 'member-only' | 'public' | 'ended'

interface DropCountdownProps {
  phase: DropPhase
  targetDate: Date
  onPhaseChange?: (phase: DropPhase) => void
}

function formatDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60
  return { days, hours, mins, secs }
}

export function DropCountdown({ phase, targetDate, onPhaseChange }: DropCountdownProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = targetDate.getTime() - now
  const t = formatDuration(diff)

  const tone = phase === 'member-only' ? 'success' : phase === 'public' ? 'info' : 'default'
  const phaseLabel =
    phase === 'member-only' ? '🌟 Members-Only Window' :
    phase === 'public' ? '🌐 Now Public' : '✅ Drop Ended'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label={phaseLabel} tone={tone as any} />
      </View>
      <Text variant="h3" style={styles.title}>
        {phase === 'member-only' ? 'Members Exclusive' : phase === 'public' ? 'Public Access' : 'Drop Complete'}
      </Text>
      {phase !== 'ended' && (
        <View style={styles.grid}>
          <TimeBox label="Days" value={String(t.days).padStart(2, '0')} />
          <TimeBox label="Hours" value={String(t.hours).padStart(2, '0')} />
          <TimeBox label="Mins" value={String(t.mins).padStart(2, '0')} />
          <TimeBox label="Secs" value={String(t.secs).padStart(2, '0')} />
        </View>
      )}
    </View>
  )
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxNum}>{value}</Text>
      <Text variant="label" style={styles.boxLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  box: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  boxNum: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  boxLabel: {
    color: '#94A3B8',
    fontSize: 10,
  },
})
