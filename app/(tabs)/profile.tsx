import { View, Text, TouchableOpacity } from 'react-native'
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Movie } from '@/types/Movie';

import profileStyles from '@/styles/profile.styles';
import { useRouter } from 'expo-router';
import { apiUrl } from '@/constants/API';
import { LogoutButton, ProfileHeader } from '@/components';

export default function ProfileScreen() {
    const { logout, token } = useAuthStore();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const router = useRouter();

    const fetchMovies = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await fetch(`${apiUrl}/movies/recommendations`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch movies');
            }

            setMovies(data.recommendations);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    return (
        <View style={profileStyles.container}>
            <ProfileHeader />
            <LogoutButton />
        </View>
    )
}