import { useAuth } from "@/hooks/useAuth";
import { UserAuthResponse } from "@/types/user-auth";
import { apiClient } from "@/utils/AuthClient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Social() {
    const { accessToken, isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
    const [profile, setProfile] = useState<UserAuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getUserProfile = async () => {
        try {
            const response = await apiClient.get('/auth/profile');
            return response;
        } catch (error) {
            console.error('[Social] Error fetching user profile:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (isAuthenticated && accessToken) {
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
                    console.error('[Social] Failed to fetch profile:', err);
                    setError('Failed to load profile.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProfile();
        } else {
            router.replace('/auth/Login');
        }
    }, [isAuthenticated, accessToken, isAuthLoading]);

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
            <Text className="text-2xl font-bold mb-4">Social Dashboard</Text>
            
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