import { Stack } from 'expo-router'

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/rsvp" />
      <Stack.Screen name="[id]/venue" />
      <Stack.Screen name="[id]/cancel" />
      <Stack.Screen name="[id]/room" />
    </Stack>
  )
}
