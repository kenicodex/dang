import { Stack } from 'expo-router'

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="feed" />
      <Stack.Screen name="create-post" options={{ presentation: 'modal' }} />
      <Stack.Screen name="channels" />
      <Stack.Screen name="channel/[id]" />
      <Stack.Screen name="thread/[id]" />
      <Stack.Screen name="search" />
    </Stack>
  )
}
