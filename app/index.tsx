import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home Screen</Text>
      <Link href="/(auth)">Go to Login Screen</Link>
      <Link href="/(auth)/signup">Go to Signup Screen</Link>
    </View>
  );
}
