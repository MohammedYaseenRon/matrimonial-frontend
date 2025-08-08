import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DownloadApp() {
  return (
    <View className="bg-gradient-to-br from-pink-100 via-amber-50 to-yellow-50 px-6 py-20">
      <View className="max-w-6xl mx-auto">
        <View className="flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Left Column - Content */}
          <View className="flex-1 pr-8">
            <View className="flex-row items-center mb-4">
              <View className="w-6 h-0.5 bg-orange-500 mr-3"></View>
              <Text className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
                Mobile App
              </Text>
            </View>
            
            <Text className="text-5xl font-black mb-6 leading-tight">
              <Text className="text-gray-800">Download Our</Text>{'\n'}
              <Text className="text-orange-600">Mobile App</Text>
            </Text>
            
            <Text className="text-gray-700 text-xl leading-relaxed mb-8">
              Take your love search on the go! Get the full ConnectApp experience 
              with our feature-rich mobile application.
            </Text>

            {/* Features List */}
            <View className="mb-8 space-y-3">
              {[
                'Instant notifications for new matches',
                'Location-based discovery',
                'Offline message sync',
                'Video calling integration',
                'Advanced privacy controls'
              ].map((feature, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="bg-orange-100 p-1 rounded-full mr-3">
                    <Feather name="check" size={16} color="#ea580c" />
                  </View>
                  <Text className="text-gray-700 font-medium">{feature}</Text>
                </View>
              ))}
            </View>

            {/* Download Buttons */}
            <View className="flex-row space-x-4 mb-6">
              <TouchableOpacity className="bg-black px-6 py-4 rounded-2xl flex-row items-center shadow-xl flex-1">
                <View className="mr-4">
                  <Feather name="smartphone" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-white text-xs">Download on the</Text>
                  <Text className="text-white font-bold text-sm lg:text-lg">App Store</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity className="bg-black px-6 py-4 rounded-2xl flex-row items-center shadow-xl flex-1">
                <View className="mr-4">
                  <Text className="text-white text-2xl">🤖</Text>
                </View>
                <View>
                  <Text className="text-white text-xs">Get it on</Text>
                  <Text className="text-white font-bold text-sm lg:text-lg">Google Play</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-6">
                {Array.from({ length: 5 }, (_, index) => (
                  <Feather key={index} name="star" size={20} color="#fbbf24" style={{ marginRight: 2 }} />
                ))}
              </View>
              <Text className="text-gray-600">
                <Text className="font-bold">4.9/5</Text> from 50,000+ reviews
              </Text>
            </View>
          </View>

          {/* Right Column - App Preview */}
          <View className="w-full lg:w-2/6 max-w-md mx-auto lg:max-w-none">
            <View className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              {/* Phone Mockup */}
              <View className="bg-gradient-to-b from-orange-400 to-pink-500 rounded-3xl p-1 shadow-xl">
                <View className="bg-white w-full rounded-3xl p-6 h-96 w-48">
                  {/* Phone Content */}
                  <View className="items-center">
                    <Text className="text-2xl mb-4">📱</Text>
                    <Text className="font-bold text-lg text-gray-800 mb-2">ConnectApp</Text>
                    <Text className="text-gray-600 text-center text-sm mb-6">
                      Find your perfect match
                    </Text>
                    
                    {/* Mock Profile Cards */}
                    <View className="space-y-3 w-full">
                      {[
                        { emoji: '👩', name: 'Sarah, 28', location: 'New York' },
                        { emoji: '👨', name: 'Michael, 32', location: 'London' },
                        { emoji: '👩', name: 'Priya, 26', location: 'Mumbai' }
                      ].map((profile, index) => (
                        <View key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 p-3 rounded-xl">
                          <View className="flex-row items-center">
                            <Text className="text-xl mr-3">{profile.emoji}</Text>
                            <View>
                              <Text className="font-semibold text-gray-800 text-sm">{profile.name}</Text>
                              <Text className="text-gray-600 text-xs">{profile.location}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              
              {/* App Stats */}
              <View className="flex-row justify-around mt-6">
                <View className="items-center">
                  <Text className="text-lg font-bold text-orange-600">1M+</Text>
                  <Text className="text-gray-600 text-xs">Downloads</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-orange-600">4.9★</Text>
                  <Text className="text-gray-600 text-xs">Rating</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-orange-600">24/7</Text>
                  <Text className="text-gray-600 text-xs">Support</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
