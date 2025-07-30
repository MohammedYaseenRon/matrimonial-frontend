import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function Navbar() {
  const router = useRouter();

  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb', 
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ec4899' }}>
        Matrimonial
      </Text>

      <Pressable
        // onPress={() => router.push('/profile')}
        style={{
          padding: 8,
          backgroundColor: '#f3e8ff', // purple-100
          borderRadius: 9999,
        }}
      >
        <Feather name="user" size={22} color="#7e22ce" />
      </Pressable>
    </View>
  );
}
