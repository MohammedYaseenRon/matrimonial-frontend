import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet
} from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRegistration } from "@/contexts/RegisterContext";

export default function Password() {
    const router = useRouter();
    const { mobile, email } = useLocalSearchParams<{ mobile?: string, email?: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const { registrationType, loading } = useRegistration();



    const passwordsMatch = password === confirmPassword && password.length >= 6;
    const isRegisterButtonDisabled = !passwordsMatch;

    const handleRegister = () => {
        if (isRegisterButtonDisabled) {
            Alert.alert('Validation Error', 'Passwords do not match or are too short (minimum 6 characters)');
            return;
        }
        if(loading) return;
        const userData = {
            mobile: mobile,
            email: email,
            password: password,
        };

        if (registrationType === 'social') {
            router.replace("/(auth)/Sociial");
        } else if (registrationType === 'matrimonial') {
            router.replace("/matrimonial");
        } else {
            router.replace('/');
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}

            className="flex-1 bg-gray-50 justify-center items-center py-8 px-4"
        >
            <View
                className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
            >
                <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Registration Step 3 of 3
                </Text>

                {mobile && (
                    <Text className="text-gray-700 text-center text-base mb-1">
                        Mobile: {mobile}
                    </Text>
                )}
                {email && (
                    <Text className="text-gray-700 text-center text-base mb-4">
                        Email: {email}
                    </Text>
                )}

                <View className="mb-6">
                    <Text className="text-gray-700 text-base font-medium mb-2">Set your password</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            className="flex-1 text-base text-gray-800"
                            style={Platform.OS === 'web' && styles.noOutline}
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
                        />
                    </View>
                </View>

                <Text className={`text-center text-sm font-semibold mb-6 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </Text>

                <View className="space-y-2 mb-4">
                    <Text className="text-sm text-gray-600">✓ At least 8 characters</Text>
                    <Text className="text-sm text-gray-600">✓ Contains uppercase & lowercase</Text>
                    <Text className="text-sm text-gray-600">✓ Contains numbers</Text>
                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isRegisterButtonDisabled}
                    className={`py-4 rounded-lg mb-4 ${isRegisterButtonDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
                >
                    <Text className="text-white text-center text-lg font-bold">Complete Registration</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => router.back()} className="py-2">
            <Text className="text-blue-600 text-center text-base">← Back</Text>
          </TouchableOpacity> */}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    noOutline: {
        outlineWidth: 0,
    },
});