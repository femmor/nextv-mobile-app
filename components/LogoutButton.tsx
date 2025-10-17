import { Alert, Text, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import profileStyles from "@/styles/profile.styles";
import { useAuthStore } from "@/store/authStore";

const LogoutButton = () => {
    const { logout } = useAuthStore();

    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        logout();
                    }
                }
            ]
        );
    }

    return (
        <TouchableOpacity style={profileStyles.logoutButton} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={profileStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
    )
}
export default LogoutButton