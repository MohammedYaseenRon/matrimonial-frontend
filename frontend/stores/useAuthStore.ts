import { UserResponse } from '@/types/user-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const STORAGE_KEY = 'auth-storage'

// Platform-specific storage utility
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage on web for persistence across browser sessions
        return localStorage.getItem(key);
      } else {
        // Use AsyncStorage on mobile
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage on web
        localStorage.setItem(key, value);
      } else {
        // Use AsyncStorage on mobile
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage on web
        localStorage.removeItem(key);
      } else {
        // Use AsyncStorage on mobile
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...initialState,
  
  login: (user, accessToken, refreshToken, sessionId) => {
    const newState = { 
      user, 
      accessToken, 
      refreshToken, 
      sessionId, 
      isAuthenticated: true 
    };
    set(newState);
    // Save immediately after login
    get().saveToStorage();
  },
  
  logout: async () => {
    set(initialState);
    await storage.removeItem(STORAGE_KEY);
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
    set({ accessToken, refreshToken });
    get().saveToStorage();
  },
  
  loadFromStorage: async () => {
    try {
      const stored = await storage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Validate the stored data has required fields
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
    } catch (error) {
      console.error('Failed to load auth data:', error);
      // Clear potentially corrupted data
      await storage.removeItem(STORAGE_KEY);
    }
  },
  
  saveToStorage: async () => {
    try {
      const state = get();
      
      // Only save if we have valid authentication data
      if (state.accessToken && state.refreshToken && state.sessionId) {
        const dataToSave = {
          user: state.user,
          registrationType: state.registrationType,
          credits: state.credits,
          isAuthenticated: state.isAuthenticated,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          sessionId: state.sessionId,
          // Add timestamp for potential expiry checking
          savedAt: new Date().toISOString(),
        };
        
        await storage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (error) {
    }
  },
}))

export default useAuthStore;