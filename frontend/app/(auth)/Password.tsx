import { Configs } from "@/constants/Configs";
import { useRegistrationStore } from "@/stores/registrationStore";
import useAuthStore from "@/stores/useAuthStore";
import DeviceIdentification from "@/utils/DeviceIdentification";
import { useFocusEffect } from '@react-navigation/native';
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

export default function Password() {
    const router = useRouter();
    const { 
        mobile, 
        email, 
        canProceedToStep, 
        registrationType, 
        setPassword, 
        getRegistrationPayload, 
        resetRegistration 
    } = useRegistrationStore();
    const { login } = useAuthStore();

    const [password, setPasswordInput] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const passwordsMatch = password === confirmPassword && password.length >= 6;
    const isRegisterButtonDisabled = !passwordsMatch || isLoading;

    // Password strength validation
    const passwordStrength = {
        hasMinLength: password.length >= 6,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isStrongPassword = Object.values(passwordStrength).every(Boolean);

    useFocusEffect(
        React.useCallback(() => {
            const timeoutId = setTimeout(() => {
                if (!canProceedToStep(3)) {
                    setErrorMessage('Please complete the previous steps before proceeding.');
                    router.replace('/MobileNo');
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }, [canProceedToStep, router])
    );

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Clear messages when user types
    useEffect(() => {
        if (errorMessage || successMessage) {
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [password, confirmPassword]);

    const handleRegister = async () => {
        if (isRegisterButtonDisabled) {
            setErrorMessage('Passwords do not match or are too short (minimum 6 characters)');
            return;
        }

        if (!isStrongPassword) {
            setErrorMessage('Password must contain uppercase, lowercase, numbers, and special characters');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        setPassword(password);

        try {
            const registrationData = getRegistrationPayload();

            // Get device ID and IP
            const deviceId = await DeviceIdentification.getDeviceId();
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ip = await ipResponse.json();

            const response = await fetch(`${Configs.SERVER_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...registrationData,
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
                    setErrorMessage(data.message || 'Registration failed. Please check your information.');
                } else if (response.status === 429) {
                    setErrorMessage('Too many registration attempts. Please try again later.');
                } else if (response.status >= 500) {
                    setErrorMessage('Server error. Please try again later.');
                } else {
                    setErrorMessage(data.message || `Registration failed with status: ${response.status}`);
                }
                setIsLoading(false);
                return;
            }

            // Handle business logic failures (success: false)
            if (!data.success) {
                setErrorMessage(data.message || 'Registration failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Success case - Handle the response structure
            if (data.success && data.data) {
                const authData = data.data;
                
                // Store authentication data if available
                if (authData.user && authData.accessToken && authData.refreshToken && authData.sessionId) {
                    login(authData.user, authData.accessToken, authData.refreshToken, authData.sessionId);
                    console.log('Registration successful:', authData);
                }

                setSuccessMessage(data.message || 'Registration successful. Welcome to our platform!');
                
                // Show success message briefly before navigation
                setTimeout(() => {
                    
                    if (isMounted) {
                        console.log(registrationType)
                        // Navigate based on registration type
                        if (registrationType === 'social') {
                            resetRegistration();
                            router.replace("/social");
                        } else if (registrationType === 'matrimonial') {
                            resetRegistration();
                            router.replace("/matrimonial");
                        } else {
                            router.replace('/(tabs)');
                        }
                    }
                }, 2000);
            } else {
                setErrorMessage('Registration completed but authentication data is missing. Please login manually.');
                setIsLoading(false);
            }

        } catch (error) {
            console.error('Registration Error:', error);
            
            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setErrorMessage('Network error. Please check your connection and try again.');
            } else {
                setErrorMessage('An unexpected error occurred during registration. Please try again.');
            }
            
            setIsLoading(false);
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
                    Registration Step 3 of 3
                </Text>

                {registrationType && (
                    <Text className="text-base text-gray-600 text-center mb-2">
                        <Text className="font-semibold">For {registrationType}</Text> registration
                    </Text>
                )}

                {mobile && (
                    <Text className="text-green-600 text-center text-base mb-1">
                        Mobile: {mobile} ✓
                    </Text>
                )}
                {email && (
                    <Text className="text-green-600 text-center text-base mb-4">
                        Email: {email} ✓
                    </Text>
                )}

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
                    <Text className="text-gray-700 text-base font-medium mb-2">Set your password</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                        <TextInput
                            value={password}
                            onChangeText={setPasswordInput}
                            placeholder="Enter password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            className="flex-1 text-base text-gray-800"
                            style={Platform.OS === 'web' && styles.noOutline}
                            editable={!isLoading}
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 text-base font-medium mb-2">Confirm your password</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            className="flex-1 text-base text-gray-800"
                            style={Platform.OS === 'web' && styles.noOutline}
                            editable={!isLoading}
                        />
                    </View>
                </View>

                <Text className={`text-center text-sm font-semibold mb-4 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </Text>

                {/* Password Strength Indicators */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</Text>
                    <View className="space-y-1">
                        <Text className={`text-sm ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.hasMinLength ? '✓' : '○'} At least 6 characters
                        </Text>
                        <Text className={`text-sm ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.hasUppercase ? '✓' : '○'} Contains uppercase letter
                        </Text>
                        <Text className={`text-sm ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.hasLowercase ? '✓' : '○'} Contains lowercase letter
                        </Text>
                        <Text className={`text-sm ${passwordStrength.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.hasNumbers ? '✓' : '○'} Contains numbers
                        </Text>
                        <Text className={`text-sm ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.hasSpecialChar ? '✓' : '○'} Contains special characters
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isRegisterButtonDisabled}
                    className={`py-4 rounded-lg mb-4 ${isRegisterButtonDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
                >
                    {isLoading ? (
                        <View className="flex-row items-center justify-center">
                            <ActivityIndicator color="#fff" size="small" />
                            <Text className="text-white text-center text-lg font-bold ml-2">
                                REGISTERING...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white text-center text-lg font-bold">
                            COMPLETE REGISTRATION
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => {
                        if (isMounted && !isLoading) {
                            router.back();
                        }
                    }} 
                    className="py-2"
                    disabled={isLoading}
                >
                    <Text className={`text-center text-base ${
                        isLoading ? 'text-gray-400' : 'text-blue-600'
                    }`}>
                        ← Back
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    noOutline: {
        outlineWidth: 0,
    },
});