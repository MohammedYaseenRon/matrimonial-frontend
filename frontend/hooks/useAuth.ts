import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth data when the hook is first used
    const loadAuthData = async () => {
      try {
        await authStore.loadFromStorage();
      } catch (error) {
        console.error('Failed to load auth data on app start:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    accessToken: authStore.accessToken,
    refreshToken: authStore.refreshToken,
    sessionId: authStore.sessionId,
    registrationType: authStore.registrationType,
    credits: authStore.credits,
    login: authStore.login,
    logout: authStore.logout,
    updateTokens: authStore.updateTokens,
    updateCredits: authStore.updateCredits,
    setRegistrationType: authStore.setRegistrationType,
    isLoading, // Expose loading state
  };
};