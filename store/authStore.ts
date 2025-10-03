import { User } from '@/types/User';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL!

interface AuthState {
    isAuthenticated: boolean;
    token: string | null
    user: User | null;
    isLoading?: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    login: (token: string, user: User) => set(() => ({ isAuthenticated: true, token, user, isLoading: false })),
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
        }
    }
}));
