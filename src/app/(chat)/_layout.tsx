import { Stack } from 'expo-router'

export default function ChatDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="calls" />
      <Stack.Screen name="thread/[id]" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="session/[id]" />
      <Stack.Screen name="media/[id]" />
      <Stack.Screen name="call/[id]" options={{ animation: 'fade' }} />
    </Stack>
  )
}
