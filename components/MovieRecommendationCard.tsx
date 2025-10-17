import { Movie } from "@/types/Movie";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import profileStyles from "@/styles/profile.styles";
import { Image } from "expo-image";
import Rating from "./Rating";
import { formatPublishDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/COLORS";
import { apiUrl } from "@/constants/API";
import { useAuthStore } from "@/store/authStore";

interface MovieRecommendationCardProps {
    movie: Movie;
    fetchMovies: () => void;
}

const MovieRecommendationCard = ({ movie, fetchMovies }: MovieRecommendationCardProps) => {

    const { token } = useAuthStore();

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
            // Optionally, you can add a callback or state update here to remove the movie from the list in the UI
            fetchMovies();

        } catch (error) {
            console.error("Error deleting movie:", error);
            Alert.alert("Error", "An error occurred while deleting the movie. Please try again.");
        }
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
                {movie.caption ? <Text style={profileStyles.movieCaption}>{movie.caption}</Text> : null}
                <Text style={profileStyles.movieDate}>Shared on: {formatPublishDate(movie.createdAt)}</Text>
            </View>

            <TouchableOpacity style={profileStyles.deleteButton} onPress={confirmDelete}>
                <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    )
}
export default MovieRecommendationCard