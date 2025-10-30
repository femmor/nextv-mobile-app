// Validate and export the API URL
const getApiUrl = (): string => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL;

    if (!url) {
        console.error('EXPO_PUBLIC_BACKEND_URL is not configured');
        // Fallback to production URL if env var is not set
        return 'https://nextv-backend.onrender.com/api';
    }

    // Validate URL format
    try {
        new URL(url);
        return url;
    } catch {
        console.error('Invalid API URL format:', url);
        // Fallback to production URL if format is invalid
        return 'https://nextv-backend.onrender.com/api';
    }
};

export const apiUrl = getApiUrl();

// Export a function to check API health
export const checkApiHealth = async (timeoutMs: number = 10000): Promise<boolean> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
};