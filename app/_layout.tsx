import { SafeScreen } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Check if the current user is authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle navigation based on authentication status
  useEffect(() => {
    // Determine if the user is currently in an auth screen
    const inAuthScreen = (segments as string[]).includes("(auth)");

    // Redirect based on authentication status and current screen
    if (!isAuthenticated && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isAuthenticated && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, router]);

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
