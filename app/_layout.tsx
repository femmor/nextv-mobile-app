import { SafeScreen } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'RobotoMono-Regular': require('@/assets/fonts/RobotoMono-Regular.ttf'),
    'Rowdies-Regular': require('@/assets/fonts/Rowdies-Regular.ttf'),
  })

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Check if the current user is authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle navigation based on authentication status
  useEffect(() => {
    // Only navigate after fonts are loaded and layout is ready
    if (!fontsLoaded) return;

    // Determine if the user is currently in an auth screen
    const inAuthScreen = (segments as string[]).includes("(auth)");

    // Redirect based on authentication status and current screen
    if (!isAuthenticated && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isAuthenticated && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, router, fontsLoaded]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
