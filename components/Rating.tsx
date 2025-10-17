import { Dispatch } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TouchableOpacity, View } from "react-native";

import createStyles from "@/styles/create.styles";
import COLORS from "@/constants/COLORS";

interface RatingProps {
    rating: number | null;
    setRating?: Dispatch<React.SetStateAction<number | null>>
    isCreating?: boolean;
    style?: object;
}

const Rating = ({ rating, setRating, isCreating, style }: RatingProps) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <View key={i}>
                {isCreating ? (<TouchableOpacity onPress={() => setRating && setRating(i)} style={createStyles.starButton}>
                    <Ionicons
                        name={i <= (rating || 0) ? "star" : "star-outline"}
                        size={32}
                        color={i <= (rating || 0) ? COLORS.rating : COLORS.placeholderText}
                    />
                </TouchableOpacity>) : (<Pressable style={createStyles.ratingItem}>
                    <Ionicons
                        name={i <= (rating || 0) ? "star" : "star-outline"}
                        size={20}
                        color={i <= (rating || 0) ? COLORS.rating : COLORS.placeholderText}
                    />
                </Pressable>)}
            </View>
        );
    }
    return <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 2 }} >{stars}</View>;
}

export default Rating;