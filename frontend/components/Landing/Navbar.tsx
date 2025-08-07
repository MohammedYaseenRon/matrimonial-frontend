import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Navbar() {
  const router = useRouter();

  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#8B5CF6' 
      }}>
        {process.env.EXPO_PUBLIC_PROJECT_NAME}
      </Text>

      <Pressable
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: 'transparent',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#8B5CF6',
        }}

        onPress={() => router.push('/auth/Login')}
      >
        <Text style={{ 
          color: '#8B5CF6', 
          fontWeight: '600',
          fontSize: 14 
        }}>
          Sign In
        </Text>
      </Pressable>
    </View>
  );
}
