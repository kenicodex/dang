import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { findSession, LiveRoomView, WaitingRoomView, ReplayPlayerView, roomColors } from '@/components/learning'

export default function LiveSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [sessionStarted, setSessionStarted] = useState(false)

  const session = findSession(id)

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: roomColors.bg, padding: 20 }}>
        <Text style={{ color: roomColors.text }}>Session not found.</Text>
      </SafeAreaView>
    )
  }

  const goBack = () => router.back()

  if (session.status === 'live' || sessionStarted) {
    return <LiveRoomView session={session} onLeave={goBack} />
  }

  if (session.status === 'upcoming') {
    return <WaitingRoomView session={session} onLeave={goBack} onReady={() => setSessionStarted(true)} />
  }

  return <ReplayPlayerView session={session} onClose={goBack} />
}
