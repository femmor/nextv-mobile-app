
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import createStyles from "@/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/COLORS";
import { Rating } from "@/components";

import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/authStore";
import { apiUrl } from "@/constants/API";


export default function CreateScreen() {
    const [title, setTitle] = useState<string>("");
    const [caption, setCaption] = useState<string>("");
    const [director, setDirector] = useState<string>("");
    const [releaseYear, setReleaseYear] = useState<number | null>(null);
    const [image, setImage] = useState<string>("");
    const [imageBase64, setImageBase64] = useState<string>(""); // To display the selected image
    const [rating, setRating] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const router = useRouter();

    const { token } = useAuthStore();

    // Function for picking image from gallery
    const pickImage = async () => {
        try {
            // Request permission to access media library
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to make this work!");
                    return;
                }

            };

            // launch image library to pick image
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.3, // More aggressive compression
                base64: true, // Request base64 directly
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);

                // Set base64 data (now always available since we requested it)
                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64);
                } else {
                    Alert.alert("Error", "Failed to process image. Please try again.");
                }
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while picking the image.");
            console.error("ImagePicker Error: ", error);
        }
    }

    const handleSubmit = async () => {
        // Client side validation
        if (!title || !director || !releaseYear || !rating || !image) {
            Alert.alert("Missing Fields", "Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            // Check base64 image size (rough estimate: base64 is ~1.37x original size)
            const estimatedSizeInBytes = (imageBase64.length * 3) / 4;
            const estimatedSizeInMB = estimatedSizeInBytes / (1024 * 1024);

            if (estimatedSizeInMB > 10) { // Limit to 10MB
                Alert.alert("Image Too Large", "Please select a smaller image (less than 10MB).");
                setIsLoading(false);
                return;
            }

            // Get file extension from image URI or default to jpeg
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const imageType = fileType ? `image/${fileType.toLowerCase()}` : 'image/jpeg';
            const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

            // Prepare payload
            const payload = {
                title,
                caption,
                director,
                releaseYear,
                image: imageDataUrl,
                rating,
            };

            // Send POST request to backend
            const response = await fetch(`${apiUrl}/movies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 413) {
                    throw new Error("Image file is too large. Please select a smaller image or reduce quality.");
                }
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to share movie");
            }

            // Clear form fields
            setTitle("");
            setCaption("");
            setDirector("");
            setReleaseYear(null);
            setImage("");
            setImageBase64("");
            setRating(null);

            // Show success alert
            Alert.alert("Success", "Movie shared successfully!");
            // Navigate back to home screen
            router.push("/(tabs)");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while sharing the movie.";
            Alert.alert("Error", errorMessage);
            console.error("Submit Error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={createStyles.scrollViewStyle}>
                <View style={createStyles.card}>
                    <View style={createStyles.header}>
                        <Text style={createStyles.title}>Add a New Movie</Text>
                        <Text style={createStyles.subtitle}>Share your favorite movie with others.</Text>
                    </View>
                    <View style={createStyles.form}>
                        {/* Movie Title Field */}
                        <View style={createStyles.formGroup}>
                            <Text style={createStyles.label}>Movie Title</Text>
                            <View style={createStyles.inputContainer}>
                                <Ionicons name="film-outline" size={20} color={COLORS.textSecondary} style={createStyles.inputIcon} />
                                <TextInput
                                    style={createStyles.input}
                                    placeholder="Enter movie title"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        {/* Director Field */}
                        <View style={createStyles.formGroup}>
                            <Text style={createStyles.label}>Director</Text>
                            <View style={createStyles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={createStyles.inputIcon} />
                                <TextInput
                                    style={createStyles.input}
                                    placeholder="Enter director's name"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={director}
                                    onChangeText={setDirector}
                                />
                            </View>
                        </View>

                        {/* Release Year Field */}
                        <View style={createStyles.formGroup}>
                            <Text style={createStyles.label}>Release Year</Text>
                            <View style={createStyles.inputContainer}>
                                <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} style={createStyles.inputIcon} />
                                <TextInput
                                    style={createStyles.input}
                                    placeholder="Enter release year"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={releaseYear ? releaseYear.toString() : ""}
                                    onChangeText={(text) => setReleaseYear(Number(text))}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Rating Field */}
                        <View style={createStyles.formGroup}>
                            <Text style={createStyles.label}>Your Rating</Text>
                            <Rating rating={rating} setRating={setRating} isCreating />
                        </View>

                        {/* Image URL Field */}
                        <View style={createStyles.formGroup}>
                            <Text style={createStyles.label}>Movie Image</Text>
                            <TouchableOpacity style={createStyles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image source={{ uri: image }} style={createStyles.previewImage} />
                                ) : (
                                    <View style={createStyles.placeholderContainer}>
                                        <Ionicons name="image-outline" size={40} color={COLORS.placeholderText} />
                                        <Text style={createStyles.placeholderText}>Tap to select an image</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Caption Field */}
                        <View style={createStyles.formGroup}>
                            <Text style={createStyles.label}>Caption</Text>
                            <TextInput
                                style={createStyles.textArea}
                                placeholder="Write a short caption about this movie"
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={[createStyles.button, {
                            backgroundColor: isLoading ? COLORS.disabledBackground : COLORS.primary
                        }]} onPress={handleSubmit} disabled={isLoading}>
                            {isLoading ? (<ActivityIndicator color={COLORS.placeholderText} />) : (<>
                                <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} style={createStyles.buttonIcon} />
                                <Text style={createStyles.buttonText}>
                                    Share Movie
                                </Text>
                            </>)}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
