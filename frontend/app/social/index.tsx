import CreditPurchase from "@/components/payment/CreditPurchase";
import { useAuth } from "@/hooks/useAuth";
import { UserAuthWithProfiles } from "@/types/user-auth";
import { apiClient } from "@/utils/AuthClient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Social() {
    const { isAuthenticated, user, isLoading: isAuthLoading, hasValidAuth } = useAuth();
    const [profile, setProfile] = useState<UserAuthWithProfiles | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getUserProfile = async () => {
        try {
            const response = await apiClient.get('/auth/profile');
            console.log('[Social] User profile response:', response);
            console.log('[Social] User: ', user)
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

        if (hasValidAuth) {
            const fetchProfile = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const profileResponse = await getUserProfile();
                    if (profileResponse) {
                        setProfile(profileResponse.data);
                        console.log('[Social] Profile data:', profileResponse);
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
    }, [isAuthLoading, hasValidAuth]);

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
        <ScrollView className="flex-1 p-4">
            <Text className="text-2xl font-bold mb-4">Social Dashboard</Text>
            
            {user && (
                <View className="mb-4">
                    <Text className="text-lg">Welcome, {user.email}!</Text>
                </View>
            )}
            
            {profile ? (
                <View>
                    <Text className="text-lg font-semibold mb-2">Profile Data:</Text>
                    <Text>{JSON.stringify(profile, null, 2)}</Text>
                    <CreditPurchase
                        section="social"
                        userEmail={user?.email || 'usmanimohammed12@gmail.com'}
                        userMobile={user?.mobile || '1234567890'}
                    />
                </View>
            ) : (
                <View>
                    <Text className="text-gray-600">No profile data available</Text>
                </View>
            )}
        </ScrollView>
    );
}