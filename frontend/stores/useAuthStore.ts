import { UserResponse } from '@/types/user-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...initialState,
  
  login: (user, accessToken, refreshToken, sessionId) => {
    set({ 
      user, 
      accessToken, 
      refreshToken, 
      sessionId, 
      isAuthenticated: true 
    })
    get().saveToStorage()
  },
  
  logout: async () => {
    set(initialState)
    await AsyncStorage.removeItem(STORAGE_KEY)
  },
  
  setRegistrationType: (type) => {
    set({ registrationType: type })
    get().saveToStorage()
  },
  
  updateCredits: (amount) => {
    set({ credits: get().credits + amount })
    get().saveToStorage()
  },
  
  updateTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken })
    get().saveToStorage()
  },
  
  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        set({
          user: data.user || null,
          registrationType: data.registrationType || null,
          credits: data.credits || 0,
          isAuthenticated: data.isAuthenticated || false,
          accessToken: data.accessToken || null,
          refreshToken: data.refreshToken || null,
          sessionId: data.sessionId || null,
        })
      }
    } catch (error) {
      console.error('Failed to load auth data:', error)
    }
  },
  
  saveToStorage: async () => {
    try {
      const state = get()
      const dataToSave = {
        user: state.user,
        registrationType: state.registrationType,
        credits: state.credits,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save auth data:', error)
    }
  },
}))

export default useAuthStore;