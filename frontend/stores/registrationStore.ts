// stores/registrationStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

interface RegistrationData {
  registrationType: 'social' | 'matrimonial' | null
  
  mobile: string
  mobileVerified: boolean
  
  email: string
  emailVerified: boolean
  
  password: string
  
  currentStep: number
  completedSteps: number[]
}

interface RegistrationStore extends RegistrationData {
  setRegistrationType: (type: 'social' | 'matrimonial') => void
  setMobileData: (mobile: string, verified: boolean) => void
  setEmailData: (email: string, verified: boolean) => void
  setPassword: (password: string) => void
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: number) => void
  resetRegistration: () => void
  canProceedToStep: (step: number) => boolean
  getRegistrationPayload: () => any
  loadFromStorage: () => Promise<void>
  saveToStorage: () => Promise<void>
}

const initialState: RegistrationData = {
  registrationType: null,
  mobile: '',
  mobileVerified: false,
  email: '',
  emailVerified: false,
  password: '',
  currentStep: 0,
  completedSteps: [],
}

const STORAGE_KEY = 'registration-storage'

export const useRegistrationStore = create<RegistrationStore>()((set, get) => ({
  ...initialState,

  setRegistrationType: (type) => {
    set({ registrationType: type, currentStep: 1 })
    get().saveToStorage()
  },

  setMobileData: (mobile, verified) => {
    set({ 
      mobile, 
      mobileVerified: verified,
      currentStep: verified ? 2 : 1
    })
    if (verified) {
      get().markStepCompleted(1)
    }
    get().saveToStorage()
  },

  setEmailData: (email, verified) => {
    set({ 
      email, 
      emailVerified: verified,
      currentStep: verified ? 3 : 2
    })
    if (verified) {
      get().markStepCompleted(2)
    }
    get().saveToStorage()
  },

  setPassword: (password) => {
    set({ password })
    if (password.length >= 6) {
      get().markStepCompleted(3)
    }
    get().saveToStorage()
  },

  setCurrentStep: (step) => {
    set({ currentStep: step })
    get().saveToStorage()
  },

  markStepCompleted: (step) => {
    const { completedSteps } = get()
    if (!completedSteps.includes(step)) {
      set({ completedSteps: [...completedSteps, step] })
      get().saveToStorage()
    }
  },

  canProceedToStep: (step) => {
    const { completedSteps } = get()
    return completedSteps.includes(step - 1) || step === 1
  },

  getRegistrationPayload: () => {
    const state = get()
    return {
      mobile: state.mobile,
      email: state.email,
      password: state.password,
    }
  },

  resetRegistration: () => {
    set(initialState)
    AsyncStorage.removeItem(STORAGE_KEY)
  },

  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        set({
          registrationType: data.registrationType || null,
          mobile: data.mobile || '',
          mobileVerified: data.mobileVerified || false,
          email: data.email || '',
          emailVerified: data.emailVerified || false,
          currentStep: data.currentStep || 0,
          completedSteps: data.completedSteps || [],
        })
      }
    } catch (error) {
      console.error('Failed to load registration data:', error)
    }
  },

  saveToStorage: async () => {
    try {
      const state = get()
      const dataToSave = {
        registrationType: state.registrationType,
        mobile: state.mobile,
        mobileVerified: state.mobileVerified,
        email: state.email,
        emailVerified: state.emailVerified,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save registration data:', error)
    }
  },
}))
