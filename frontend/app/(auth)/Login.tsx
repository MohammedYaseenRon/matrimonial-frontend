import { Configs } from "@/constants/Configs";
import useAuthStore from "@/stores/useAuthStore";
import DeviceIdentification from "@/utils/DeviceIdentification";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function Login() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const isValidEmail = (inputEmail: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

    const isLoginButtonDisabled = !isValidEmail(email) || !password || password.length < 6 || isLoading;

    useEffect(() => {
        setIsMounted(true);
        
        // If user is already authenticated, redirect to appropriate page
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
        
        return () => setIsMounted(false);
    }, [isAuthenticated]);

    // Clear messages when user types
    useEffect(() => {
        if (errorMessage || successMessage) {
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [email, password]);

    const handleLogin = async () => {
        if (isLoginButtonDisabled) {
            if (!isValidEmail(email)) {
                setErrorMessage('Please enter a valid email address');
            } else if (!password) {
                setErrorMessage('Password is required');
            } else if (password.length < 6) {
                setErrorMessage('Password must be at least 6 characters');
            }
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Get device ID and IP
            const deviceId = await DeviceIdentification.getDeviceId();
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ip = await ipResponse.json();

            const response = await fetch(`${Configs.SERVER_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password,
                    deviceId: deviceId,
                    ip: ip.ip
                }),
            });

            const data = await response.json();

            // Handle different response status codes
            if (!response.ok) {
                // Handle specific error responses from server
                if (response.status === 400) {
                    setErrorMessage(data.message || 'Login failed. Please check your credentials.');
                } else if (response.status === 401) {
                    setErrorMessage(data.message || 'Invalid email or password. Please check your credentials and try again.');
                } else if (response.status === 429) {
                    setErrorMessage('Too many login attempts. Please try again later.');
                } else if (response.status >= 500) {
                    setErrorMessage('Server error. Please try again later.');
                } else {
                    setErrorMessage(data.message || `Login failed with status: ${response.status}`);
                }
                setIsLoading(false);
                return;
            }

            // Handle business logic failures (success: false)
            if (!data.success) {
                setErrorMessage(data.message || 'Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Success case - Handle the response structure
            if (data.success && data.data) {
                const authData = data.data;
                
                // Check if we have the required authentication data
                if (authData.user && authData.accessToken && authData.refreshToken && authData.sessionId) {
                    await login(authData.user, authData.accessToken, authData.refreshToken, authData.sessionId);
                    setSuccessMessage(data.message || 'Login successful. Welcome back!');
                    
                    // Show success message briefly before navigation
                    setTimeout(() => {
                        if (isMounted) {
                            router.replace('/social');
                        }
                    }, 1500);
                } else {
                    setErrorMessage('Login successful but authentication data is missing. Please try again.');
                    setIsLoading(false);
                }
            } else {
                setErrorMessage('Login failed due to server response format. Please try again.');
                setIsLoading(false);
            }

        } catch (error) {
            console.error('Login Error:', error);
            
            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setErrorMessage('Network error. Please check your connection and try again.');
            } else {
                setErrorMessage('An unexpected error occurred during login. Please try again.');
            }
            
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        if (isMounted && !isLoading) {
            router.push('/');
        }
    };

    const navigateToForgotPassword = () => {
        if (isMounted && !isLoading) {
            // TODO: Implement forgot password page
            setErrorMessage('Forgot password feature will be available soon.');
        }
    };

    // Show loading state while component is mounting
    if (!isMounted) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50 justify-center items-center py-8 px-4"
        >
            <View className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back
                </Text>

                <Text className="text-base text-gray-600 text-center mb-6">
                    Sign in to your account to continue
                </Text>

                {/* Error Message Display */}
                {errorMessage ? (
                    <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Text className="text-red-700 text-sm font-medium text-center">
                            {errorMessage}
                        </Text>
                    </View>
                ) : null}

                {/* Success Message Display */}
                {successMessage ? (
                    <View className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Text className="text-green-700 text-sm font-medium text-center">
                            {successMessage}
                        </Text>
                    </View>
                ) : null}

                <View className="mb-6">
                    <Text className="text-gray-700 text-base font-medium mb-2">Email Address</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="flex-1 text-base text-gray-800"
                            style={Platform.OS === 'web' && styles.noOutline}
                            editable={!isLoading}
                        />
                    </View>
                    {email && !isValidEmail(email) && (
                        <Text className="text-red-500 text-sm mt-1">
                            Please enter a valid email address
                        </Text>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 text-base font-medium mb-2">Password</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            className="flex-1 text-base text-gray-800"
                            style={Platform.OS === 'web' && styles.noOutline}
                            editable={!isLoading}
                        />
                    </View>
                    {password && password.length < 6 && (
                        <Text className="text-red-500 text-sm mt-1">
                            Password must be at least 6 characters
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isLoginButtonDisabled}
                    className={`py-4 rounded-lg mb-4 ${isLoginButtonDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
                >
                    {isLoading ? (
                        <View className="flex-row items-center justify-center">
                            <ActivityIndicator color="#fff" size="small" />
                            <Text className="text-white text-center text-lg font-bold ml-2">
                                SIGNING IN...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white text-center text-lg font-bold">
                            SIGN IN
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-between items-center mb-6">
                    <TouchableOpacity 
                        onPress={navigateToForgotPassword}
                        disabled={isLoading}
                        className="py-2"
                    >
                        <Text className={`text-sm ${
                            isLoading ? 'text-gray-400' : 'text-blue-600'
                        }`}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="border-t border-gray-200 pt-6">
                    <Text className="text-center text-gray-600 text-sm mb-4">
                        Don't have an account?
                    </Text>
                    <TouchableOpacity 
                        onPress={navigateToRegister}
                        disabled={isLoading}
                        className={`py-3 rounded-lg border-2 ${
                            isLoading ? 'border-gray-300 bg-gray-100' : 'border-blue-600 bg-transparent'
                        }`}
                    >
                        <Text className={`text-center text-base font-bold ${
                            isLoading ? 'text-gray-400' : 'text-blue-600'
                        }`}>
                            CREATE ACCOUNT
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* App Version or Additional Info */}
                <Text className="text-center text-gray-400 text-xs mt-6">
                    Connect App v1.0.0
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    noOutline: {
        outlineWidth: 0,
    },
});