import { apiUrl } from '@/constants/API';
import { useAuthStore } from '@/store/authStore';
import { Movie } from '@/types/Movie';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image';
import homeStyles from '@/styles/home.styles';
import { LoadingSpinner, Rating } from '@/components';
import { formatPublishDate } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/COLORS';

export default function HomeScreen() {
    const { token, logout } = useAuthStore();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchMovies = useCallback(async (pageNum = 1, refresh = false) => {
        try {
            if (refresh) {
                setIsRefreshing(true);
            } else if (pageNum === 1) {
                setIsLoading(true);
            }

            const response = await fetch(`${apiUrl}/movies?page=${pageNum}&limit=2`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                logout();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch movies');
            }

            setMovies(prevMovies => {
                if (refresh || pageNum === 1) {
                    return data.movies;
                } else {
                    // Prevent duplicates by checking if movie ID already exists
                    const existingIds = new Set(prevMovies.map(movie => movie._id));
                    const newMovies = data.movies.filter((movie: Movie) => !existingIds.has(movie._id));
                    return [...prevMovies, ...newMovies];
                }
            });

            setHasMore(pageNum < data.totalPages);
            setPage(pageNum);

        } catch (error) {
            console.log("Error fetching movies", error)
        } finally {
            if (refresh) {
                setIsRefreshing(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [token, logout]);


    useEffect(() => {
        fetchMovies(1, false);
    }, [fetchMovies]);

    const handleLoadMore = async () => {
        if (hasMore && !isLoading && !isRefreshing) {
            await fetchMovies(page + 1);
        }
    };

    // Handle pull-to-refresh
    const handleRefresh = async () => {
        setPage(1);
        setHasMore(true);
        await fetchMovies(1, true);
    };

    // Render each movie item
    const renderItem = ({ item }: { item: Movie }) => (
        <View style={homeStyles.movieCard}>
            <View style={homeStyles.movieHeader}>
                <View style={homeStyles.userInfo}>
                    <Image source={{ uri: item.user.profileImage }} style={homeStyles.avatar} contentFit='cover' />
                    <Text style={homeStyles.username}>{item.user.username}</Text>
                </View>
            </View>

            <View style={homeStyles.movieImageContainer}>
                <Image source={{ uri: item.image }} style={homeStyles.movieImage} />
            </View>


            <View style={homeStyles.movieDetails}>
                <Text style={homeStyles.movieTitle}>{item.title} ({item.releaseYear})</Text>
                <View style={homeStyles.ratingContainer}>
                    <Rating rating={item.rating} />
                </View>
                {item.director ? <Text style={homeStyles.directorText}><Text style={homeStyles.bold}>Directed by:</Text> {item.director}</Text> : null}
                {item.caption ? <Text style={homeStyles.caption}>{item.caption}</Text> : null}
            </View>

            <View>
                <Text style={homeStyles.date}>Shared on: {formatPublishDate(item.createdAt)}</Text>
            </View>
        </View>
    )

    // Show loading spinner while fetching data
    if (isLoading) return <LoadingSpinner size="large" />

    return (
        <View style={homeStyles.container}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={homeStyles.listContainer}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListHeaderComponent={<View style={homeStyles.header}>
                    <Text style={homeStyles.headerTitle}><Ionicons
                        name="film" size={24} color="black"
                    /> Favorite TV </Text>
                    <Text style={homeStyles.headerSubtitle}>
                        Discover and share your favorite movies with the community!
                    </Text>
                </View>}
                ListEmptyComponent={
                    <View style={homeStyles.emptyContainer}>
                        <Ionicons name="film-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={homeStyles.emptyText}>No recommendations yet.</Text>
                        <Text style={homeStyles.emptySubtext}>Be the first to share your favorite movie!</Text>
                    </View>
                }
                ListFooterComponent={
                    hasMore && movies.length > 0 && !isRefreshing ? (
                        <View style={{ paddingVertical: 20 }}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        </View>
                    ) : null
                }
            />
        </View>
    )
}