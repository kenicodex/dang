import { Stack } from 'expo-router'

export default function LifestyleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="drop/[id]" />
      <Stack.Screen name="tester/apply" />
      <Stack.Screen name="tester/selected" />
      <Stack.Screen name="tester/pending" />
      <Stack.Screen name="tester/rejected" />
      <Stack.Screen name="tester/feedback" />
    </Stack>
  )
}
