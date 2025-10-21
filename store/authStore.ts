import { User } from '@/types/User';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '@/constants/API';
interface AuthState {
    isAuthenticated: boolean;
    token: string | null
    user: User | null;
    isLoading?: boolean;
    isCheckingAuth?: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    checkAuth: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    isCheckingAuth: true,
    login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);
                set({ isAuthenticated: true, token: data.token, user: data.user, isLoading: false });
                return { success: true, message: 'Login successful!' };
            } else {
                set({ isLoading: false });
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            set({ isLoading: false });
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login. Please try again.' };
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        set({ isAuthenticated: false, token: null, user: null });
    },
    signUp: async (username, email, password) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);
                set({ isAuthenticated: true, token: data.token, user: data.user, isLoading: false });
                return { success: true, message: 'Account created successfully!' };
            } else {
                set({ isLoading: false });
                return { success: false, message: data.message || 'Signup failed' };
            }
        } catch (error) {
            set({ isLoading: false });
            console.error('Signup error:', error);
            return { success: false, message: 'An error occurred during signup. Please try again.' };
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
