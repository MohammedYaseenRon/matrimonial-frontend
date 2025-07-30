import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegistrationContextType {
    registrationType: string | null;
    setRegistrationType: (type: string | null) => void;
    loading: boolean
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

interface RegistrationProviderProps {
    children: ReactNode;
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
    const [registrationType, setRegistrationTypeState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const loadType = async () => {
            const storedType = await AsyncStorage.getItem("registrationType");
            setRegistrationTypeState(storedType);
            setLoading(false);
        };
        loadType();
    }, []);



    const setRegistrationType = async (type: string | null) => {
        if (type == null) {
            await AsyncStorage.removeItem("registrationType");
        } else {
            await AsyncStorage.setItem("registrationType", type);
        }
        setRegistrationTypeState(type);
    }

    const contextValue: RegistrationContextType = { registrationType, setRegistrationType, loading };

    return (
        <RegistrationContext.Provider value={contextValue}>
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistration = (): RegistrationContextType => {
    const context = useContext(RegistrationContext);

    if (context === undefined) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }

    return context;
};