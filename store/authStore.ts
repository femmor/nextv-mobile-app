import { User } from '@/types/User';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '@/constants/API';
import { checkNetworkConnection } from '@/lib/networkUtils';
import { logger } from '@/lib/logger';
interface AuthState {
    isAuthenticated: boolean;
    token: string | null
    user: User | null;
    isLoading?: boolean;
    isCheckingAuth?: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    deleteAccount: (password: string) => Promise<{ success: boolean; message?: string }>;
    checkAuth: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    isCheckingAuth: true,
    login: async (email: string, password: string) => {
        set({ isLoading: true });

        await logger.info('Login attempt started', {
            email: email?.substring(0, 3) + '***', // Partial email for privacy
            hasPassword: !!password,
            apiUrl
        });

        // Basic client-side validation
        if (!email?.trim() || !password?.trim()) {
            set({ isLoading: false });
            await logger.warn('Login validation failed: missing credentials');
            return { success: false, message: 'Please enter both email and password.' };
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            set({ isLoading: false });
            await logger.warn('Login validation failed: invalid email format');
            return { success: false, message: 'Please enter a valid email address.' };
        }

        try {
            // Check network connectivity first
            const isConnected = await checkNetworkConnection();
            if (!isConnected) {
                set({ isLoading: false });
                return { success: false, message: 'No internet connection. Please check your network and try again.' };
            }

            // Check if API URL is configured
            if (!apiUrl) {
                throw new Error('API URL is not configured');
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim(), password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok && data.user && data.token) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);
                set({ isAuthenticated: true, token: data.token, user: data.user, isLoading: false });
                await logger.info('Login successful');
                return { success: true, message: 'Login successful!' };
            } else {
                set({ isLoading: false });
                await logger.error('Login failed', undefined, {
                    statusCode: response.status,
                    responseData: data,
                    apiResponse: response.ok
                });
                return { success: false, message: data.message || 'Login failed. Please check your credentials.' };
            }
        } catch (error: any) {
            set({ isLoading: false });
            console.error('Login error:', error);

            await logger.error('Login catch block', error, {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack,
                apiUrl
            });

            // Provide more specific error messages
            if (error.name === 'AbortError') {
                return { success: false, message: 'Connection timeout. Please check your internet connection and try again.' };
            } else if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
                return { success: false, message: 'Network error. Please check your internet connection and try again.' };
            } else if (error.message?.includes('API URL')) {
                return { success: false, message: 'Service configuration error. Please try again later.' };
            } else {
                return { success: false, message: 'An unexpected error occurred. Please try again.' };
            }
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        set({ isAuthenticated: false, token: null, user: null });
    },
    signUp: async (username, email, password) => {
        set({ isLoading: true });

        await logger.info('Signup attempt started', {
            username: username?.substring(0, 3) + '***',
            email: email?.substring(0, 3) + '***',
            hasPassword: !!password,
            apiUrl
        });

        // Basic client-side validation
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            set({ isLoading: false });
            await logger.warn('Signup validation failed: missing fields');
            return { success: false, message: 'Please fill in all fields.' };
        }

        if (username.trim().length < 3) {
            set({ isLoading: false });
            return { success: false, message: 'Username must be at least 3 characters long.' };
        }

        if (password.length < 6) {
            set({ isLoading: false });
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            set({ isLoading: false });
            return { success: false, message: 'Please enter a valid email address.' };
        }

        try {
            // Check network connectivity first
            const isConnected = await checkNetworkConnection();
            if (!isConnected) {
                set({ isLoading: false });
                return { success: false, message: 'No internet connection. Please check your network and try again.' };
            }

            // Check if API URL is configured
            if (!apiUrl) {
                throw new Error('API URL is not configured');
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok && data.user && data.token) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);
                set({ isAuthenticated: true, token: data.token, user: data.user, isLoading: false });
                return { success: true, message: 'Account created successfully!' };
            } else {
                set({ isLoading: false });
                return { success: false, message: data.message || 'Account creation failed. Please try again.' };
            }
        } catch (error: any) {
            set({ isLoading: false });
            console.error('Signup error:', error);

            // Provide more specific error messages
            if (error.name === 'AbortError') {
                return { success: false, message: 'Connection timeout. Please check your internet connection and try again.' };
            } else if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
                return { success: false, message: 'Network error. Please check your internet connection and try again.' };
            } else if (error.message?.includes('API URL')) {
                return { success: false, message: 'Service configuration error. Please try again later.' };
            } else {
                return { success: false, message: 'An unexpected error occurred. Please try again.' };
            }
        }
    },
    deleteAccount: async (password: string) => {
        const { token } = get();

        if (!token) {
            return { success: false, message: 'Not authenticated' };
        }

        try {
            const isConnected = await checkNetworkConnection();
            if (!isConnected) {
                return { success: false, message: 'No internet connection' };
            }

            const response = await fetch(`${apiUrl}/auth/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Clear all user data
                await AsyncStorage.multiRemove(['token', 'user']);
                set({
                    isAuthenticated: false,
                    token: null,
                    user: null
                });

                await logger.info('Account deleted successfully');
                return { success: true, message: 'Account deleted successfully' };
            } else {
                await logger.error('Account deletion failed', data);
                return { success: false, message: data.message || 'Account deletion failed' };
            }
        } catch (error) {
            await logger.error('Account deletion error', error as Error);
            return { success: false, message: 'Network error occurred' };
        }
    },
    checkAuth: async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedToken = await AsyncStorage.getItem('token');

            if (storedUser && storedToken) {
                set({ isAuthenticated: true, user: JSON.parse(storedUser), token: storedToken });
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    refreshUser: async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');

            if (!storedToken) {
                console.log('No token found, cannot refresh user data');
                return;
            }

            // You might need to create a /me endpoint on your backend to get current user data
            // For now, let's just re-parse the stored user data
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                console.log('Refreshed user data:', userData);
                set({ user: userData });
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    }
}));
