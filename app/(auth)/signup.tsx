import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import signupStyles from '../../styles/signup.styles';
import COLORS from '@/constants/COLORS';
import { useAuthStore } from '@/store/authStore';

interface SignupData {
    fullName: string;
    email: string;
    password: string;
    showPassword: boolean;
}

export default function SignupScreen() {
    const [signupData, setSignupData] = useState<SignupData>({
        fullName: '',
        email: '',
        password: '',
        showPassword: false
    });

    const { isLoading, signUp } = useAuthStore();

    const router = useRouter();

    const handleSignUp = async () => {
        const result = await signUp(signupData.fullName, signupData.email, signupData.password);
        if (!result.success) {
            Alert.alert('Error', result.message || 'An error occurred during signup. Please try again.');
        } else {
            setSignupData({ fullName: '', email: '', password: '', showPassword: false });
            router.push('/');
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={signupStyles.scrollViewStyle} contentContainerStyle={signupStyles.container} keyboardShouldPersistTaps="handled">
                {/* Illustration */}
                <View style={signupStyles.topIllustration}>
                    <Image
                        source={require('../../assets/images/signup.png')}
                        style={signupStyles.illustrationImage}
                    />
                </View>

                <View style={signupStyles.card}>
                    {/* Header */}
                    <View style={signupStyles.header}>
                        <Text style={signupStyles.title}>Create Account</Text>
                        <Text style={signupStyles.subtitle}>Share your favorite tv shows</Text>
                    </View>

                    {/* Full Name */}
                    <View style={signupStyles.inputGroup}>
                        <Text style={signupStyles.label}>Username</Text>
                        <View style={signupStyles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={COLORS.primary} style={signupStyles.inputIcon} />
                            <TextInput
                                style={signupStyles.input}
                                placeholder="Enter your username"
                                placeholderTextColor={COLORS.placeholderText}
                                value={signupData.fullName}
                                onChangeText={(text: string) => setSignupData({ ...signupData, fullName: text })}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="name"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={signupStyles.inputGroup}>
                        <Text style={signupStyles.label}>Email</Text>
                        <View style={signupStyles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={signupStyles.inputIcon} />
                            <TextInput
                                style={signupStyles.input}
                                placeholder="Enter your email"
                                placeholderTextColor={COLORS.placeholderText}
                                value={signupData.email}
                                onChangeText={(text: string) => setSignupData({ ...signupData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={signupStyles.inputGroup}>
                        <Text style={signupStyles.label}>Password</Text>
                        <View style={signupStyles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={signupStyles.inputIcon} />
                            <TextInput
                                style={signupStyles.input}
                                placeholder="Create a password"
                                placeholderTextColor={COLORS.placeholderText}
                                value={signupData.password}
                                onChangeText={(text: string) => setSignupData({ ...signupData, password: text })}
                                secureTextEntry={!signupData.showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setSignupData({ ...signupData, showPassword: !signupData.showPassword })}
                                style={signupStyles.eyeIcon}
                            >
                                <Ionicons
                                    name={signupData.showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity
                        style={signupStyles.button}
                        onPress={handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={signupStyles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={signupStyles.footer}>
                        <Text style={signupStyles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)')}>
                            <Text style={signupStyles.link}> Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}