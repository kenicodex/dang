import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
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
  );
}
