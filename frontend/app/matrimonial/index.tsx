import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/utils/AuthClient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Matrimonial() {
    const { isAuthenticated, user, isLoading: isAuthLoading, hasValidAuth } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getUserProfile = async () => {
        try {
            const response = await apiClient.get('/auth/profile');
            return response;
        } catch (error) {
            console.error('[Matrimonial] Error fetching user profile:', error);
            throw error;
        }
    };

    useEffect(() => {
        // ❗️ Wait for the initial auth check to complete
        if (isAuthLoading) {
            return;
        }

        if (hasValidAuth) {
            const fetchProfile = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const profileResponse = await getUserProfile();
                    if (profileResponse) {
                        setProfile(profileResponse.data);
                    } else {
                        setError('Failed to load profile data.');
                    }
                } catch (err) {
                    console.error('[Matrimonial] Failed to fetch profile:', err);
                    setError('Failed to load profile.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProfile();
        } else {
            router.replace('/auth/Login');
        }
    }, [hasValidAuth, isAuthLoading]);

    if (!isAuthenticated) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">Not authenticated</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-600 mt-2">Loading profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-600">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4">
            <Text className="text-2xl font-bold mb-4">Matrimonial Dashboard</Text>

            {user && (
                <View className="mb-4">
                    <Text className="text-lg">Welcome, {user.email}!</Text>
                </View>
            )}
            
            {profile && (
                <View>
                    <Text className="text-lg font-semibold mb-2">Profile Data:</Text>
                    <Text>{JSON.stringify(profile, null, 2)}</Text>
                </View>
            )}
        </View>
    );
}