import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Movie } from '@/types/Movie';

import profileStyles from '@/styles/profile.styles';
import { useRouter } from 'expo-router';
import { apiUrl } from '@/constants/API';
import { LogoutButton, MovieRecommendationCard, ProfileHeader } from '@/components';

export default function ProfileScreen() {
    const { token } = useAuthStore();
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

            {/* Your Recommendations */}
            <View style={profileStyles.moviesHeader}>
                <Text style={profileStyles.moviesTitle}>Your Recommendations <Ionicons name="film-outline" size={16} color="gray" /></Text>
                <Text style={profileStyles.moviesCount}>{movies.length} movies</Text>
            </View>

            <FlatList
                data={movies}
                keyExtractor={(item: Movie) => item._id}
                renderItem={({ item }) => (
                    <MovieRecommendationCard movie={item} fetchMovies={fetchMovies} />
                )}
                refreshing={isRefreshing}
                onRefresh={fetchMovies}
                ListEmptyComponent={() => (
                    <View style={profileStyles.emptyContainer}>
                        <Ionicons name="sad-outline" size={48} color="gray" />
                        <Text style={profileStyles.emptyText}>
                            {isLoading ? 'Loading recommendations...' : 'No recommendations yet.'}
                        </Text>
                        <TouchableOpacity style={profileStyles.addButton} onPress={() => router.push('/create')}>
                            <Text style={profileStyles.addButtonText}>Add Your First Movie</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={profileStyles.moviesList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}