import { Text, View } from "react-native"
import profileStyles from "@/styles/profile.styles";
import { useAuthStore } from "@/store/authStore";
import { formatMemberSince } from "@/lib/utils";
import { Image } from "expo-image";

const ProfileHeader = () => {
    const { user } = useAuthStore();

    if (!user) {
        return null;
    }

    const getMemberSinceText = () => {
        if (!user?.createdAt) {
            return 'Date not available';
        }

        try {
            const formattedDate = formatMemberSince(user.createdAt);
            return formattedDate;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    return (
        <View style={profileStyles.profileHeader}>
            <Image
                source={{ uri: user?.profileImage }}
                style={profileStyles.profileImage}
                contentFit="cover"
            />
            <View style={profileStyles.profileInfo}>
                <Text style={profileStyles.username}>{user?.username}</Text>
                <Text style={profileStyles.email}>{user?.email}</Text>
                <Text style={profileStyles.memberSince}>Member since: {getMemberSinceText()}</Text>
            </View>
        </View>
    )
}
export default ProfileHeader