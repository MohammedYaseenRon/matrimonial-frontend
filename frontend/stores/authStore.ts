import { UserResponse } from '@/types/user-auth';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

interface AuthState {
  user: UserResponse | null
  registrationType: 'social' | 'matrimonial' | null
  credits: number
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  sessionId: string | null
  
  // Actions
  login: (user: UserResponse, accessToken: string, refreshToken: string, sessionId: string) => void
  logout: () => void
  setRegistrationType: (type: 'social' | 'matrimonial') => void
  updateCredits: (amount: number) => void
  updateTokens: (accessToken: string, refreshToken: string) => void
  
  // Storage methods
  loadFromStorage: () => Promise<void>
  saveToStorage: () => Promise<void>
}

const initialState = {
  user: null,
  registrationType: null,
  credits: 0,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  sessionId: null,
}

const STORAGE_KEY = 'auth-storage' // Only used for mobile SecureStore

// Web platform: Server manages HttpOnly cookies, we only store non-sensitive user data
// Mobile platform: Use SecureStore for all auth data

// Platform-specific storage utility
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // On web, tokens are in HttpOnly cookies managed by server
        // We only store non-sensitive user data in localStorage for UI state
        return localStorage.getItem(key);
      } else {
        // Use SecureStore on mobile for all auth data
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // On web, only store non-sensitive data (user info, preferences)
        // Tokens are managed by server via HttpOnly cookies
        localStorage.setItem(key, value);
      } else {
        // Use SecureStore on mobile for all auth data
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Remove non-sensitive data from localStorage
        // HttpOnly cookies are cleared by server logout endpoint
        localStorage.removeItem(key);
      } else {
        // Remove from SecureStore on mobile
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...initialState,
  
  login: (user, accessToken, refreshToken, sessionId) => {
    if (Platform.OS === 'web') {
      // On web, tokens should be in HttpOnly cookies managed by server
      // Only store non-sensitive user data and session info for UI
      const webState = { 
        user, 
        sessionId, // Store for UI reference only
        isAuthenticated: true,
        // Don't store tokens on web - they're in HttpOnly cookies
        accessToken: null,
        refreshToken: null,
      };
      set(webState);
      // Save non-sensitive data to localStorage
      get().saveToStorage();
    } else {
      // On mobile, store everything in SecureStore
      const mobileState = { 
        user, 
        accessToken, 
        refreshToken, 
        sessionId, 
        isAuthenticated: true 
      };
      set(mobileState);
      // Save all auth data to SecureStore
      get().saveToStorage();
    }
  },
  
  logout: async () => {
    set(initialState);
    
    if (Platform.OS === 'web') {
      // On web, call server logout endpoint to clear HttpOnly cookies
      try {
        await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include', // Include HttpOnly cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Server logout failed:', error);
        // Continue with client cleanup even if server call fails
      }
      // Clear localStorage data
      await storage.removeItem(STORAGE_KEY);
    } else {
      // On mobile, clear SecureStore
      await storage.removeItem(STORAGE_KEY);
    }
  },
  
  setRegistrationType: (type) => {
    set({ registrationType: type });
    get().saveToStorage();
  },
  
  updateCredits: (amount) => {
    set({ credits: get().credits + amount });
    get().saveToStorage();
  },
  
  updateTokens: (accessToken, refreshToken) => {
    if (Platform.OS === 'web') {
      // On web, tokens are in HttpOnly cookies - no need to store in state
      // Just trigger a re-render if needed
      set({ isAuthenticated: true });
    } else {
      // On mobile, update tokens in state and SecureStore
      set({ accessToken, refreshToken });
      get().saveToStorage();
    }
  },
  
  loadFromStorage: async () => {
    try {
      const stored = await storage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        if (Platform.OS === 'web') {
          // On web, only validate non-sensitive data
          // Auth state is determined by HttpOnly cookies via server calls
          if (data.user && data.sessionId) {
            set({
              user: data.user || null,
              registrationType: data.registrationType || null,
              credits: data.credits || 0,
              sessionId: data.sessionId || null,
              isAuthenticated: true, // Assume authenticated if we have user data
              // Tokens are in HttpOnly cookies, not in state
              accessToken: null,
              refreshToken: null,
            });
          } else {
            await storage.removeItem(STORAGE_KEY);
          }
        } else {
          // On mobile, validate all required fields including tokens
          if (data.accessToken && data.refreshToken && data.sessionId) {
            set({
              user: data.user || null,
              registrationType: data.registrationType || null,
              credits: data.credits || 0,
              isAuthenticated: data.isAuthenticated || false,
              accessToken: data.accessToken || null,
              refreshToken: data.refreshToken || null,
              sessionId: data.sessionId || null,
            });
          } else {
            await storage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
      // Clear potentially corrupted data
      await storage.removeItem(STORAGE_KEY);
    }
  },
  
  saveToStorage: async () => {
    try {
      const state = get();
      
      if (Platform.OS === 'web') {
        // On web, only save non-sensitive data (tokens are in HttpOnly cookies)
        if (state.user && state.sessionId) {
          const dataToSave = {
            user: state.user,
            registrationType: state.registrationType,
            credits: state.credits,
            sessionId: state.sessionId,
            // Don't save tokens on web
            savedAt: new Date().toISOString(),
          };
          
          await storage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
      } else {
        // On mobile, save all auth data including tokens
        if (state.accessToken && state.refreshToken && state.sessionId) {
          const dataToSave = {
            user: state.user,
            registrationType: state.registrationType,
            credits: state.credits,
            isAuthenticated: state.isAuthenticated,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            sessionId: state.sessionId,
            savedAt: new Date().toISOString(),
          };
          
          await storage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
      }
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  },
}))

export default useAuthStore;