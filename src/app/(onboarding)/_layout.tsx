import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="name" />
      <Stack.Screen name="photo" />
      <Stack.Screen name="location" />
      <Stack.Screen name="field" />
      <Stack.Screen name="faith" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="welcome" />
    </Stack>
  )
}
