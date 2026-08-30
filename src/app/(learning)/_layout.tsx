import { Stack } from 'expo-router'

export default function LearningLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="lesson/[id]" />
      <Stack.Screen name="sessions" />
      <Stack.Screen name="session/[id]" />
      <Stack.Screen name="certificate/[id]" />
      <Stack.Screen name="replays" />
    </Stack>
  )
}
