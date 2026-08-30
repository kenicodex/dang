import { Stack } from 'expo-router'

export default function HelpLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="topic/[id]" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="request-submitted" />
      <Stack.Screen name="requests" />
      <Stack.Screen name="request/[id]" />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  )
}
