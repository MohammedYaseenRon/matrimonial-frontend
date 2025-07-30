import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';

const FeatureCard = ({ title, text, imgUri, bgColor, iconBg }:any) => (
  <View className="flex-1 mx-2 mb-4">
    <View className={`${bgColor} rounded-2xl p-4 h-48 shadow-lg`}>
      <View className="items-center mb-3">
        <View className={`${iconBg} rounded-xl p-3`}>
          <Image
            source={imgUri}
            className="w-10 h-10"
            contentFit="contain"
          />
        </View>
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold text-white mb-2 text-center">{title}</Text>
        <Text className="text-white/90 text-xs leading-4 text-center">{text}</Text>
      </View>
    </View>
  </View>
);

const StatCard = ({ number, label }:any) => (
  <View className="bg-white rounded-xl p-4 items-center shadow-md flex-1 mx-1">
    <Text className="text-2xl font-bold text-purple-600">{number}</Text>
    <Text className="text-gray-600 text-xs mt-1 text-center">{label}</Text>
  </View>
);

export default function AboutUs() {
  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 px-6 pt-16 pb-12 rounded-b-3xl">
        <View className="items-center">
          <View className="bg-white/20 rounded-full p-4 mb-6">
            <Image
              source="https://cdn-icons-png.flaticon.com/512/4207/4207222.png"
              className="w-16 h-16"
              contentFit="contain"
            />
          </View>
          <Text className="text-4xl font-bold text-white text-center mb-3">
            About ConnectApp
          </Text>
          <Text className="text-white/90 text-center text-lg leading-6 max-w-xs">
            Where relationships begin and friendships flourish
          </Text>
        </View>
      </View>

      {/* Stats Section */}
      <View className="px-6 -mt-8 mb-8">
        <View className="flex-row">
          <StatCard number="50K+" label="Active Users" />
          <StatCard number="12K+" label="Success Stories" />
          <StatCard number="98%" label="Satisfaction Rate" />
        </View>
      </View>

      {/* Main Content */}
      <View className="px-6 pb-8">
        {/* Introduction */}
        <View className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Our Story
          </Text>
          <Text className="text-gray-600 text-center leading-6">
            Welcome to <Text className="font-bold text-pink-500">ConnectApp</Text> – a modern platform 
            blending matrimonial connections with social discovery. We believe meaningful relationships 
            come in many forms, and we're here to help you find yours.
          </Text>
        </View>

        {/* Feature Cards Grid */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            What We Offer
          </Text>
          
          {/* First Row */}
          <View className="flex-row mb-4">
            <FeatureCard
              title="💍 Matrimonial"
              text="Find your perfect life partner through our advanced compatibility matching system with shared values and culture."
              imgUri="https://cdn-icons-png.flaticon.com/512/4207/4207222.png"
              bgColor="bg-gradient-to-br from-pink-500 to-rose-400"
              iconBg="bg-white/20"
            />
            <FeatureCard
              title="🌟 Social Hub"
              text="Build genuine friendships and expand your social circle in a safe, respectful environment."
              imgUri="https://cdn-icons-png.flaticon.com/512/456/456212.png"
              bgColor="bg-gradient-to-br from-blue-500 to-cyan-400"
              iconBg="bg-white/20"
            />
          </View>
          
          {/* Second Row */}
          <View className="flex-row">
            <FeatureCard
              title="🛡️ Privacy First"
              text="Advanced privacy settings, verified profiles, and secure messaging ensure your safety is our priority."
              imgUri="https://cdn-icons-png.flaticon.com/512/456/456283.png"
              bgColor="bg-gradient-to-br from-green-500 to-emerald-400"
              iconBg="bg-white/20"
            />
            {/* <FeatureCard
              title="🎯 Smart Match"
              text="AI-powered algorithm learns your preferences to suggest compatible matches based on lifestyle and goals."
              imgUri="https://cdn-icons-png.flaticon.com/512/6337/6337681.png"
              bgColor="bg-gradient-to-br from-purple-500 to-indigo-400"
              iconBg="bg-white/20"
            /> */}
          </View>
        </View>

        {/* Mission Statement */}
        <View className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-3 text-center">
            Our Mission
          </Text>
          <Text className="text-gray-700 text-center leading-6 mb-4">
            To create a world where everyone finds meaningful connections, whether it's 
            love, friendship, or companionship. We're building more than an app – we're 
            building a community.
          </Text>
          <View className="bg-white/70 rounded-xl p-4">
            <Text className="text-gray-600 text-center italic text-sm">
              "Every great relationship starts with a single connection"
            </Text>
          </View>
        </View>

        {/* Call to Action */}
        <View className="mt-8 items-center">
          <View className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full px-8 py-4">
            <Text className="text-white font-bold text-lg">
              Start Your Journey Today
            </Text>
          </View>
          <Text className="text-gray-500 text-center mt-4 text-sm">
            Join thousands who found their perfect match
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}