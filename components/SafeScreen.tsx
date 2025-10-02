import COLORS from '@/constants/COLORS'
import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SafeScreen({ children }: { children: ReactNode }) {
    // Get the safe area insets for the device
    const insets = useSafeAreaInsets()

    return (
        <View style={[styles.container, {
            paddingTop: insets.top,
        }]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
})
