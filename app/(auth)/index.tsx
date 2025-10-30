import { View, Image, TextInput, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import loginStyles from '../../styles/login.styles';
import COLORS from '@/constants/COLORS';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

interface AuthData {
    email: string;
    password: string;
    showPassword: boolean;
}

export default function LoginScreen() {
    const [authData, setAuthData] = useState<AuthData>({
        email: '',
        password: '',
        showPassword: false
    });

    const { login, isLoading, isCheckingAuth } = useAuthStore();

    const router = useRouter();

    const handleLogin = async () => {
        // Client-side validation
        if (!authData.email.trim() || !authData.password.trim()) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(authData.email.trim())) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        const result = await login(authData.email, authData.password);
        if (result.success) {
            router.push('/(tabs)');
        } else {
            Alert.alert('Login Error', result.message || 'An error occurred during login. Please try again.');
        }
    };

    if (isCheckingAuth) {
        return null;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={loginStyles.scrollViewStyle}
                contentContainerStyle={loginStyles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Illustration */}
                <View style={loginStyles.topIllustration}>
                    <Image
                        source={require('../../assets/images/signin.png')}
                        style={loginStyles.illustrationImage}
                    />
                </View>

                <View style={loginStyles.card}>
                    {/* Header */}
                    <View style={loginStyles.header}>
                        <Text style={loginStyles.title}>Welcome Back</Text>
                        <Text style={loginStyles.subtitle}>Sign in to your account</Text>
                    </View>

                    {/* Email */}
                    <View style={loginStyles.inputGroup}>
                        <Text style={loginStyles.label}>Email</Text>
                        <View style={loginStyles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={loginStyles.inputIcon} />
                            <TextInput
                                style={loginStyles.input}
                                placeholder="Enter your email"
                                placeholderTextColor={COLORS.placeholderText}
                                value={authData.email}
                                onChangeText={(text: string) => setAuthData({ ...authData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={loginStyles.inputGroup}>
                        <Text style={loginStyles.label}>Password</Text>
                        <View style={loginStyles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={loginStyles.inputIcon} />
                            <TextInput
                                style={loginStyles.input}
                                placeholder="Enter your password"
                                placeholderTextColor={COLORS.placeholderText}
                                value={authData.password}
                                onChangeText={(text: string) => setAuthData({ ...authData, password: text })}
                                secureTextEntry={!authData.showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setAuthData({ ...authData, showPassword: !authData.showPassword })}
                                style={loginStyles.eyeIcon}
                            >
                                <Ionicons
                                    name={authData.showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={loginStyles.button}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={loginStyles.buttonText}>Sign In</Text>}
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={loginStyles.footer}>
                        <Text style={loginStyles.footerText}>Don&apos;t have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={loginStyles.link}> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
