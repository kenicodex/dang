import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ToastHost } from '@/components/ui/Toast';
import { queryClient } from '@/api/queryClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <ToastHost />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(account)" />
          <Stack.Screen name="(chat)" />
          <Stack.Screen name="(circles)" />
          <Stack.Screen name="(community)" />
          <Stack.Screen name="(events)" />
          <Stack.Screen name="(founder)" />
          <Stack.Screen name="(learning)" />
          <Stack.Screen name="(lifestyle)" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
