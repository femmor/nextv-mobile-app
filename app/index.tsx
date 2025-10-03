import { useAuthStore } from "@/store/authStore";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

  const { user, checkAuth, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{user ? `Welcome, ${user.username}` : "Please log in"}</Text>
      {isAuthenticated && <TouchableOpacity onPress={logout}>
        <Text>Log Out</Text>
      </TouchableOpacity>}
      <Link href="/(auth)">Go to Login Screen</Link>
      <Link href="/(auth)/signup">Go to Signup Screen</Link>
    </View>
  );
}
