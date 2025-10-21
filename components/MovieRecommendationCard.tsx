import { Movie } from "@/types/Movie";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";

import profileStyles from "@/styles/profile.styles";
import { Image } from "expo-image";
import Rating from "./Rating";
import { formatPublishDate, truncateText } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/COLORS";
import { apiUrl } from "@/constants/API";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

interface MovieRecommendationCardProps {
    movie: Movie;
    fetchMovies: () => void;
}

const MovieRecommendationCard = ({ movie, fetchMovies }: MovieRecommendationCardProps) => {

    const { token } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [deletingMovieId, setDeletingMovieId] = useState<string | null>(null);

    const confirmDelete = () => {
        Alert.alert(
            "Delete Recommendation",
            "Are you sure you want to delete this movie recommendation?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => handleDelete() }
            ]
        );
    }

    const handleDelete = async () => {
        setIsLoading(true);
        setDeletingMovieId(movie._id);

        try {
            const response = await fetch(`${apiUrl}/movies/${movie._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete movie");
            }
            Alert.alert("Success", "Movie recommendation deleted successfully.");
            // Optionally, you can add a callback or state update here to remove the movie from the list in the UI
            fetchMovies();

        } catch (error) {
            console.error("Error deleting movie:", error);
            Alert.alert("Error", "An error occurred while deleting the movie. Please try again.");
        } finally {
            setIsLoading(false);
            setDeletingMovieId(null);
        }
    }

    if (isLoading) {
        return <ActivityIndicator size="small" color={COLORS.primary} />;
    }

    return (
        <View style={profileStyles.movieItem}>
            <Image source={{ uri: movie.image }} style={profileStyles.movieImage} />
            <View style={profileStyles.movieInfo}>
                <Text style={profileStyles.movieTitle}>{movie.title} ({movie.releaseYear})</Text>
                <View style={profileStyles.ratingContainer}>
                    {/* Assuming a Rating component exists */}
                    <Rating rating={movie.rating} />
                </View>
                {movie.caption ? <Text style={profileStyles.movieCaption}>{truncateText(movie.caption, 80)}</Text> : null}
                <Text style={profileStyles.movieDate}>Shared on: {formatPublishDate(movie.createdAt)}</Text>
            </View>

            <TouchableOpacity style={profileStyles.deleteButton} onPress={confirmDelete}>
                {deletingMovieId === movie._id ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="trash-outline" size={24} color={COLORS.primary} />}
            </TouchableOpacity>
        </View>
    )
}
export default MovieRecommendationCard