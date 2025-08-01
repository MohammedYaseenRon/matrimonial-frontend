import { useAuthStore } from "@/stores/useAuthStore";
import { apiClient } from "@/utils/AuthClient";
import { useEffect } from "react";
import { Text, View } from "react-native";

const getUserProfile = async () => {
    try {
        console.log(useAuthStore.getState().accessToken);
        const response = await apiClient.request('/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useAuthStore.getState().accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export default function Social() {

    useEffect(() => {
        console.log(useAuthStore.getState())
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                console.log('User Profile:', profile);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, []);
    return (
        <View>
            <Text>Social</Text>
        </View>
    )
}