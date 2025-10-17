import { View, Text, TouchableOpacity } from 'react-native'
import profileStyles from '@/styles/profile.styles';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
    const { logout } = useAuthStore();

    return (
        <View style={profileStyles.container}>
            <Text>ProfileScreen</Text>
            <TouchableOpacity style={profileStyles.logoutButton} onPress={logout}>
                <Text style={profileStyles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}