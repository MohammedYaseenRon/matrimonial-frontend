import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const useResponsiveDimensions = () => {
  const width = screenWidth;
  const isSmallScreen = width < 768;
  
  return { width, isSmallScreen };
};


const stats = [
  {
    number: "2M+",
    label: "Happy Couples",
    icon: <Feather name="heart" size={20} color="red" />
  },
  {
    number: "50M+",
    label: "Active Users",
    icon: <Feather name="users" size={20} color="blue" />
  },
  {
    number: "190+",
    label: "Countries",
    icon: <Feather name="globe" size={20} color="green" />
  },
  {
    number: "15+",
    label: "Years Experience",
    icon: <Feather name="clock" size={20} color="orange" />
  }
];




export default function AboutUs() {
  const { width, isSmallScreen } = useResponsiveDimensions();
  
  return (
    <View className="bg-gradient-to-br from-rose-300 via-pink-200 to-purple-200 px-6 py-20">
      <View className="max-w-6xl mx-auto">
        {/* Header Section */}
        <View className="items-center mb-16">
          <View className="flex-row items-center mb-4 border border-pink-200 rounded-xl p-2 bg-white/70">
            <View className="w-6 h-0.5 bg-pink-500 mr-3"></View>
            <Text className="text-pink-600 font-semibold text-sm uppercase tracking-wider">
              About SoulMate Stories
            </Text>
          </View>

          <Text className="text-6xl font-black text-center mb-8 leading-tight">
            <Text className="text-gray-800">Where Love Stories</Text>{'\n'}
            <Text className="text-pink-600">Begin</Text>
          </Text>

          <Text className="text-gray-700 text-center text-lg leading-relaxed max-w-4xl">
            We're more than just a matrimonial platform. We're the beginning of your
            greatest love story, connecting hearts across the globe with trust, authenticity,
            and hope.
          </Text>
        </View>

        {/* Stats Section */}
        <View className="flex-col lg:flex-row justify-center items-center gap-4">
          {stats.map((stat, index) => (
            <View key={index} className="items-center my-4 border border-pink-100 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              {stat.icon}
              <Text className="text-2xl font-black mt-2 text-gray-800">{stat.number}</Text>
              <Text className="text-sm text-gray-600 font-medium">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

