import { Platform, Dimensions } from 'react-native';

export const getDeviceInfo = () => {
    const { width, height } = Dimensions.get('window');
    const isTablet = width >= 768;
    const isIpad = Platform.OS === 'ios' && isTablet;

    return {
        isTablet,
        isIpad,
        width,
        height,
        platform: Platform.OS,
        isLandscape: width > height,
    };
}; export const getResponsiveDimensions = () => {
    const { isTablet, width } = getDeviceInfo();

    return {
        maxWidth: isTablet ? Math.min(400, width * 0.7) : width * 0.9,
        horizontalPadding: isTablet ? 40 : 20,
        buttonHeight: isTablet ? 54 : 48,
        fontSize: {
            title: isTablet ? 28 : 24,
            subtitle: isTablet ? 18 : 16,
            body: isTablet ? 17 : 15,
            button: isTablet ? 18 : 16,
        }
    };
};