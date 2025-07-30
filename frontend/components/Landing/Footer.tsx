import React from "react";
import { View,Text } from "react-native";

export function Footer() {
  return (
    <View className="bg-gray-800 px-6 py-12">
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-white mb-2">ConnectApp</Text>
        <Text className="text-gray-400 text-center">
          Building meaningful connections worldwide
        </Text>
      </View>
      
      <View className="flex-row justify-around mb-8">
        <View>
          <Text className="text-white font-bold mb-3">Company</Text>
          <Text className="text-gray-400 mb-2">About Us</Text>
          <Text className="text-gray-400 mb-2">Careers</Text>
          <Text className="text-gray-400">Contact</Text>
        </View>
        <View>
          <Text className="text-white font-bold mb-3">Support</Text>
          <Text className="text-gray-400 mb-2">Help Center</Text>
          <Text className="text-gray-400 mb-2">Safety</Text>
          <Text className="text-gray-400">Guidelines</Text>
        </View>
        <View>
          <Text className="text-white font-bold mb-3">Legal</Text>
          <Text className="text-gray-400 mb-2">Privacy</Text>
          <Text className="text-gray-400 mb-2">Terms</Text>
          <Text className="text-gray-400">Cookies</Text>
        </View>
      </View>
      
      <View className="border-t border-gray-700 pt-6 items-center">
        <Text className="text-gray-500 text-sm">
          © 2024 ConnectApp. All rights reserved.
        </Text>
      </View>
    </View>
  );
}