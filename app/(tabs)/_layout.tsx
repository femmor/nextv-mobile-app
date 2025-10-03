
import COLORS from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={focused ? COLORS.primary : color}
                        />
                    ),
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.placeholderText,
                    headerShadowVisible: false,
                    tabBarStyle: {
                        backgroundColor: COLORS.cardBackground,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.border,
                        paddingTop: 5,
                        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                        height: 60 + insets.bottom,
                    },

                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "Add Movie",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="add-circle-outline"
                            size={size}
                            color={focused ? COLORS.primary : color}
                        />
                    ),
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.placeholderText,
                    headerShadowVisible: false,
                    tabBarStyle: {
                        backgroundColor: COLORS.cardBackground,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.border,
                        paddingTop: 5,
                        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                        height: 60 + insets.bottom,
                    },
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={focused ? COLORS.primary : color}
                        />
                    ),
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.placeholderText,
                    headerShadowVisible: false,
                    tabBarStyle: {
                        backgroundColor: COLORS.cardBackground,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.border,
                        paddingTop: 5,
                        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                        height: 60 + insets.bottom,
                    },
                }}
            />
        </Tabs>
    );
}
