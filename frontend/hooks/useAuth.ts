import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    authStore.loadFromStorage();
  }, []);

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    accessToken: authStore.accessToken,
    refreshToken: authStore.refreshToken,
    sessionId: authStore.sessionId,
    login: authStore.login,
    logout: authStore.logout,
    updateTokens: authStore.updateTokens,
  };
};