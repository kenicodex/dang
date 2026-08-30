import { Stack } from 'expo-router'

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
      <Stack.Screen name="leaderboard" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="change-plan" />
      <Stack.Screen name="change-plan-success" />
      <Stack.Screen name="manage-subscriptions" />
      <Stack.Screen name="payment-history" />
      <Stack.Screen name="billing" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="security" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="data" />
      <Stack.Screen name="language" />
      <Stack.Screen name="report-problem" />
      <Stack.Screen name="help" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="delete-account" />
    </Stack>
  )
}
