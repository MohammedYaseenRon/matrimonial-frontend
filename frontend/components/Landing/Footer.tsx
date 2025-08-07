import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, Text, View } from "react-native";

export function Footer() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
      style={{ width: '100%' }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)']}
        style={{ paddingHorizontal: 24, paddingVertical: 48 }}
      >
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-white mb-3">{process.env.EXPO_PUBLIC_PROJECT_NAME}</Text>
          <Text className="text-gray-300 text-center text-lg leading-6">
            Building meaningful connections worldwide
          </Text>
        </View>
        
        <View className="flex-row justify-around mb-8">
          <View>
            <Text className="text-white font-bold mb-4 text-lg">Company</Text>
            <Text className="text-gray-300 mb-3 text-base">About Us</Text>
            <Text className="text-gray-300 mb-3 text-base">Careers</Text>
            <Text className="text-gray-300 text-base">Contact</Text>
          </View>
          <View>
            <Text className="text-white font-bold mb-4 text-lg">Support</Text>
            <Text className="text-gray-300 mb-3 text-base">Help Center</Text>
            <Text className="text-gray-300 mb-3 text-base">Safety</Text>
            <Text className="text-gray-300 text-base">Guidelines</Text>
          </View>
          <View>
            <Text className="text-white font-bold mb-4 text-lg">Legal</Text>
            <Text className="text-gray-300 mb-3 text-base">Privacy</Text>
            <Text className="text-gray-300 mb-3 text-base">Terms</Text>
            <Text className="text-gray-300 text-base">Cookies</Text>
          </View>
        </View>
        
        <View className="border-t border-gray-600 pt-6 items-center">
          <Text className="text-gray-400 text-base">
            © 2024 {process.env.EXPO_PUBLIC_PROJECT_NAME}. All rights reserved.
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center leading-5">
            Made with ❤️ for bringing people together
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}