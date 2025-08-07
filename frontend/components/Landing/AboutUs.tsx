import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Text, View } from 'react-native';

const useResponsiveDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return {
    ...screenData,
    isSmallScreen: screenData.width < 768,
    isMediumScreen: screenData.width >= 768 && screenData.width < 1024,
    isLargeScreen: screenData.width >= 1024,
  };
};

const FeatureCard = ({ title, text, bgGradient }:any) => {
  const { width, isSmallScreen } = useResponsiveDimensions();
  // Calculate card dimensions based on screen size with better responsive handling
  const isVerySmallScreen = width < 400;
  const cardWidth = isSmallScreen ? (width - 64) / 2 - 8 : undefined; // 64 for padding, 8 for margin
  const cardHeight = isVerySmallScreen ? 200 : isSmallScreen ? 180 : 160;
  const cardPadding = isVerySmallScreen ? 12 : isSmallScreen ? 16 : 20;
  
  return (
    <View 
      className="flex-1 mx-2 mb-6"
      style={isSmallScreen ? { width: cardWidth } : {}}
    >
      <LinearGradient
        colors={bgGradient}
        style={{
          borderRadius: 16,
          padding: cardPadding,
          height: cardHeight,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Text 
            className="font-bold text-white mb-3 text-center"
            style={{ 
              fontSize: isVerySmallScreen ? 14 : isSmallScreen ? 16 : 20,
              lineHeight: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 24
            }}
          >
            {title}
          </Text>
          <Text 
            className="text-white/90 text-center"
            style={{ 
              fontSize: isVerySmallScreen ? 10 : isSmallScreen ? 12 : 14,
              lineHeight: isVerySmallScreen ? 14 : isSmallScreen ? 16 : 20
            }}
          >
            {text}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const StatCard = ({ number, label }:any) => {
  const { width, isSmallScreen } = useResponsiveDimensions();
  const isVerySmallScreen = width < 400;
  const cardWidth = isSmallScreen ? (width - 64) / 3 - 8 : undefined; // 64 for padding, 8 for margin
  const cardHeight = isVerySmallScreen ? 90 : isSmallScreen ? 100 : 110;
  
  return (
    <View 
      className="bg-white rounded-xl p-5 items-center shadow-lg flex-1 mx-2"
      style={isSmallScreen ? { 
        width: cardWidth,
        height: cardHeight,
        justifyContent: 'center'
      } : {}}
    >
      <Text 
        className="font-bold text-purple-600"
        style={{ fontSize: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 24 }}
      >
        {number}
      </Text>
      <Text 
        className="text-gray-600 mt-2 text-center font-medium"
        style={{ 
          fontSize: isVerySmallScreen ? 10 : isSmallScreen ? 12 : 14,
          lineHeight: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default function AboutUs() {
  const { width, isSmallScreen } = useResponsiveDimensions();
  
  return (
    <View className="bg-gray-50">
      {/* Hero Section with Background */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
        style={{ width: '100%', minHeight: 300 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.9)', 'rgba(236, 72, 153, 0.9)']}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 }}
        >
          <Text className="text-4xl font-bold text-white text-center mb-4 leading-tight">
            About {process.env.EXPO_PUBLIC_PROJECT_NAME}
          </Text>
          <Text className="text-white/90 text-center text-lg leading-6 max-w-sm">
            Where relationships begin and friendships flourish
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* Stats Section */}
      <View className="px-6 -mt-6 mb-8">
        <View 
          className="flex-row"
          style={{ 
            justifyContent: isSmallScreen ? 'space-between' : 'space-around',
            alignItems: 'stretch'
          }}
        >
          <StatCard number="50K+" label="Active Users" />
          <StatCard number="12K+" label="Success Stories" />
          <StatCard number="98%" label="Satisfaction Rate" />
        </View>
      </View>

      {/* Main Content */}
      <View className="px-6 pb-8">
        {/* Introduction */}
        <View className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Our Story
          </Text>
          <Text className="text-gray-600 text-center leading-7 text-base">
            Welcome to <Text className="font-bold text-pink-500">{process.env.EXPO_PUBLIC_PROJECT_NAME}</Text> – a modern platform 
            blending matrimonial connections with social discovery. We believe meaningful relationships 
            come in many forms, and we're here to help you find yours.
          </Text>
        </View>

        {/* Feature Cards Grid */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
            What We Offer
          </Text>
          
          {/* First Row */}
          <View 
            className="flex-row mb-4"
            style={{ 
              justifyContent: isSmallScreen ? 'space-between' : 'flex-start',
              flexWrap: isSmallScreen ? 'nowrap' : 'wrap'
            }}
          >
            <FeatureCard
              title="Matrimonial Connections"
              text="Find your perfect life partner through our advanced compatibility matching system with shared values and culture."
              bgGradient={['#EC4899', '#F472B6']}
            />
            <FeatureCard
              title="Social Discovery"
              text="Build genuine friendships and expand your social circle in a safe, respectful environment."
              bgGradient={['#8B5CF6', '#A855F7']}
            />
          </View>
          
          {/* Second Row */}
          <View 
            className="flex-row"
            style={{ 
              justifyContent: isSmallScreen ? 'space-between' : 'flex-start',
              flexWrap: isSmallScreen ? 'nowrap' : 'wrap'
            }}
          >
            <FeatureCard
              title="Privacy & Security"
              text="Advanced privacy settings, verified profiles, and secure messaging ensure your safety is our priority."
              bgGradient={['#10B981', '#34D399']}
            />
            <FeatureCard
              title="Smart Matching"
              text="AI-powered algorithm learns your preferences to suggest compatible matches based on lifestyle and goals."
              bgGradient={['#8B5CF6', '#EC4899']}
            />
          </View>
        </View>

        {/* Mission Statement */}
        <View className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mt-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Our Mission
          </Text>
          <Text className="text-gray-700 text-center leading-6 mb-6 text-base">
            To create a world where everyone finds meaningful connections, whether it's 
            love, friendship, or companionship. We're building more than an app – we're 
            building a community.
          </Text>
          <View className="bg-white/80 rounded-xl p-5">
            <Text className="text-gray-600 text-center italic text-base leading-6">
              "Every great relationship starts with a single connection"
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}