import { Stack } from 'expo-router'

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="billing" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="security" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="data" />
    </Stack>
  )
}
