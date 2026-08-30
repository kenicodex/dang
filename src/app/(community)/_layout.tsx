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
      <Stack.Screen name="create-post" />
      <Stack.Screen name="channels" />
      <Stack.Screen name="channel/[id]" />
      <Stack.Screen name="thread/[id]" />
      <Stack.Screen name="sisters" />
      <Stack.Screen name="sisters-search" />
      <Stack.Screen name="sisters-suggestions" />
      <Stack.Screen name="sisters-nearby" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="profile/[id]/spaces" />
      <Stack.Screen name="profile/[id]/followers" />
      <Stack.Screen name="profile/[id]/following" />
      <Stack.Screen name="search" />
    </Stack>
  )
}
