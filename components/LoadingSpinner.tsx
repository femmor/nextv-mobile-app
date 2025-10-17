import COLORS from "@/constants/COLORS"
import { ActivityIndicator, View } from "react-native"

const LoadingSpinner = ({ size }: { size: "small" | "large" }) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background
            }}
        >
            <ActivityIndicator size={size} color={COLORS.primary} />
        </View>
    )
}
export default LoadingSpinner