import { Dispatch } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import createStyles from "@/styles/create.styles";
import COLORS from "@/constants/COLORS";

interface RatingProps {
    rating: number | null;
    setRating: Dispatch<React.SetStateAction<number | null>>
}

const Rating = ({ rating, setRating }: RatingProps) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <TouchableOpacity key={i} onPress={() => setRating(i)} style={createStyles.starButton}>
                <Ionicons
                    name={i <= (rating || 0) ? "star" : "star-outline"}
                    size={32}
                    color={i <= (rating || 0) ? COLORS.rating : COLORS.placeholderText}
                />
            </TouchableOpacity>
        );
    }
    return <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>{stars}</View>;
}

export default Rating;