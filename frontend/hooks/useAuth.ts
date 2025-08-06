import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/utils/AuthClient';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useAuth = () => {
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized) return;

    const loadAuthData = async () => {
      try {
        await authStore.loadFromStorage();
        
        // For web, verify auth state with server since tokens are in HttpOnly cookies
        if (Platform.OS === 'web' && authStore.isAuthenticated) {
          try {
            const profileResponse = await apiClient.get('/auth/profile');
            
            if (profileResponse.success && profileResponse.data) {
              // Only update if user data has changed to prevent loops
              const currentUser = authStore.user;
              if (!currentUser || currentUser.id !== profileResponse.data.id) {
                authStore.login(profileResponse.data, '', '', authStore.sessionId || '');
              }
            } else {
              // Not authenticated, clear any stale data
              await authStore.logout();
            }
          } catch (error) {
            console.error('Failed to verify auth state with server:', error);
            // Don't logout on network error, keep existing state
          }
        }
      } catch (error) {
        console.error('Failed to load auth data on app start:', error);
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    loadAuthData();
  }, [hasInitialized]); // Only depend on hasInitialized flag

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    // Only expose tokens on mobile (they're null on web due to HttpOnly cookies)
    accessToken: Platform.OS === 'web' ? null : authStore.accessToken,
    refreshToken: Platform.OS === 'web' ? null : authStore.refreshToken,
    sessionId: authStore.sessionId,
    registrationType: authStore.registrationType,
    credits: authStore.credits,
    login: authStore.login,
    logout: authStore.logout,
    updateTokens: authStore.updateTokens,
    updateCredits: authStore.updateCredits,
    setRegistrationType: authStore.setRegistrationType,
    isLoading, // Expose loading state
    // Helper to check if user has valid authentication
    hasValidAuth: authStore.isAuthenticated && authStore.user && authStore.sessionId,
  };
};